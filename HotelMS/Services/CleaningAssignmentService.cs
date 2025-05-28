using HotelMS.Data;
using HotelMS.Data.DTO;
using HotelMS.Data.Interfaces;
using HotelMS.Models;
using Microsoft.EntityFrameworkCore;

namespace HotelMS.Services
{
    public class CleaningAssignmentService : ICleaningAssignmentService
    {
        private readonly DataContext _dbContext;

        public CleaningAssignmentService(DataContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<CleaningAssignment> AddAssignment(CleaningAssignmentDTO request)
        {
            var room = await _dbContext.Rooms
                .Include(r => r.RoomStatus)
                .FirstOrDefaultAsync(r => r.RoomID == request.RoomID);
            if (room == null)
                throw new Exception("Room not found.");

            await _dbContext.Entry(room).ReloadAsync();
            if (room.RoomStatusID != 1 && room.RoomStatusID != 2)
                throw new Exception("Cannot assign task unless room is Available or Occupied.");
            var cleaningStatus = await _dbContext.RoomStatuses
                .FirstOrDefaultAsync(rs => rs.RoomStatusName == "Cleaning");
                
            if (cleaningStatus == null)
                throw new Exception("Cleaning status not defined in RoomStatuses table.");

            room.RoomStatusID = cleaningStatus.RoomStatusID;

            var assignment = new CleaningAssignment
            {
                RoomID = request.RoomID,
                CleaningStaffID = request.CleaningStaffID,
                Status = request.Status,
                AssignedByUserID = request.AssignedByUserID,
                AssignedAt = DateTime.Now
            };

            _dbContext.CleaningAssignments.Add(assignment);
            await _dbContext.SaveChangesAsync();

            return assignment;
        }


        public async Task<CleaningAssignmentDTO> GetAssignment(int id)
        {
            var assignment = await _dbContext.CleaningAssignments
                .Include(a => a.Room)
                .Include(a => a.CleaningStaff).ThenInclude(cs => cs.User).Include(a => a.AssignedBy)
                .FirstOrDefaultAsync(a => a.CleaningAssignmentID == id);

            if (assignment == null) return null;

            return new CleaningAssignmentDTO
            {
                CleaningAssignmentID = assignment.CleaningAssignmentID,
                RoomID = assignment.RoomID,
                RoomNumber = assignment.Room.RoomNumber,
                CleaningStaffID = assignment.CleaningStaffID,
                StaffName = assignment.CleaningStaff.User.FirstName + " " + assignment.CleaningStaff.User.LastName,
                Status = assignment.Status,
                AssignedAt = assignment.AssignedAt,
                StartedAt = assignment.StartedAt,
                FinishedAt = assignment.FinishedAt,
                AssignedByName = assignment.AssignedBy != null ? assignment.AssignedBy.FirstName + " " + assignment.AssignedBy.LastName : "N/A"
            };
        }

        public async Task<IEnumerable<CleaningAssignmentDTO>> GetAllAssignments()
        {
            var assignments = await _dbContext.CleaningAssignments
                .Include(a => a.Room)
                .Include(a => a.CleaningStaff).ThenInclude(cs => cs.User).Include(a => a.AssignedBy)
                .ToListAsync();

            return assignments.Select(a => new CleaningAssignmentDTO
            {
                CleaningAssignmentID = a.CleaningAssignmentID,
                RoomID = a.RoomID,

                RoomNumber = a.Room.RoomNumber,
                CleaningStaffID = a.CleaningStaffID,
                StaffName = a.CleaningStaff.User.FirstName + " " + a.CleaningStaff.User.LastName,
                Status = a.Status,
                AssignedAt = a.AssignedAt,
                StartedAt = a.StartedAt,
                FinishedAt = a.FinishedAt,
                 AssignedByName = a.AssignedBy != null ? a.AssignedBy.FirstName + " " + a.AssignedBy.LastName : "N/A"
            });
        }

        public async Task<CleaningAssignment> UpdateAssignment(int id, CleaningAssignmentDTO request)
        {
            var assignment = await _dbContext.CleaningAssignments.FindAsync(id);
            if (assignment == null) return null;
            assignment.RoomID = request.RoomID;
            assignment.Status = request.Status;
            assignment.StartedAt = request.StartedAt;
            assignment.FinishedAt = request.FinishedAt;

            await _dbContext.SaveChangesAsync();
            return assignment;
        }

        public async Task DeleteAssignment(int id)
        {
            var assignment = await _dbContext.CleaningAssignments
                .Include(a => a.Room)
                .FirstOrDefaultAsync(a => a.CleaningAssignmentID == id);

            if (assignment != null)
            {
                var availableStatus = await _dbContext.RoomStatuses
                    .FirstOrDefaultAsync(rs => rs.RoomStatusName == "Available");

                if (availableStatus != null && assignment.Room != null)
                {
                    assignment.Room.RoomStatusID = availableStatus.RoomStatusID;
                }

                _dbContext.CleaningAssignments.Remove(assignment);
                await _dbContext.SaveChangesAsync();
            }
        }

        public async Task<bool> MarkAssignmentCompleted(int id)
        {
            var assignment = await _dbContext.CleaningAssignments
                .Include(a => a.Room)
                .FirstOrDefaultAsync(a => a.CleaningAssignmentID == id);

            if (assignment == null) return false;

            assignment.Status = "Completed";
            assignment.FinishedAt = DateTime.Now;
            var availableStatus = await _dbContext.RoomStatuses
                  .FirstOrDefaultAsync(rs => rs.RoomStatusName == "Available");

            if (assignment.Room != null && availableStatus != null)
            {
                assignment.Room.RoomStatusID = availableStatus.RoomStatusID;
            }

            await _dbContext.SaveChangesAsync();
            return true;
        }
        public async Task<bool> StartAssignment(int id)
        {
            var assignment = await _dbContext.CleaningAssignments
                .Include(a => a.Room)
                .FirstOrDefaultAsync(a => a.CleaningAssignmentID == id);

            if (assignment == null) return false;

            assignment.StartedAt = DateTime.Now;
            assignment.Status = "InProgress";

            var cleaningStatus = await _dbContext.RoomStatuses
       .FirstOrDefaultAsync(rs => rs.RoomStatusName == "Cleaning");

            if (assignment.Room != null && cleaningStatus != null)
            {
                assignment.Room.RoomStatusID = cleaningStatus.RoomStatusID;
            }
            await _dbContext.SaveChangesAsync();
            return true;
        }
        public async Task<bool> CancelAssignment(int id)
        {
            var assignment = await _dbContext.CleaningAssignments
                .Include(a => a.Room)  
                .FirstOrDefaultAsync(a => a.CleaningAssignmentID == id);

            if (assignment == null) return false;

            if (assignment.Status == "Completed")
                throw new InvalidOperationException("Cannot cancel a completed assignment.");

            assignment.Status = "Cancelled";
            assignment.StartedAt = null;
            assignment.FinishedAt = null;

            
            var availableStatus = await _dbContext.RoomStatuses
                .FirstOrDefaultAsync(rs => rs.RoomStatusName == "Available");

            if (availableStatus != null && assignment.Room != null)
            {
                assignment.Room.RoomStatusID = availableStatus.RoomStatusID;
            }

            await _dbContext.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<CleaningAssignmentDTO>> GetAssignmentsByStaffName(string fullName)
        {
            var nameLower = fullName.ToLower().Trim();

            var staff = await _dbContext.CleaningStaff
                .Include(cs => cs.User)
                .FirstOrDefaultAsync(cs =>
                    (cs.User.FirstName + " " + cs.User.LastName).ToLower() == nameLower);

            if (staff == null)
                return Enumerable.Empty<CleaningAssignmentDTO>();

            var assignments = await _dbContext.CleaningAssignments
                .Include(a => a.Room)
                .Include(a => a.CleaningStaff).ThenInclude(cs => cs.User).Include(a => a.AssignedBy)
                .Where(a => a.CleaningStaffID == staff.CleaningStaffID)
                .ToListAsync();

            return assignments.Select(a => new CleaningAssignmentDTO
            {
                CleaningAssignmentID = a.CleaningAssignmentID,
                RoomID = a.RoomID,
                RoomNumber = a.Room.RoomNumber,
                RoomStatus = a.Room.RoomStatus?.RoomStatusName ?? "Unknown",
                CleaningStaffID = a.CleaningStaffID,
                StaffName = a.CleaningStaff.User.FirstName + " " + a.CleaningStaff.User.LastName,
                Status = a.Status,
                AssignedAt = a.AssignedAt,
                StartedAt = a.StartedAt,
                FinishedAt = a.FinishedAt,
                AssignedByName = a.AssignedBy != null ? a.AssignedBy.FirstName + " " + a.AssignedBy.LastName : "N/A"
            });
        }

    }

}
