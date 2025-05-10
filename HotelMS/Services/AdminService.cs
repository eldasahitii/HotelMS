using System.Text;
using HotelMS.Data;
using HotelMS.Data.DTO;
using HotelMS.Data.Interfaces;
using HotelMS.Models;
using Microsoft.EntityFrameworkCore;

namespace HotelMS.Services
{
    public class AdminService : IAdminService
    {
        private readonly DataContext _context;

        public AdminService(DataContext context)
        {
            _context = context;
        }

        public async Task<string> AddUserWithRole(UserRegistrationDTO request)
        {
            var existingUser = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == request.Email);

            if (existingUser != null)
                return "User already exists";

            var role = await _context.Roles
                .FirstOrDefaultAsync(r => r.RoleType.ToLower() == request.RoleType.ToLower());

            if (role == null)
                return "Role not found";

            CreatePasswordHash(request.Password, out byte[] hash, out byte[] salt);

            var newUser = new User
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                Email = request.Email,
                PasswordHash = hash,
                PasswordSalt = salt,
                RoleID = role.RoleID
            };

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            return $"{role.RoleType} added successfully";
        }

        public async Task<IEnumerable<User>> GetUsersByRole(string roleType)
        {
            return await _context.Users
                .Where(u => u.Role.RoleType.ToLower() == roleType.ToLower())
                .ToListAsync();
        }

        public async Task<User> GetUserByIdAndRole(int id, string roleType)
        {
            return await _context.Users
                .FirstOrDefaultAsync(u => u.UserID == id && u.Role.RoleType.ToLower() == roleType.ToLower());
        }

        public async Task<User> UpdateUserByRole(int id, string roleType, UserDTO request)
        {
            var user = await GetUserByIdAndRole(id, roleType);
            if (user == null)
                return null;

            user.FirstName = request.FirstName ?? user.FirstName;
            user.LastName = request.LastName ?? user.LastName;
            user.Email = request.Email ?? user.Email;
            user.Phone = request.Phone ?? user.Phone;
            user.Address = request.Address ?? user.Address;

            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<string> DeleteUserByRole(int id, string roleType)
        {
            var user = await GetUserByIdAndRole(id, roleType);
            if (user == null)
                return $"{roleType} not found";

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return $"{roleType} deleted successfully";
        }

        public void CreatePasswordHash(string password, out byte[] hash, out byte[] salt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                salt = hmac.Key;
                hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
            }
        }
    }
}
