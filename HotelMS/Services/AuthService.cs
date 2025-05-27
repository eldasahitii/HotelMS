using HotelMS.Data;
using HotelMS.Data.DTO;
using HotelMS.Data.Interfaces;
using HotelMS.Models;
using Mapster;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Linq.Expressions;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;


namespace HotelMS.Services
{
    public class AuthService : IAuthService
    {
        private readonly DataContext _context;
        private readonly IConfiguration _configuration;
        public AuthService(DataContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;

        }
    
        public async Task<User> Register(UserRegistrationDTO request)
        {
            try
            {
                if (string.IsNullOrEmpty(request.RoleType))
                    throw new Exception("RoleType is required");

                var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
                if (existingUser != null)
                    throw new ArgumentException("User with this email already exists.");

                var role = await _context.Roles.FirstOrDefaultAsync(r => r.RoleType == request.RoleType);
                if (role == null)
                    throw new Exception("Specified role does not exist.");

                CreatePasswordHash(request.Password, out byte[] hash, out byte[] salt);

                var user = new User
                {
                    FirstName = request.FirstName,
                    LastName = request.LastName,
                    Email = request.Email,
                    PasswordHash = hash,
                    PasswordSalt = salt,
                    RoleID = role.RoleID,
                    CreatedAt = DateTime.UtcNow,
                    Phone = request.Phone

                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();
                return user;
            }
            catch (Exception ex)
            {
                Console.WriteLine("[Register] Error: " + ex.ToString());
                throw;
            }
        }
        public async Task<string> Login(UserLoginDTO request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null || !VerifyingPasswordHash(request.Password, user.PasswordHash, user.PasswordSalt))
                return null;

            // Create Refresh Token
            string refreshToken = GenerateRefreshToken();
            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(7);
            await _context.SaveChangesAsync();

            // Create Access Token
            var accessToken = await CreateToken(user);

            // Return both
            return $"{accessToken}|||{refreshToken}";
        }


        public async Task<UserDTO> ChangePassword(int UserID, ChangePasswordDTO request)
        {
            try
            {
                CreatePasswordHash(request.NewPassword, out byte[] hash, out byte[] salt);

                var user = _context.Users.Find(UserID);
                if (user != null)
                {
                    if (!VerifyingPasswordHash(request.OldPassword, user.PasswordHash, user.PasswordSalt))
                    {
                        return null;
                    }

                    user.PasswordHash = hash;
                    user.PasswordSalt = salt;

                    await _context.SaveChangesAsync();
                }
                return user.Adapt<UserDTO>();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw new Exception("An error occurred while attempting to save the user record");
            }
        }
        public async Task<string> CreateToken(User user)
        {
            Console.WriteLine("CreateToken called");

            var role = await _context.Roles.FirstOrDefaultAsync(r => r.RoleID == user.RoleID);
            if (role == null)
                throw new Exception("Role not found for the user.");

            var claims = new List<Claim>
    {
        new Claim(ClaimTypes.Email, user.Email ?? ""),
        new Claim(ClaimTypes.NameIdentifier, user.UserID.ToString()),
        new Claim(ClaimTypes.Role, role.RoleType ?? "")
    };

            var secretKey = _configuration["Jwt:Key"];
            if (string.IsNullOrEmpty(secretKey))
                throw new Exception("JWT secret key is missing in configuration.");

            var keyBytes = Encoding.UTF8.GetBytes(secretKey);
            var key = new SymmetricSecurityKey(keyBytes);
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private string GenerateRefreshToken()
        {
            var randomBytes = new byte[64];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomBytes);
                return Convert.ToBase64String(randomBytes);
            }
        }

        public void CreatePasswordHash(string password, out byte[] hash, out byte[] salt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                salt = hmac.Key;
                hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
            }
        }
        public async Task<(string accessToken, string refreshToken)> RotateRefreshToken(string oldRefreshToken)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.RefreshToken == oldRefreshToken);
            if (user == null || user.RefreshTokenExpiry < DateTime.UtcNow)
                return (null, null);

            // Generate new refresh token
            var newRefreshToken = GenerateRefreshToken();
            user.RefreshToken = newRefreshToken;
            user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(7);

            // Generate new access token
            var newAccessToken = await CreateToken(user);

            await _context.SaveChangesAsync();

            return (newAccessToken, newRefreshToken);
        }

        private bool VerifyingPasswordHash(string password, byte[] hash, byte[] salt)
        {
            using (var hmac = new HMACSHA512(salt))
            {
                var computeHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
                return computeHash.SequenceEqual(hash);
            }
        }
    }
}