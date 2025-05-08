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

        public async Task<CleaningStaff> AddCleaningStaff(CleaningStaffDTO request)
        {
            try
            {
                
                var staff = new CleaningStaff
                {
                    UserID = request.UserID,
                    IsActive = request.IsActive,
                    Shift = request.Shift,
                    AssignedByUserID = request.AssignedByUserID
                };

                _dbContext.CleaningStaff.Add(staff);
                await _dbContext.SaveChangesAsync();

                return staff;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw new Exception("An error occurred while attempting to save the cleaning staff record.");
            }
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
                var staff = await _dbContext.CleaningStaff.FindAsync(id);

                if (staff == null)
                {
                    return null;
                }

                staff.IsActive = request.IsActive;
                staff.Shift = request.Shift;
                staff.AssignedByUserID = request.AssignedByUserID;

                _dbContext.SaveChanges();
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
                var staff = _dbContext.CleaningStaff.Find(id);
                if (staff != null)
                {
                    _dbContext.CleaningStaff.Remove(staff);
                    _dbContext.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw new Exception("An error occurred while attempting to delete cleaning staff.");
            }
        }
    }
}
