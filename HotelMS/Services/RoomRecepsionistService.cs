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
    public class RoomRecepsionistService : IRoomRecepsionistService
    {
        private readonly DataContext _context;

        public RoomRecepsionistService(DataContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<RoomRecepsionistDTO>> GetAllRecepsionists()
        {
            var recepsionists = await _context.RoomRecepsionists
                .Include(rr => rr.User)
                .Include(rr => rr.AssignedByUser)
                .ToListAsync();

            var result = new List<RoomRecepsionistDTO>();

            foreach (var rr in recepsionists)
            {
                result.Add(new RoomRecepsionistDTO
                {
                    RoomReceptionistID = rr.RoomReceptionistID,
                    UserID = rr.UserID,
                    FirstName = rr.User?.FirstName,
                    LastName = rr.User?.LastName,
                    Email = rr.User?.Email,
                    Shift = rr.Shift,
                    AssignedByUserID = rr.AssignedByUserID,
                    AssignedByUserName = rr.AssignedByUser != null
                        ? $"{rr.AssignedByUser.FirstName} {rr.AssignedByUser.LastName}"
                        : null,
                    AssignedAt = rr.AssignedAt
                });
            }

            return result;
        }

        public async Task<RoomRecepsionistDTO> GetRecepsionistById(int id)
        {
            var rr = await _context.RoomRecepsionists
                .Include(rr => rr.User)
                .Include(rr => rr.AssignedByUser)
                .FirstOrDefaultAsync(r => r.RoomReceptionistID == id);

            if (rr == null)
                return null;

            return new RoomRecepsionistDTO
            {
                RoomReceptionistID = rr.RoomReceptionistID,
                UserID = rr.UserID,
                FirstName = rr.User?.FirstName,
                LastName = rr.User?.LastName,
                Email = rr.User?.Email,
                Shift = rr.Shift,
                AssignedByUserID = rr.AssignedByUserID,
                AssignedByUserName = rr.AssignedByUser != null
                    ? $"{rr.AssignedByUser.FirstName} {rr.AssignedByUser.LastName}"
                    : null,
                AssignedAt = rr.AssignedAt
            };
        }

        public async Task<RoomRecepsionistDTO> AddRecepsionist(int assignedByUserId, RoomRecepsionistDTO dto)
        {
            var user = await _context.Users.FindAsync(dto.UserID);
            if (user == null)
                throw new Exception($"User with ID {dto.UserID} does not exist.");

            var assigner = await _context.Users.FindAsync(assignedByUserId);
            if (assigner == null)
                throw new Exception($"User with ID {assignedByUserId} does not exist.");

            var receptionistRole = await _context.Roles.FirstOrDefaultAsync(r => r.RoleType == "RoomRecepsionist");
            if (receptionistRole == null)
                throw new Exception("Role 'RoomRecepsionist' does not exist.");

           
            user.RoleID = receptionistRole.RoleID;

            var recepsionist = new RoomRecepsionist
            {
                UserID = user.UserID,
                Shift = dto.Shift,
                AssignedByUserID = assignedByUserId,
                AssignedAt = DateTime.UtcNow
            };

            _context.RoomRecepsionists.Add(recepsionist);
            await _context.SaveChangesAsync();

            
            dto.RoomReceptionistID = recepsionist.RoomReceptionistID;
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
            var recepsionist = await _context.RoomRecepsionists.FindAsync(id);
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

                _context.RoomRecepsionists.Remove(recepsionist);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<RoomRecepsionistDTO> UpdateRecepsionist(int id, RoomRecepsionistDTO dto)
        {
            var existing = await _context.RoomRecepsionists
                .Include(rr => rr.User)
                .Include(rr => rr.AssignedByUser)
                .FirstOrDefaultAsync(r => r.RoomReceptionistID == id);

            if (existing == null)
                return null;

            existing.Shift = dto.Shift;
            await _context.SaveChangesAsync();

            return new RoomRecepsionistDTO
            {
                RoomReceptionistID = existing.RoomReceptionistID,
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
