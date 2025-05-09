using System.Linq;
using System.Text;
using HotelMS.Data;
using HotelMS.Data.DTO;
using HotelMS.Data.Interfaces;
using HotelMS.Models;
using Microsoft.EntityFrameworkCore;

namespace HotelMS.Services
{
    public class AdminService:IAdminService
    {
        private readonly DataContext _context;

        public AdminService(DataContext context)
        {
            _context = context;
        }

        public async Task<string> AddManager(UserRegistrationDTO request)
        {
            // Check if the user already exists
            var existingUser = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == request.Email);

            if (existingUser != null)
            {
                return "User already exists";
            }

            // Look up the manager role by name instead of RoleID
            var managerRole = await _context.Roles.FirstOrDefaultAsync(r => r.RoleType == "Manager");
            if (managerRole == null)
            {
                return "Manager role not found";
            }

            // Hash the password
            CreatePasswordHash(request.Password, out byte[] hash, out byte[] salt);

            // Create the new user
            var newUser = new User
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                Email = request.Email,
                PasswordHash = hash,
                PasswordSalt = salt,
                RoleID = managerRole.RoleID, // Assign RoleID based on the RoleName
            };

            // Add the new user to the database
            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            return "Manager added successfully";
        }


        public void CreatePasswordHash(string password, out byte[] hash, out byte[] salt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                salt = hmac.Key;
                hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
            }
        }
        public async Task<User> GetManagerByID(int id)
        {
            var manager = await _context.Users
                .FirstOrDefaultAsync(u => u.UserID == id && u.Role.RoleType == "Manager");

            return manager;
        }

        public async Task<IEnumerable<User>> GetManagers()
        {
            var managers = await _context.Users
                .Where(u => u.Role.RoleType == "Manager")
                .ToListAsync();

            return managers;
        }

        public async Task<User> UpdateManager(int id, UserDTO request)
        {
            try
            {
                var manager = await _context.Users
                    .FirstOrDefaultAsync(u => u.UserID == id && u.Role.RoleType == "Manager");

                if (manager == null)
                {
                    return null; 
                }

                manager.FirstName = request.FirstName ?? manager.FirstName;
                manager.LastName = request.LastName ?? manager.LastName;
                manager.Email = request.Email ?? manager.Email;
                manager.Phone = request.Phone ?? manager.Phone;
                manager.Address = request.Address ?? manager.Address;

                await _context.SaveChangesAsync();

                return manager;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw new Exception("An error occurred while attempting to save the manager record.");
            }
        }

        public async Task<string> DeleteManager(int id)
        {
            var manager = await _context.Users
                .FirstOrDefaultAsync(u => u.UserID == id && u.Role.RoleType == "Manager");
                if(manager == null)
                {
                    return "Manager not Found";
                }

                _context.Users.Remove(manager);
                await _context.SaveChangesAsync();

                return "Manager deleted successfully";
            }
        }

    }

