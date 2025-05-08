//using HotelMS.Data;
//using HotelMS.Data.DTO;
//using HotelMS.Data.Interfaces;
//using HotelMS.Models;
//using Microsoft.EntityFrameworkCore;

//namespace HotelMS.Services
//{
//    public class CleaningAssignmentService : ICleaningAssignmentService
//    {
//        private readonly DataContext _dbContext;

//        public CleaningAssignmentService(DataContext dbContext)
//        {
//            _dbContext = dbContext;
//        }

//        public async Task<CleaningAssignment> AddAssignment(CleaningAssignmentDTO request)
//        {
//            var assignment = new CleaningAssignment
//            {
//                RoomID = request.RoomID,
//                CleaningStaffID = request.CleaningStaffID,
//                Status = request.Status,
//                AssignedByUserID = request.AssignedByUserID,
//                AssignedAt = DateTime.Now
//            };
//            //var room = await _dbContext.Rooms.FindAsync(request.RoomID);
//            //if (room != null)
//            //{
//            //    room.Status = "Cleaning";
//            //}


//            _dbContext.CleaningAssignments.Add(assignment);
//            await _dbContext.SaveChangesAsync();

//            return assignment;
//        }

//        public async Task<CleaningAssignmentDTO> GetAssignment(int id)
//        {
//            var assignment = await _dbContext.CleaningAssignments
//                .Include(a => a.Room)
//                .Include(a => a.CleaningStaff).ThenInclude(cs => cs.User)
//                .FirstOrDefaultAsync(a => a.CleaningAssignmentID == id);

//            if (assignment == null) return null;

//            return new CleaningAssignmentDTO
//            {
//                CleaningAssignmentID = assignment.CleaningAssignmentID,
//                RoomID = assignment.RoomID,
//                RoomName = assignment.Room.Name,
//                CleaningStaffID = assignment.CleaningStaffID,
//                StaffName = assignment.CleaningStaff.User.FirstName + " " + assignment.CleaningStaff.User.LastName,
//                Status = assignment.Status,
//                AssignedAt = assignment.AssignedAt,
//                StartedAt = assignment.StartedAt,
//                FinishedAt = assignment.FinishedAt
//            };
//        }

//        public async Task<IEnumerable<CleaningAssignmentDTO>> GetAllAssignments()
//        {
//            var assignments = await _dbContext.CleaningAssignments
//                .Include(a => a.Room)
//                .Include(a => a.CleaningStaff).ThenInclude(cs => cs.User)
//                .ToListAsync();

//            return assignments.Select(a => new CleaningAssignmentDTO
//            {
//                CleaningAssignmentID = a.CleaningAssignmentID,
//                RoomID = a.RoomID,
//                RoomName = a.Room.Name,
//                CleaningStaffID = a.CleaningStaffID,
//                StaffName = a.CleaningStaff.User.FirstName + " " + a.CleaningStaff.User.LastName,
//                Status = a.Status,
//                AssignedAt = a.AssignedAt,
//                StartedAt = a.StartedAt,
//                FinishedAt = a.FinishedAt
//            });
//        }

//        public async Task<CleaningAssignment> UpdateAssignment(int id, CleaningAssignmentDTO request)
//        {
//            var assignment = await _dbContext.CleaningAssignments.FindAsync(id);
//            if (assignment == null) return null;

//            assignment.Status = request.Status;
//            assignment.StartedAt = request.StartedAt;
//            assignment.FinishedAt = request.FinishedAt;

//            await _dbContext.SaveChangesAsync();
//            return assignment;
//        }

//        public async Task DeleteAssignment(int id)
//        {
//            var assignment = await _dbContext.CleaningAssignments.FindAsync(id);
//            if (assignment != null)
//            {
//                _dbContext.CleaningAssignments.Remove(assignment);
//                await _dbContext.SaveChangesAsync();
//            }
//        }
//        public async Task<IEnumerable<CleaningAssignmentDTO>> GetAssignmentsForStaff(int staffId)
//        {
//            var assignments = await _dbContext.CleaningAssignments
//                .Include(a => a.Room)
//                .Include(a => a.CleaningStaff).ThenInclude(cs => cs.User)
//                .Where(a => a.CleaningStaffID == staffId)
//                .ToListAsync();

//            return assignments.Select(a => new CleaningAssignmentDTO
//            {
//                CleaningAssignmentID = a.CleaningAssignmentID,
//                RoomID = a.RoomID,
//                RoomName = a.Room.Name,
//                //RoomStatus = a.Room.Status,
//                CleaningStaffID = a.CleaningStaffID,
//                StaffName = a.CleaningStaff.User.FirstName + " " + a.CleaningStaff.User.LastName,
//                Status = a.Status,
//                AssignedAt = a.AssignedAt,
//                StartedAt = a.StartedAt,
//                FinishedAt = a.FinishedAt
//            });
//        }
//        public async Task<bool> MarkAssignmentCompleted(int id)
//        {
//            var assignment = await _dbContext.CleaningAssignments
//                .Include(a => a.Room)
//                .FirstOrDefaultAsync(a => a.CleaningAssignmentID == id);

//            if (assignment == null) return false;

//            assignment.Status = "Completed";
//            assignment.FinishedAt = DateTime.Now;

//            //if (assignment.Room != null)
//            //{
//            //    assignment.Room.Status = "Available";
//            //}

//            await _dbContext.SaveChangesAsync();
//            return true;
//        }
//        public async Task<bool> StartAssignment(int id)
//        {
//            var assignment = await _dbContext.CleaningAssignments
//                .Include(a => a.Room)
//                .FirstOrDefaultAsync(a => a.CleaningAssignmentID == id);

//            if (assignment == null) return false;

//            assignment.StartedAt = DateTime.Now;
//            assignment.Status = "InProgress";

           
//            //if (assignment.Room != null)
//            //    assignment.Room.Status = "Cleaning";

//            await _dbContext.SaveChangesAsync();
//            return true;
//        }
//        public async Task<bool> CancelAssignment(int id)
//        {
//            var assignment = await _dbContext.CleaningAssignments.FindAsync(id);
//            if (assignment == null) return false;

//            if (assignment.Status == "Completed")
//                throw new InvalidOperationException("Cannot cancel a completed assignment.");

//            assignment.Status = "Cancelled";
//            assignment.StartedAt = null;
//            assignment.FinishedAt = null;

//            await _dbContext.SaveChangesAsync();
//            return true;
//        }
//    }
//}
