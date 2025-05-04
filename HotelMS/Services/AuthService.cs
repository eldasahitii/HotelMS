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
        public async Task<UserDTO> Register(UserRegistrationDTO request)
        {
            try
            {
                var existingUser = await _context.Users
                    .FirstOrDefaultAsync(u => u.Email == request.Email);

                if (existingUser != null)
                {
                    throw new Exception("User with this email already exists.");
                }

                CreatePasswordHash(request.Password, out byte[] hash, out byte[] salt);

                User user = new User
                {
                    FirstName = request.FirstName,
                    LastName = request.LastName,
                    Email = request.Email,
                    PasswordHash = hash,
                    PasswordSalt = salt,
                    RoleID = request.RoleID,
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                return user.Adapt<UserDTO>();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
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

            return CreateToken(user);
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


        private String CreateToken(User user)
        {
            List<Claim> claims = new List<Claim>
            {
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role,user.RoleID.ToString()),
                new Claim(ClaimTypes.NameIdentifier,user.UserID.ToString()),
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
               _configuration.GetSection("AppSettings:JwtSecretKey").Value));
            var cred = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddDays(7),
                signingCredentials: cred);

            var jwt = new JwtSecurityTokenHandler().WriteToken(token);

            return jwt;
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