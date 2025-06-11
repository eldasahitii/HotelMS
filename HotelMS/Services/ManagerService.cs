using HotelMS.Data;
using HotelMS.Data.DTO;
using HotelMS.Data.Interfaces;
using HotelMS.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HotelMS.Services
{
    public class ManagerService : IManagerService
    {
        private readonly DataContext _dbContext;

        public ManagerService(DataContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<ManagerDTO> CreateManager(ManagerDTO request)
        {
            var manager = new Manager
            {
                UserID = request.UserID,
                ManagerTypeID = request.ManagerTypeID,
                AssignedAt = DateTime.UtcNow
            };

            _dbContext.Managers.Add(manager);


            var user = await _dbContext.Users.FindAsync(request.UserID);
            if (user != null)
            {
                if (request.ManagerTypeID == 1)
                    user.RoleID = 2; // RoomManager
                else if (request.ManagerTypeID == 2)
                    user.RoleID = 4; // CleaningManager
                else if (request.ManagerTypeID == 3)
                    user.RoleID = 5; // RestaurantManager
                else if (request.ManagerTypeID == 4)
                    user.RoleID = 7; // ServicesManager
                else
                    user.RoleID = 10; // Default to Customer
            }

            await _dbContext.SaveChangesAsync();

            return await GetManagerById(manager.ManagerID);
        }


        public async Task<ManagerDTO> GetManagerById(int id)
        {
            var manager = await _dbContext.Managers
                .Include(m => m.User)
                .Include(m => m.ManagerType)
                .FirstOrDefaultAsync(m => m.ManagerID == id);

            if (manager == null) return null;

            return new ManagerDTO
            {
                ManagerID = manager.ManagerID,
                UserID = manager.UserID,
                UserFullName = $"{manager.User.FirstName} {manager.User.LastName}",
                Email = manager.User.Email,
                ManagerTypeID = manager.ManagerTypeID,
                ManagerTypeName = manager.ManagerType.Name,
                AssignedAt = manager.AssignedAt
            };
        }

        public async Task<IEnumerable<ManagerDTO>> GetAllManagers()
        {
            var managers = await _dbContext.Managers
                .Include(m => m.User)
                .Include(m => m.ManagerType)
                .ToListAsync();

            return managers.Select(m => new ManagerDTO
            {
                ManagerID = m.ManagerID,
                UserID = m.UserID,
                UserFullName = $"{m.User.FirstName} {m.User.LastName}",
                Email = m.User.Email,
                ManagerTypeID = m.ManagerTypeID,
                ManagerTypeName = m.ManagerType.Name,
                AssignedAt = m.AssignedAt
            });
        }

        public async Task<ManagerDTO> UpdateManager(int id, ManagerDTO request)
        {
            var manager = await _dbContext.Managers.FindAsync(id);
            if (manager == null) return null;

            manager.UserID = request.UserID;
            manager.ManagerTypeID = request.ManagerTypeID;
            manager.AssignedAt = DateTime.UtcNow;

            var user = await _dbContext.Users.FindAsync(manager.UserID);
            if (user != null)
            {
                if (request.ManagerTypeID == 1)
                    user.RoleID = 2; // Room Manager
                else if (request.ManagerTypeID == 2)
                    user.RoleID = 4; // Cleaning Manager
                else if (request.ManagerTypeID == 3)
                    user.RoleID = 5; // Restaurant Manager
                else if (request.ManagerTypeID == 4)
                    user.RoleID = 7; // Services Manager
                else
                    user.RoleID = 10; // Default to Customer
            }

            await _dbContext.SaveChangesAsync();

            return await GetManagerById(id);
        }


        public async Task<ManagerDTO> DeleteManager(int id)
        {
            var manager = await _dbContext.Managers
                .Include(m => m.User)
                .Include(m => m.ManagerType)
                .FirstOrDefaultAsync(m => m.ManagerID == id);

            if (manager == null) return null;

            var managerDTO = new ManagerDTO
            {
                ManagerID = manager.ManagerID,
                UserID = manager.UserID,
                UserFullName = $"{manager.User.FirstName} {manager.User.LastName}",
                Email = manager.User.Email,
                ManagerTypeID = manager.ManagerTypeID,
                ManagerTypeName = manager.ManagerType.Name,
                AssignedAt = manager.AssignedAt
            };

            var user = await _dbContext.Users.FindAsync(manager.UserID);
            if (user != null)
            {
                user.RoleID = 10; 
            }

            _dbContext.Managers.Remove(manager);
            await _dbContext.SaveChangesAsync();

            return managerDTO;
        }


        public async Task<IEnumerable<ManagerTypeDTO>> GetManagerTypes()
        {
            return await _dbContext.ManagerTypes
                .Select(mt => new ManagerTypeDTO
                {
                    ManagerTypeID = mt.ManagerTypeID,
                    Name = mt.Name
                })
                .ToListAsync();
        }

    }
}
