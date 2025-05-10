using HotelMS.Data;
using HotelMS.Data.DTO;
using HotelMS.Data.Interfaces;
using HotelMS.Models;
using Mapster;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
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
                var existingUser = await _context.Users
                    .FirstOrDefaultAsync(u => u.Email == request.Email);

                if (existingUser != null)
                {
                    throw new ArgumentException("User with this email already exists.");
                }

                var customerRole = await _context.Roles.FirstOrDefaultAsync(r => r.RoleType == "Customer");
                if (customerRole == null)
                {
                    throw new Exception("Customer role not found in the system.");
                }
                CreatePasswordHash(request.Password, out byte[] hash, out byte[] salt);

                User user = new User
                {
                    FirstName = request.FirstName,
                    LastName = request.LastName,
                    Email = request.Email,
                    PasswordHash = hash,
                    PasswordSalt = salt,
                    RoleID = customerRole.RoleID,
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();
                var token = await CreateToken(user);
                return user.Adapt<User>();
            }
            catch (Exception ex)
            {
                Console.WriteLine("Registration error: " + ex.Message);
                throw new Exception("An error occurred while attempting to save the user record.");

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

        //    public async Task<string> CreateToken(User user)
        //    {
        //        var role = await _context.Roles
        //            .FirstOrDefaultAsync(r => r.RoleID == user.RoleID);

        //        if (role == null)
        //        {
        //            throw new Exception("Role not found for the user.");
        //        }

        //        List<Claim> claims = new List<Claim>
        //{
        //    new Claim(ClaimTypes.Email, user.Email),
        //    new Claim(ClaimTypes.NameIdentifier, user.UserID.ToString()),
        //    new Claim(ClaimTypes.Role, role.RoleType),
        //};

        //        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
        //            _configuration.GetSection("AppSettings:JwtSecretKey").Value));
        //        var cred = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

        //        var token = new JwtSecurityToken(
        //         issuer: _configuration["Jwt:Issuer"],
        //         audience: _configuration["Jwt:Audience"],
        //         claims: claims,
        //         expires: DateTime.Now.AddDays(7),
        //         signingCredentials: cred);


        //        var jwt = new JwtSecurityTokenHandler().WriteToken(token);

        //        return jwt;
        //    }
        public async Task<string> CreateToken(User user)
        {
            var role = await _context.Roles
                .FirstOrDefaultAsync(r => r.RoleID == user.RoleID);

            if (role == null)
                throw new Exception("Role not found for the user.");

            var claims = new List<Claim>
    {
        new Claim(ClaimTypes.Email, user.Email),
        new Claim(ClaimTypes.NameIdentifier, user.UserID.ToString()),
        new Claim(ClaimTypes.Role, role.RoleType)
    };

            var secretKey = _configuration["AppSettings:JwtSecretKey"];
            if (string.IsNullOrEmpty(secretKey))
                throw new Exception("JWT secret key is missing in configuration.");

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);

            var token = new JwtSecurityToken(
                issuer: null,
                audience: null,
                claims: claims,
                expires: DateTime.UtcNow.AddDays(7),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
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