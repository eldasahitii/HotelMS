using HotelMS.Data;
using HotelMS.Data.DTO;
using HotelMS.Data.Interfaces;
using HotelMS.Models;
using Microsoft.EntityFrameworkCore;

namespace HotelMS.Services
{
    public class CleaningStaffService : ICleaningStaffService
    {
        private readonly DataContext _dbContext;

        public CleaningStaffService(DataContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<object> AddCleaningStaff(CleaningStaffDTO dto)
        {
            var user = await _dbContext.Users.FindAsync(dto.UserID);
            if (user == null)
                throw new Exception("User not found");

            var cleaningStaffRole = await _dbContext.Roles.FirstOrDefaultAsync(r => r.RoleType == "CleaningStaff");
            if (cleaningStaffRole == null)
                throw new Exception("Role 'CleaningStaff' not found in Roles table.");

            user.RoleID = cleaningStaffRole.RoleID;

            var staff = new CleaningStaff
            {
                UserID = dto.UserID,
                Shift = dto.Shift,
                IsActive = dto.IsActive,
                AssignedByUserID = dto.AssignedByUserID
            };

            _dbContext.CleaningStaff.Add(staff);
            await _dbContext.SaveChangesAsync();

            return new { staff.CleaningStaffID };
        }

        public async Task<CleaningStaffDTO> GetCleaningStaff(int id)
        {
            try
            {
                var cs = await _dbContext.CleaningStaff
                    .Include(c => c.User)
                    .Include(c => c.AssignedBy)
                    .FirstOrDefaultAsync(c => c.CleaningStaffID == id);

                if (cs == null) return null;

                return new CleaningStaffDTO
                {
                    CleaningStaffID = cs.CleaningStaffID,
                    UserID = cs.UserID,
                    FirstName = cs.User.FirstName,
                    LastName = cs.User.LastName,
                    Email = cs.User.Email,
                    Shift = cs.Shift,
                    IsActive = cs.IsActive,
                    AssignedByUserID = cs.AssignedByUserID,
                    AssignedByName = cs.AssignedBy != null
                        ? $"{cs.AssignedBy.FirstName} {cs.AssignedBy.LastName}"
                        : null
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw new Exception("An error occurred while attempting to fetch cleaning staff.");
            }
        }

        public async Task<IEnumerable<CleaningStaffDTO>> GetAllCleaningStaff()
        {
            try
            {
                var list = await _dbContext.CleaningStaff
                    .Include(cs => cs.User)
                    .Include(cs => cs.AssignedBy)
                    .ToListAsync();

                return list.Select(cs => new CleaningStaffDTO
                {
                    CleaningStaffID = cs.CleaningStaffID,
                    UserID = cs.UserID,
                    FirstName = cs.User.FirstName,
                    LastName = cs.User.LastName,
                    Email = cs.User.Email,
                    Shift = cs.Shift,
                    IsActive = cs.IsActive,
                    AssignedByUserID = cs.AssignedByUserID,
                    AssignedByName = cs.AssignedBy != null
                        ? $"{cs.AssignedBy.FirstName} {cs.AssignedBy.LastName}"
                        : null
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw new Exception("An error occurred while fetching all cleaning staff.");
            }
        }
        public async Task<CleaningStaff> UpdateCleaningStaff(int id, CleaningStaffDTO request)
        {
            try
            {
                var staff = await _dbContext.CleaningStaff
                    .Include(cs => cs.User)
                    .FirstOrDefaultAsync(cs => cs.CleaningStaffID == id);

                if (staff == null)
                {
                    return null;
                }

                staff.IsActive = request.IsActive;
                staff.Shift = request.Shift;
                staff.AssignedByUserID = request.AssignedByUserID;

                if (!request.IsActive)
                {
                 
                    var customerRole = await _dbContext.Roles.FirstOrDefaultAsync(r => r.RoleType == "Customer");
                    if (customerRole != null && staff.User != null)
                    {
                        staff.User.RoleID = customerRole.RoleID;
                    }
                }

                await _dbContext.SaveChangesAsync();
                return staff;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw new Exception("An error occurred while attempting to update cleaning staff.");
            }
        }

        public async Task DeleteCleaningStaff(int id)
        {
            try
            {
                var staff = await _dbContext.CleaningStaff.FindAsync(id);

                if (staff != null)
                {
                    var user = await _dbContext.Users.FindAsync(staff.UserID);
                    if (user != null)
                    {
                        var customerRole = await _dbContext.Roles.FirstOrDefaultAsync(r => r.RoleType == "Customer");
                        if (customerRole != null)
                        {
                            user.RoleID = customerRole.RoleID; 
                        }
                    }

                    _dbContext.CleaningStaff.Remove(staff);
                    await _dbContext.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw new Exception("An error occurred while attempting to delete cleaning staff and revert role.");
            }
        }

        public async Task<IEnumerable<CleaningStaffDTO>> GetAllActive()
        {
            var list = await _dbContext.CleaningStaff
                .Where(cs => cs.IsActive)
                .Include(cs => cs.User)
                .ToListAsync();

            return list.Select(cs => new CleaningStaffDTO
            {
                CleaningStaffID = cs.CleaningStaffID,
                UserID = cs.UserID,
                FirstName = cs.User.FirstName,
                LastName = cs.User.LastName,
                Email = cs.User.Email,
                Shift = cs.Shift,
                IsActive = cs.IsActive
            });
        }
        public async Task<bool> ChangeShift(int id, string newShift)
        {
            var staff = await _dbContext.CleaningStaff.FindAsync(id);
            if (staff == null) return false;

            staff.Shift = newShift;
            await _dbContext.SaveChangesAsync();
            return true;
        }
        public async Task<IEnumerable<CleaningStaffDTO>> GetByShift(string shift)
        {
            var results = await _dbContext.CleaningStaff
                .Include(cs => cs.User)
                .Where(cs => cs.Shift == shift)
                .ToListAsync();

            return results.Select(cs => new CleaningStaffDTO
            {
                CleaningStaffID = cs.CleaningStaffID,
                UserID = cs.UserID,
                FirstName = cs.User.FirstName,
                LastName = cs.User.LastName,
                Email = cs.User.Email,
                Shift = cs.Shift,
                IsActive = cs.IsActive,
                AssignedByUserID = cs.AssignedByUserID,
                AssignedByName = cs.AssignedBy != null
                    ? $"{cs.AssignedBy.FirstName} {cs.AssignedBy.LastName}"
                    : null
            });
        }


    }
}
