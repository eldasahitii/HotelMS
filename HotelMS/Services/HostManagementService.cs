using System.Security.Cryptography;
using System.Text;
using HotelMS.Data;
using HotelMS.Data.DTO;
using HotelMS.Data.Interfaces;
using HotelMS.Models;
using Microsoft.EntityFrameworkCore;


namespace HotelMS.Services
{
    public class HostManagementService : IHostManagementService
    {
        private readonly DataContext _dbContext;

        public HostManagementService(DataContext dbcontext)
        {
            _dbContext = dbcontext;
        }

        public async Task<List<HostDTO>> GetAllHostsAsync()
        {
            var hostRole = await _dbContext.Roles.FirstOrDefaultAsync(r => r.RoleType == "RestaurantHost");
            if (hostRole == null) return new List<HostDTO>();

            var hosts = await _dbContext.Users
                .Where(u => u.RoleID == hostRole.RoleID)
                .ToListAsync();
            return hosts.Select(u => new HostDTO
            {
                UserID = u.UserID,
                FirstName = u.FirstName,
                LastName = u.LastName,
                Email = u.Email
            }).ToList();
        }
        public async Task<HostDTO> GetHostByIdAsync(int userId)
        {
            var user = await _dbContext.Users.FindAsync(userId);
            if (user == null) return null;

            var role = await _dbContext.Roles.FindAsync(user.RoleID);
            if (role?.RoleType != "RestaurantHost") return null;

            return new HostDTO
            {
                UserID = user.UserID,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email
            };
        }
        public async Task<HostDTO> CreateHostAsync(HostDTO hostDto)
        {
            var hostRole = await _dbContext.Roles.FirstOrDefaultAsync(r => r.RoleType == "RestaurantHost");
            if (hostRole == null) throw new Exception("Host role not found");

            CreatePasswordHash(hostDto.Password, out byte[] hash, out byte[] salt);

            var user = new User
            {
                FirstName = hostDto.FirstName,
                LastName = hostDto.LastName,
                Email = hostDto.Email,
                PasswordHash = hash,
                PasswordSalt = salt,
                RoleID = hostRole.RoleID
            };

            _dbContext.Users.Add(user);
            await _dbContext.SaveChangesAsync();

            return new HostDTO
            {
                UserID = user.UserID,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email
            };
        }
        public async Task<HostDTO> UpdateHostAsync(int id, HostDTO updatedHost)
        {
            var user = await _dbContext.Users.FindAsync(id);
            if (user == null) return null;

            var role = await _dbContext.Roles.FindAsync(user.RoleID);
            if (role?.RoleType != "RestaurantHost") return null;

            user.FirstName = updatedHost.FirstName;
            user.LastName = updatedHost.LastName;
            user.Email = updatedHost.Email;

            await _dbContext.SaveChangesAsync();

            return new HostDTO
            {
                UserID = user.UserID,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email
            };
        }

        public async Task<bool> DeleteHostAsync(int userId)
        {
            var user = await _dbContext.Users.FindAsync(userId);
            if (user == null) return false;

            var role = await _dbContext.Roles.FindAsync(user.RoleID);
            if (role?.RoleType != "RestaurantHost") return false;

            _dbContext.Users.Remove(user);
            await _dbContext.SaveChangesAsync();
            return true;
        }
        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using var hmac = new HMACSHA512();
            passwordSalt = hmac.Key;
            passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
        }
    }
}
