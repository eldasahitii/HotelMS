using HotelMS.Data;
using HotelMS.Data.DTO;
using HotelMS.Data.Interfaces;
using HotelMS.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HotelMS.Services
{
    public class ServiceRecepsionistService : IServiceRecepsionistService
    {
        private readonly DataContext _context;

        public ServiceRecepsionistService(DataContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ServiceRecepsionistDTO>> GetAllRecepsionists()
        {
            var recepsionists = await _context.ServiceRecepsionists
                .Include(sr => sr.User)
                .Include(sr => sr.AssignedByUser)
                .ToListAsync();

            var result = new List<ServiceRecepsionistDTO>();

            foreach (var sr in recepsionists)
            {
                result.Add(new ServiceRecepsionistDTO
                {
                    ServiceReceptionistID = sr.ServiceReceptionistID,
                    UserID = sr.UserID,
                    FirstName = sr.User?.FirstName,
                    LastName = sr.User?.LastName,
                    Email = sr.User?.Email,
                    Shift = sr.Shift,
                    AssignedByUserID = sr.AssignedByUserID,
                    AssignedByUserName = sr.AssignedByUser != null
                        ? $"{sr.AssignedByUser.FirstName} {sr.AssignedByUser.LastName}"
                        : null,
                    AssignedAt = sr.AssignedAt
                });
            }

            return result;
        }

        public async Task<ServiceRecepsionistDTO> GetRecepsionistById(int id)
        {
            var sr = await _context.ServiceRecepsionists
                .Include(sr => sr.User)
                .Include(sr => sr.AssignedByUser)
                .FirstOrDefaultAsync(r => r.ServiceReceptionistID == id);

            if (sr == null)
                return null;

            return new ServiceRecepsionistDTO
            {
                ServiceReceptionistID = sr.ServiceReceptionistID,
                UserID = sr.UserID,
                FirstName = sr.User?.FirstName,
                LastName = sr.User?.LastName,
                Email = sr.User?.Email,
                Shift = sr.Shift,
                AssignedByUserID = sr.AssignedByUserID,
                AssignedByUserName = sr.AssignedByUser != null
                    ? $"{sr.AssignedByUser.FirstName} {sr.AssignedByUser.LastName}"
                    : null,
                AssignedAt = sr.AssignedAt
            };
        }

        public async Task<ServiceRecepsionistDTO> AddRecepsionist(int assignedByUserId, ServiceRecepsionistDTO dto)
        {
            var user = await _context.Users.FindAsync(dto.UserID);
            if (user == null)
                throw new Exception($"User with ID {dto.UserID} does not exist.");

            var assigner = await _context.Users.FindAsync(assignedByUserId);
            if (assigner == null)
                throw new Exception($"User with ID {assignedByUserId} does not exist.");

            var receptionistRole = await _context.Roles.FirstOrDefaultAsync(r => r.RoleType == "ServiceRecepsionist");
            if (receptionistRole == null)
                throw new Exception("Role 'ServiceRecepsionist' does not exist.");

            // Assign ServiceRecepsionist role to user
            user.RoleID = receptionistRole.RoleID;

            var recepsionist = new ServiceRecepsionist
            {
                UserID = user.UserID,
                Shift = dto.Shift,
                AssignedByUserID = assignedByUserId,
                AssignedAt = DateTime.UtcNow
            };

            _context.ServiceRecepsionists.Add(recepsionist);
            await _context.SaveChangesAsync();

            dto.ServiceReceptionistID = recepsionist.ServiceReceptionistID;
            dto.AssignedByUserID = assignedByUserId;
            dto.AssignedByUserName = $"{assigner.FirstName} {assigner.LastName}";
            dto.AssignedAt = recepsionist.AssignedAt;
            dto.FirstName = user.FirstName;
            dto.LastName = user.LastName;
            dto.Email = user.Email;

            return dto;
        }

        public async Task DeleteRecepsionist(int id)
        {
            var recepsionist = await _context.ServiceRecepsionists.FindAsync(id);
            if (recepsionist != null)
            {
                var user = await _context.Users.FindAsync(recepsionist.UserID);

                if (user != null)
                {
                    var defaultRole = await _context.Roles.FirstOrDefaultAsync(r => r.RoleType == "Customer");
                    if (defaultRole != null)
                    {
                        user.RoleID = defaultRole.RoleID;
                        _context.Users.Update(user);
                    }
                }

                _context.ServiceRecepsionists.Remove(recepsionist);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<ServiceRecepsionistDTO> UpdateRecepsionist(int id, ServiceRecepsionistDTO dto)
        {
            var existing = await _context.ServiceRecepsionists
                .Include(sr => sr.User)
                .Include(sr => sr.AssignedByUser)
                .FirstOrDefaultAsync(r => r.ServiceReceptionistID == id);

            if (existing == null)
                return null;

            existing.Shift = dto.Shift;
            await _context.SaveChangesAsync();

            return new ServiceRecepsionistDTO
            {
                ServiceReceptionistID = existing.ServiceReceptionistID,
                UserID = existing.UserID,
                FirstName = existing.User?.FirstName,
                LastName = existing.User?.LastName,
                Email = existing.User?.Email,
                Shift = existing.Shift,
                AssignedByUserID = existing.AssignedByUserID,
                AssignedByUserName = existing.AssignedByUser != null
                    ? $"{existing.AssignedByUser.FirstName} {existing.AssignedByUser.LastName}"
                    : null,
                AssignedAt = existing.AssignedAt
            };
        }
    }
}
