//using HotelMS.Data;
//using HotelMS.Data.DTO;
//using HotelMS.Data.Interfaces;
//using HotelMS.Models;
//using Microsoft.EntityFrameworkCore;
//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Threading.Tasks;

//namespace HotelMS.Services
//{
//    public class HotelServiceReservationService : IHotelServiceReservationService
//    {
//        private readonly DataContext _context;

//        public HotelServiceReservationService(DataContext context)
//        {
//            _context = context;
//        }

//        public async Task<(bool Success, string Message)> MakeReservation(int userID, HotelServiceReservationCreateDTO request, List<string> roles)
//        {
//            int? receptionistID = null;
//            if (roles.Contains("ServiceRecepsionist"))
//            {
//                var receptionist = await _context.ServiceRecepsionists.FirstOrDefaultAsync(r => r.UserID == userID);
//                if (receptionist == null)
//                    return (false, "Logged-in user is not a valid Service Receptionist.");
//                receptionistID = receptionist.ServiceReceptionistID;
//            }

//            int actualUserID = request.CustomerUserID ?? userID;
//            if (!await _context.Users.AnyAsync(u => u.UserID == actualUserID))
//                return (false, "User not found");

//            var serviceExists = await _context.HotelServices.AnyAsync(s => s.Id == request.ServiceID);
//            if (!serviceExists)
//                return (false, "Service not found");

//            var isConflicting = await _context.HotelServiceReservations.AnyAsync(res =>
//                res.ServiceID == request.ServiceID &&
//                res.ReservationDate.Date == request.ReservationDate.Date &&
//                res.TimeSlot == request.TimeSlot &&
//                res.ReservationStatus.ReservationStatusName != "Cancelled" &&
//                res.ReservationStatus.ReservationStatusName != "Completed");

//            if (isConflicting)
//                return (false, "Time slot already booked for this service.");

//            var reservation = new HotelServiceReservation
//            {
//                ServiceID = request.ServiceID,
//                UserID = actualUserID,
//                ReservationDate = request.ReservationDate.Date,
//                TimeSlot = request.TimeSlot,
//                FirstName = request.FirstName,
//                LastName = request.LastName,
//                Email = request.Email,
//                Phone = request.Phone,
//                ReservationStatusID = 1, // Pending
//                CreatedByServiceReceptionistID = receptionistID,
//                CreatedAt = DateTime.Now
//            };

//            _context.HotelServiceReservations.Add(reservation);
//            await _context.SaveChangesAsync();

//            return (true, "Service reservation created successfully");
//        }

//        public async Task<IEnumerable<HotelServiceReservationDTO>> GetUserReservations(int userID)
//        {
//            return await _context.HotelServiceReservations
//                .Include(r => r.ReservationStatus)
//                .Include(r => r.CreatedByServiceReceptionist).ThenInclude(r => r.User)
//                .Where(r => r.UserID == userID)
//                .Select(r => new HotelServiceReservationDTO
//                {
//                    ReservationID = r.ReservationID,
//                    ServiceName = r.ServiceID,  // Changed from ServiceName
//                    UserID = r.UserID,
//                    FirstName = r.FirstName,
//                    LastName = r.LastName,
//                    Email = r.Email,
//                    Phone = r.Phone,
//                    CreatedByServiceReceptionistID = r.CreatedByServiceReceptionistID,
//                    ReceptionistFirstName = r.CreatedByServiceReceptionist?.User?.FirstName,
//                    ReceptionistLastName = r.CreatedByServiceReceptionist?.User?.LastName,
//                    ReceptionistEmail = r.CreatedByServiceReceptionist?.User?.Email,
//                    ReservationDate = r.ReservationDate,
//                    TimeSlot = r.TimeSlot,
//                    ReservationStatusName = r.ReservationStatus.ReservationStatusName,
//                    CreatedAt = r.CreatedAt
//                }).ToListAsync();
//        }

//        public async Task<IEnumerable<HotelServiceReservationDTO>> GetAllReservations()
//        {
//            return await _context.HotelServiceReservations
//                .Include(r => r.ReservationStatus)
//                .Include(r => r.User)
//                .Include(r => r.CreatedByServiceReceptionist).ThenInclude(r => r.User)
//                .Select(r => new HotelServiceReservationDTO
//                {
//                    ReservationID = r.ReservationID,
//                    ServiceId = r.ServiceID,  // Changed from ServiceName
//                    UserID = r.UserID,
//                    FirstName = r.FirstName,
//                    LastName = r.LastName,
//                    Email = r.Email,
//                    Phone = r.Phone,
//                    CreatedByServiceReceptionistID = r.CreatedByServiceReceptionistID,
//                    ReceptionistFirstName = r.CreatedByServiceReceptionist?.User?.FirstName,
//                    ReceptionistLastName = r.CreatedByServiceReceptionist?.User?.LastName,
//                    ReceptionistEmail = r.CreatedByServiceReceptionist?.User?.Email,
//                    ReservationDate = r.ReservationDate,
//                    TimeSlot = r.TimeSlot,
//                    ReservationStatusName = r.ReservationStatus.ReservationStatusName,
//                    CreatedAt = r.CreatedAt
//                }).ToListAsync();
//        }

//        public async Task<string> CancelReservation(int reservationID, int userID, bool isAdminOrStaff = false)
//        {
//            var reservation = await _context.HotelServiceReservations
//                .Include(r => r.ReservationStatus)
//                .FirstOrDefaultAsync(r => r.ReservationID == reservationID);

//            if (reservation == null)
//                return "Reservation not found";

//            if (!isAdminOrStaff && reservation.UserID != userID)
//                return "Unauthorized";

//            var cancelledStatus = await _context.ReservationStatuses.FirstOrDefaultAsync(rs => rs.ReservationStatusName == "Cancelled");
//            if (cancelledStatus == null)
//                return "Cancelled status not found";

//            reservation.ReservationStatusID = cancelledStatus.ReservationStatusID;
//            await _context.SaveChangesAsync();

//            return "Reservation cancelled successfully";
//        }

//        public async Task<string> UpdateReservation(int reservationID, HotelServiceReservationUpdateDTO request, int userID, List<string> roles)
//        {
//            var reservation = await _context.HotelServiceReservations.Include(r => r.ReservationStatus).FirstOrDefaultAsync(r => r.ReservationID == reservationID);
//            if (reservation == null) return "Reservation not found";

//            bool isAdminOrReceptionist = roles.Contains("Admin") || roles.Contains("ServiceRecepsionist");
//            if (!isAdminOrReceptionist && reservation.UserID != userID)
//                return "Unauthorized to update this reservation";

//            if (request.ReservationDate.HasValue && request.ReservationDate.Value < DateTime.Now.Date)
//                return "Reservation date cannot be in the past";

//            reservation.ReservationDate = request.ReservationDate ?? reservation.ReservationDate;
//            reservation.TimeSlot = request.TimeSlot ?? reservation.TimeSlot;
//            reservation.FirstName = request.FirstName ?? reservation.FirstName;
//            reservation.LastName = request.LastName ?? reservation.LastName;
//            reservation.Email = request.Email ?? reservation.Email;
//            reservation.Phone = request.Phone ?? reservation.Phone;

//            await _context.SaveChangesAsync();
//            return "Reservation updated successfully";
//        }

//        public async Task<string> UpdateReservationStatus(int reservationID, int statusID)
//        {
//            var reservation = await _context.HotelServiceReservations.FirstOrDefaultAsync(r => r.ReservationID == reservationID);
//            if (reservation == null) return "Reservation not found";

//            var status = await _context.ReservationStatuses.FirstOrDefaultAsync(s => s.ReservationStatusID == statusID);
//            if (status == null) return "Invalid status ID";

//            reservation.ReservationStatusID = statusID;
//            await _context.SaveChangesAsync();

//            return "Status updated successfully";
//        }

//        public async Task<string> MarkReservationCompleted(int reservationID, int userID)
//        {
//            var reservation = await _context.HotelServiceReservations
//                .Include(r => r.ReservationStatus)
//                .FirstOrDefaultAsync(r => r.ReservationID == reservationID);

//            if (reservation == null) return "Reservation not found";

//            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserID == userID);
//            var role = user != null ? await _context.Roles.FirstOrDefaultAsync(r => r.RoleID == user.RoleID) : null;
//            if (user == null || role == null)
//                return "User or role not found";

//            if (reservation.UserID != userID && role.RoleType != "Admin" && role.RoleType != "ServiceRecepsionist")
//                return "Unauthorized";

//            if (DateTime.Now.Date < reservation.ReservationDate.Date)
//                return "Cannot complete reservation before the scheduled date";

//            var completedStatus = await _context.ReservationStatuses.FirstOrDefaultAsync(rs => rs.ReservationStatusName == "Completed");
//            if (completedStatus == null)
//                return "Completed status not found";

//            reservation.ReservationStatusID = completedStatus.ReservationStatusID;
//            await _context.SaveChangesAsync();

//            return "Reservation marked as completed";
//        }
//    }
//}
