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
    public class RoomReservationService : IRoomReservationService
    {
        private readonly DataContext _context;

        public RoomReservationService(DataContext context)
        {
            _context = context;
        }

        public async Task<string> MakeReservation(int userID, RoomReservationCreateDTO request, List<string> roles)
        {
            if (request.CheckInDate >= request.CheckOutDate)
                return "Check-out date must be after check-in date";

            if (request.CheckInDate < DateTime.Now.Date)
                return "Check-in date cannot be in the past";

            int? receptionistID = null;
            if (roles.Contains("RoomRecepsionist"))
            {
                var receptionist = await _context.RoomRecepsionists
                    .FirstOrDefaultAsync(r => r.UserID == userID);

                if (receptionist == null)
                    return "Logged-in user is not a valid Room Receptionist.";

                receptionistID = receptionist.RoomReceptionistID;
            }

            int actualUserID = userID;
            if (receptionistID.HasValue && request.CustomerUserID.HasValue && request.CustomerUserID > 0)
            {
                actualUserID = request.CustomerUserID.Value;
            }

            var userExists = await _context.Users.AnyAsync(u => u.UserID == actualUserID);
            if (!userExists)
                return $"User with ID {actualUserID} does not exist.";

            var room = await _context.Rooms
                .Include(r => r.RoomStatus)
                .FirstOrDefaultAsync(r => r.RoomID == request.RoomID && r.RoomStatus.RoomStatusName == "Available");

            if (room == null)
                return "Selected room is not available.";

            bool isConflicting = await _context.RoomReservations.AnyAsync(res =>
                res.RoomID == request.RoomID &&
                res.CheckOutDate > request.CheckInDate &&
                res.CheckInDate < request.CheckOutDate &&
                res.ReservationStatus.ReservationStatusName != "Cancelled");

            if (isConflicting)
                return "Room is already reserved for the selected dates.";

            var reservation = new RoomReservation
            {
                RoomID = room.RoomID,
                UserID = actualUserID,
                CheckInDate = request.CheckInDate,
                CheckOutDate = request.CheckOutDate,
                ReservationStatusID = 1, 
                SpecialRequests = request.SpecialRequests,
                CreatedAt = DateTime.Now,
                CreatedByReceptionistID = receptionistID
            };

            _context.RoomReservations.Add(reservation);

            var occupiedStatus = await _context.RoomStatuses.FirstOrDefaultAsync(rs => rs.RoomStatusName == "Occupied");
            if (occupiedStatus != null)
                room.RoomStatusID = occupiedStatus.RoomStatusID;

            await _context.SaveChangesAsync();

            return $"Reservation created successfully for room {room.RoomNumber}";
        }

        public async Task<IEnumerable<UserReservationResponseDTO>> GetUserReservations(int userID)
        {
            return await _context.RoomReservations
                .Include(r => r.Room)
                .Include(r => r.ReservationStatus)
                .Where(r => r.UserID == userID)
                .Select(r => new UserReservationResponseDTO
                {
                    ReservationID = r.ReservationID,
                    CheckInDate = r.CheckInDate,
                    CheckOutDate = r.CheckOutDate,
                    Status = r.ReservationStatus.ReservationStatusName
                })
                .ToListAsync();
        }

        public async Task<IEnumerable<RoomReservationDTO>> GetAllReservations()
        {
            var reservations = await _context.RoomReservations
                .Include(r => r.Room)
                    .ThenInclude(room => room.RoomType)
                .Include(r => r.ReservationStatus)
                .Include(r => r.User) 
                .Include(r => r.CreatedByReceptionist) 
                    .ThenInclude(rp => rp.User)       
                .Select(r => new RoomReservationDTO
                {
                    ReservationID = r.ReservationID,
                    RoomTypeName = r.Room.RoomType.Name,
                    ReservationStatusName = r.ReservationStatus.ReservationStatusName,
                    CheckInDate = r.CheckInDate,
                    CheckOutDate = r.CheckOutDate,
                    SpecialRequests = r.SpecialRequests,

                    UserID = r.User.UserID,
                    FirstName = r.User.FirstName,
                    LastName = r.User.LastName,
                    Email = r.User.Email,

                    CreatedByReceptionistID = r.CreatedByReceptionistID,
                    ReceptionistFirstName = r.CreatedByReceptionist != null ? r.CreatedByReceptionist.User.FirstName : null,
                    ReceptionistLastName = r.CreatedByReceptionist != null ? r.CreatedByReceptionist.User.LastName : null,
                    ReceptionistEmail = r.CreatedByReceptionist != null ? r.CreatedByReceptionist.User.Email : null
                })
                .ToListAsync();

            return reservations;
        }


        public async Task<string> CancelReservation(int reservationID, int userID, bool isAdminOrStaff = false)
        {
            var reservation = await _context.RoomReservations
                .Include(r => r.ReservationStatus)
                .Include(r => r.Room)
                .FirstOrDefaultAsync(r => r.ReservationID == reservationID);

            if (reservation == null)
                return "Reservation not found";

            if (reservation.ReservationStatus.ReservationStatusName == "Completed")
                return "Cannot cancel a reservation that is already completed.";

            if (!isAdminOrStaff && reservation.UserID != userID)
                return "You are not authorized to cancel this reservation";

            var cancelledStatus = await _context.ReservationStatuses
                .FirstOrDefaultAsync(rs => rs.ReservationStatusName == "Cancelled");

            if (cancelledStatus == null)
                return "Cancelled status not found";

            reservation.ReservationStatusID = cancelledStatus.ReservationStatusID;
            reservation.CheckOutDate = DateTime.Now;

            // Check if other active reservations exist for the same room
            bool hasActiveReservations = await _context.RoomReservations.AnyAsync(r =>
                r.RoomID == reservation.RoomID &&
                r.ReservationID != reservation.ReservationID &&
                r.ReservationStatus.ReservationStatusName != "Cancelled" &&
                r.CheckOutDate > DateTime.Now);

            if (!hasActiveReservations)
            {
                var availableStatus = await _context.RoomStatuses.FirstOrDefaultAsync(rs => rs.RoomStatusName == "Available");
                if (availableStatus != null)
                {
                    var room = await _context.Rooms.FirstOrDefaultAsync(r => r.RoomID == reservation.RoomID);
                    if (room != null)
                    {
                        room.RoomStatusID = availableStatus.RoomStatusID;
                    }
                }
            }

            await _context.SaveChangesAsync();

            return "Reservation cancelled successfully";
        }


        public async Task<string> UpdateReservation(int reservationID, RoomReservationUpdateDTO request, int userID, List<string> roles)
        {
            var reservation = await _context.RoomReservations
                .Include(r => r.Room)
                .Include(r => r.ReservationStatus)
                .FirstOrDefaultAsync(r => r.ReservationID == reservationID);

            if (reservation == null)
                return "Reservation not found";

            bool isAdminOrReceptionist = roles.Contains("Admin") || roles.Contains("RoomRecepsionist");
            if (!isAdminOrReceptionist && reservation.UserID != userID)
                return "You are not authorized to update this reservation";

            var newCheckIn = request.CheckInDate ?? reservation.CheckInDate;
            var newCheckOut = request.CheckOutDate ?? reservation.CheckOutDate;

            if (newCheckIn >= newCheckOut)
                return "Check-out date must be after check-in date";

            if (newCheckIn < DateTime.Now.Date)
                return "Check-in date cannot be in the past";

            bool isConflicting = await _context.RoomReservations.AnyAsync(res =>
                res.RoomID == reservation.RoomID &&
                res.ReservationID != reservationID &&
                res.CheckOutDate > newCheckIn &&
                res.CheckInDate < newCheckOut &&
                res.ReservationStatus.ReservationStatusName != "Cancelled");

            if (isConflicting)
                return "Room is already reserved for the selected dates.";

            reservation.CheckInDate = newCheckIn;
            reservation.CheckOutDate = newCheckOut;
            reservation.SpecialRequests = request.SpecialRequests;

            await _context.SaveChangesAsync();

            return "Reservation updated successfully";
        }



        public async Task<string> UpdateReservationStatus(int reservationID, int statusID)
        {
            var reservation = await _context.RoomReservations
                .Include(r => r.ReservationStatus)
                .FirstOrDefaultAsync(r => r.ReservationID == reservationID);

            if (reservation == null)
            {
                return "Reservation not found";
            }

            var status = await _context.ReservationStatuses
                .FirstOrDefaultAsync(rs => rs.ReservationStatusID == statusID);

            if (status == null)
            {
                return "Invalid status ID";
            }

            reservation.ReservationStatusID = statusID;

            await _context.SaveChangesAsync();

            return "Reservation status updated successfully";
        }

        public async Task<string> MarkReservationCompleted(int reservationID, int userID)
        {
            var reservation = await _context.RoomReservations
                .Include(r => r.ReservationStatus)
                .Include(r => r.Room)
                .FirstOrDefaultAsync(r => r.ReservationID == reservationID);

            if (reservation == null)
            {
                return "Reservation not found";
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserID == userID);
            if (user == null)
            {
                return "User not found";
            }

            var role = await _context.Roles.FirstOrDefaultAsync(r => r.RoleID == user.RoleID);

            if (role == null)
            {
                return "User role not found";
            }

            if (reservation.UserID != userID && role.RoleType != "Admin" && role.RoleType != "RoomRecepsionist")
            {
                return "You are not authorized to complete this reservation.";
            }

            var completedStatus = await _context.ReservationStatuses
                .FirstOrDefaultAsync(rs => rs.ReservationStatusName == "Completed");

            if (completedStatus == null)
            {
                return "Completed status not found";
            }

            reservation.ReservationStatusID = completedStatus.ReservationStatusID;

            bool hasActiveReservations = await _context.RoomReservations.AnyAsync(r =>
                r.RoomID == reservation.RoomID &&
                r.ReservationID != reservation.ReservationID &&
                r.ReservationStatus.ReservationStatusName != "Cancelled" &&
                r.ReservationStatus.ReservationStatusName != "Completed" &&
                r.CheckOutDate > DateTime.Now);

            if (!hasActiveReservations)
            {
                var availableStatus = await _context.RoomStatuses.FirstOrDefaultAsync(rs => rs.RoomStatusName == "Available");
                if (availableStatus != null)
                {
                    reservation.Room.RoomStatusID = availableStatus.RoomStatusID;
                }
            }

            await _context.SaveChangesAsync();

            return "Reservation marked as completed";
        }
    }
}
