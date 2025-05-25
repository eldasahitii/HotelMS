//using HotelMS.Data;
//using HotelMS.Data.DTO;
//using HotelMS.Data.Interfaces;
//using HotelMS.Models;
//using Microsoft.EntityFrameworkCore;
//using static System.Runtime.InteropServices.JavaScript.JSType;

//namespace HotelMS.Services
//{
//    public class HotelServiceReservationService : IHotelServiceReservationService
//    {
//        private readonly DataContext _context;

//        public HotelServiceReservationService (DataContext context)
//        {
//            _context = context;
//        }

//        public async Task<IEnumerable<HotelServiceReservation>> GetAllReservationsAsync()
//        {
//            return await _context.HotelServiceReservations
//                .Include(r => r.Service)
//                .Include(r => r.Schedule)
//                .Include(r => r.User)
//                .ToListAsync();
//        }

//        public async Task<HotelServiceReservation> GetReservationByIdAsync (int id)
//        {
//            return await _context.HotelServiceReservations
//                .Include(r => r.Service)
//                .Include(r => r.Schedule)
//                .Include(r => r.User)
//                .FirstOrDefaultAsync (r => r.Id == id);
//        }

//        public async Task <HotelServiceReservation> CreateReservationAsync(HotelServiceReservation reservation)
//        {
//            _context.HotelServiceReservations.Add(reservation);
//            await _context.SaveChangesAsync();
//            return reservation;
//        }

//        public async Task<HotelServiceReservation> UpdateReservationAsync(int id, HotelServiceReservation updatedReservation)
//        {
//            var existing = await _context.HotelServiceReservations.FindAsync(id);
//            if (existing == null)
//                return null;

//            // Update fields (add only fields you want to allow editing)
//            //existing.ScheduleId = updatedReservation.ScheduleId;
//            //existing.ServiceId = updatedReservation.ServiceId;
//            //existing.UserId = updatedReservation.UserId;
//            //existing.ReservationDate = updatedReservation.ReservationDate;
//            // Add more fields as necessary

//            await _context.SaveChangesAsync();
//            return existing;
//        }

//        public async Task<bool> DeleteReservationAsync(int id)
//        {
//            var reservation = await _context.HotelServiceReservations.FindAsync(id);
//            if (reservation == null)
//                return false;

//            _context.HotelServiceReservations.Remove(reservation);
//            await _context.SaveChangesAsync();
//            return true;
//        }

//    }
//}
//using HotelMS.Data;
//using HotelMS.Data.DTO;
//using HotelMS.Data.Interfaces;
//using HotelMS.Models;
//using Microsoft.EntityFrameworkCore;

//namespace HotelMS.Services
//{
//    public class HotelServiceReservationService : IHotelServiceReservationService
//    {
//        private readonly DataContext _context;

//        public HotelServiceReservationService(DataContext context)
//        {
//            _context = context;
//        }

//        public async Task<string> MakeReservation(int userID, HotelServiceReservationDTO request)
//        {
//            if (request.ReservationTime < DateTime.Now)
//            {
//                return "Reservation time cannot be in the past.";
//            }

//            var service = await _context.HotelServices
//                .FirstOrDefaultAsync(s => s.Name == request.ServiceName);

//            if (service == null)
//            {
//                return "Hotel service not found.";
//            }

//            // Optional schedule check if applicable
//            //HotelServiceSchedule? schedule = null;
//            //if (!string.IsNullOrEmpty(request.ScheduledTimeSlot))
//            //{
//            //    schedule = await _context.HotelServiceSchedules
//            //        .FirstOrDefaultAsync(s => s.TimeSlot == request.ScheduledTimeSlot && s.HotelServiceId == service.Id);
//            //    if (schedule == null)
//            //    {
//            //        return "Schedule not available for the selected service.";
//            //    }
//            //}

//            var reservation = new HotelServiceReservation
//            {
//                UserId = userID,
//                HotelServiceId = service.Id,
//                ReservationTime = request.ReservationTime,
//                //ScheduleId = schedule?.Id,
//                Status = "Confirmed"
//            };

//            _context.HotelServiceReservations.Add(reservation);
//            await _context.SaveChangesAsync();

//            return "Hotel service reservation created successfully.";
//        }

//        public async Task<IEnumerable<HotelServiceReservationDTO>> GetUserReservations(int userID)
//        {
//            return await _context.HotelServiceReservations
//                .Include(r => r.Service)
//                .Include(r => r.User)
//                .Include(r => r.Schedule)
//                .Where(r => r.UserId == userID)
//                .Select(r => new HotelServiceReservationDTO
//                {
//                    ReservationId = r.Id,
//                    ServiceName = r.Service.Name,
//                    ReservationStatus = r.Status,
//                    ReservationTime = r.ReservationTime,
//                    //UserFullName = r.User.FullName,
//                    //ScheduledTimeSlot = r.Schedule != null ? r.Schedule.TimeSlot : null
//                })
//                .ToListAsync();
//        }

//        public async Task<IEnumerable<HotelServiceReservationDTO>> GetAllReservations()
//        {
//            return await _context.HotelServiceReservations
//                .Include(r => r.Service)
//                .Include(r => r.User)
//                .Include(r => r.Schedule)
//                .Select(r => new HotelServiceReservationDTO
//                {
//                    ReservationId = r.Id,
//                    ServiceName = r.Service.Name,
//                    ReservationStatus = r.Status,
//                    ReservationTime = r.ReservationTime,
//                   // UserFullName = r.User.FullName,
//                    //ScheduledTimeSlot = r.Schedule != null ? r.Schedule.TimeSlot : null
//                })
//                .ToListAsync();
//        }

//        public async Task<string> CancelReservation(int reservationID, int userID, bool isAdminOrStaff = false)
//        {
//            var reservation = await _context.HotelServiceReservations
//                .Include(r => r.User)
//                .FirstOrDefaultAsync(r => r.Id == reservationID);

//            if (reservation == null)
//            {
//                return "Reservation not found.";
//            }

//            if (!isAdminOrStaff && reservation.UserId != userID)
//            {
//                return "You are not authorized to cancel this reservation.";
//            }

//            reservation.Status = "Cancelled";
//            await _context.SaveChangesAsync();

//            return "Reservation cancelled successfully.";
//        }

//        public async Task<string> UpdateReservationStatus(int reservationID, string newStatus)
//        {
//            var allowedStatuses = new[] { "Confirmed", "Pending", "Cancelled" };
//            if (!allowedStatuses.Contains(newStatus))
//            {
//                return "Invalid reservation status.";
//            }

//            var reservation = await _context.HotelServiceReservations
//                .FirstOrDefaultAsync(r => r.Id == reservationID);

//            if (reservation == null)
//            {
//                return "Reservation not found.";
//            }

//            reservation.Status = newStatus;
//            await _context.SaveChangesAsync();

//            return "Reservation status updated successfully.";
//        }

//        public async Task<string> MarkReservationCompleted(int reservationID, int userID)
//        {
//            var reservation = await _context.HotelServiceReservations
//                .Include(r => r.User)
//                .FirstOrDefaultAsync(r => r.Id == reservationID);

//            if (reservation == null)
//            {
//                return "Reservation not found.";
//            }

//            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserID == userID);
//            if (user == null)
//            {
//                return "User not found.";
//            }

//            var role = await _context.Roles.FirstOrDefaultAsync(r => r.RoleID == user.RoleID);
//            if (role == null)
//            {
//                return "User role not found.";
//            }

//            if (reservation.UserId != userID && role.RoleType != "Admin" && role.RoleType != "ServiceRecepsionist")
//            {
//                return "You are not authorized to complete this reservation.";
//            }

//            reservation.Status = "Completed";
//            await _context.SaveChangesAsync();

//            return "Reservation marked as completed.";
//        }
//    }
//}




