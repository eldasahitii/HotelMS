//using HotelMS.Data;
//using HotelMS.Data.Interfaces;
//using HotelMS.Models;
//using HotelMS.Data.DTO;
//using Microsoft.EntityFrameworkCore;

//namespace HotelMS.Services
//{
//    public class CleaningStaffService
//    {
//        public class CleaningStaffService : ICleaningStaffService
//        {
//            private readonly DataContext _context;
//            public CleaningStaffService(DataContext context)
//            {
//                _context = context;
//            }
//            public async Task<CleaningStaffDTO?> GetCleaningStaff(int id)
//            {
//                var staff = await _context.CleaningStaff
//                    .Include(cs => cs.user)
//                    .FirstOrDefaultAsync(cs => cs.CleaningStaffID == id);

//                if (staff == null) return null;

//                return new CleaningStaffDTO
//                {
//                    CleaningStaffID = staff.CleaningStaffID,
//                    FirstName = staff.user.FirstName,
//                    LastName = staff.user.LastName,
//                    Email = staff.user.Email,
//                    Phone = staff.user.Phone,
//                    Address = staff.user.Address
//                };
//            }
//            public async Task<IEnumerable<CleaningStaffDTO>> GetAllCleaningStaff()
//            {
//                var staffList = await _context.CleaningStaff.Include(cs => cs.user).ToListAsync();

//                return staffList.Select(staff => new CleaningStaffDTO
//                {
//                    CleaningStaffID = staff.CleaningStaffID,
//                    FirstName = staff.user.FirstName,
//                    LastName = staff.user.LastName,
//                    Email = staff.user.Email,
//                    Phone = staff.user.Phone,
//                    Address = staff.user.Address
//                });
//            }

//            public async Task<CleaningStaffDTO?> UpdateCleaningStaff(int id, CleaningStaffDTO dto)
//            {
//                var staff = await _context.CleaningStaff.Include(cs => cs.user).FirstOrDefaultAsync(cs => cs.CleaningStaffID == id);
//                if (staff == null) return null;

//                staff.user.FirstName = dto.FirstName;
//                staff.user.LastName = dto.LastName;
//                staff.user.Email = dto.Email;
//                staff.user.Phone = dto.Phone;
//                staff.user.Address = dto.Address;

//                await _context.SaveChangesAsync();

//                return dto;
//            }
//            public async Task DeleteCleaningStaff(int id)
//            {
//                var staff = await _context.CleaningStaff.FindAsync(id);
//                if (staff == null) return false;

//                _context.CleaningStaff.Remove(staff);
//                await _context.SaveChangesAsync();
//                return true;
//            }


//            public async Task<CleaningStaffDTO> AddCleaningStaff(CleaningStaffDTO dto)
//            {

//                var newUser = new User
//                {
//                    FirstName = dto.FirstName,
//                    LastName = dto.LastName,
//                    Email = dto.Email,
//                    Phone = dto.Phone,
//                    Address = dto.Address,
//                    RoleID = 3
//                };

//                _context.Users.Add(newUser);
//                await _context.SaveChangesAsync();

//                var cleaningStaff = new CleaningStaff
//                {
//                    UserID = newUser.UserID
//                };

//                _context.CleaningStaff.Add(cleaningStaff);
//                await _context.SaveChangesAsync();

//                dto.CleaningStaffID = cleaningStaff.CleaningStaffID;
//                return dto;
//            }


//            public async Task<IEnumerable<CleaningStatusDTO>> GetAllCleaningStatuses()
//            {
//                var statuses = await _context.CleaningStatuses
//                    .Include(cs => cs.CleaningStaff).ThenInclude(staff => staff.user)
//                    .Include(cs => cs.Room)
//                    .ToListAsync();

//                return statuses.Select(s => new CleaningStatusDTO
//                {
//                    CleaningStatusID = s.CleaningStatusID,
//                    StaffName = s.CleaningStaff.user.FirstName + " " + s.CleaningStaff.user.LastName,
//                    RoomNumber = s.Room.RoomNumber,
//                    Comments = s.Comments,
//                    CleanedAt = s.CleanedAt
//                });
//            }
//        }
//    }