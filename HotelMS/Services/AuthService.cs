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
            User user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null)
            {
                Console.WriteLine($"No user found with email{request.Email}");
                return null;
            }
            if (!VerifyingPasswordHash(request.Password, user.PasswordHash, user.PasswordSalt))
            {
                Console.WriteLine($"Invalid password for user {request.Email}");
                return null;
            }
            Console.WriteLine($"User{request.Email} logged in successfully.");
            return await CreateToken(user);
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
            Console.WriteLine(" CreateToken called");

            var role = await _context.Roles.FirstOrDefaultAsync(r => r.RoleID == user.RoleID);
            if (role == null)
            {
                Console.WriteLine(" Role not found for user: " + user.RoleID);
                throw new Exception("Role not found for the user.");
            }

            Console.WriteLine(" Role found: " + role.RoleType);

            var claims = new List<Claim>
{
    new Claim("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress", user.Email ?? ""),
    new Claim("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier", user.UserID.ToString()),
    new Claim("http://schemas.microsoft.com/ws/2008/06/identity/claims/role", role.RoleType ?? "")
};
 
            var secretKey = _configuration["AppSettings:JwtSecretKey"];
            Console.WriteLine(" JWT Secret Loaded: " + (secretKey ?? "NULL"));

            if (string.IsNullOrEmpty(secretKey))
            {
                Console.WriteLine(" JWT secret is null or empty");
                throw new Exception("JWT secret key is missing in configuration.");
            }

            var keyBytes = Encoding.UTF8.GetBytes(secretKey);
            Console.WriteLine(" Key bytes length: " + keyBytes.Length);

            var key = new SymmetricSecurityKey(keyBytes);
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);

            Console.WriteLine(" Creating token...");
            var token = new JwtSecurityToken(
                issuer: null,
                audience: null,
                claims: claims,
                expires: DateTime.UtcNow.AddDays(7),
                signingCredentials: credentials
            );

            var writtenToken = new JwtSecurityTokenHandler().WriteToken(token);
            Console.WriteLine("Token created");
            return writtenToken;
        }

        public void CreatePasswordHash(string password, out byte[] hash, out byte[] salt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                salt = hmac.Key;
                hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
            }
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