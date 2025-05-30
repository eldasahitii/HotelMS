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

        public async Task<(bool Success, string Message)> MakeReservation(int userID, RoomReservationCreateDTO request, List<string> roles)
        {
            if (request.CheckInDate.Date >= request.CheckOutDate.Date)
                return (false, "Check-out date must be after check-in date");

            if (request.CheckInDate.Date < DateTime.Now.Date)
                return (false, "Check-in date cannot be in the past");

            int? receptionistID = null;
            if (roles.Contains("RoomRecepsionist"))
            {
                var receptionist = await _context.RoomRecepsionists.FirstOrDefaultAsync(r => r.UserID == userID);
                if (receptionist == null)
                    return (false, "Logged-in user is not a valid Room Receptionist.");
                receptionistID = receptionist.RoomReceptionistID;
            }

            int actualUserID = (receptionistID.HasValue && request.CustomerUserID.HasValue && request.CustomerUserID > 0)
                ? request.CustomerUserID.Value : userID;

            var userExists = await _context.Users.AnyAsync(u => u.UserID == actualUserID);
            if (!userExists)
                return (false, $"User with ID {actualUserID} does not exist.");

            var cleaningStatus = await _context.RoomStatuses.FirstOrDefaultAsync(s => s.RoomStatusName == "Cleaning");
            if (cleaningStatus == null)
                return (false, "Room status 'Cleaning' not found in the system.");

            var room = await _context.Rooms.Include(r => r.RoomStatus).FirstOrDefaultAsync(r => r.RoomID == request.RoomID);
            if (room == null)
                return (false, "Selected room not found.");

            if (room.RoomStatusID == cleaningStatus.RoomStatusID)
                return (false, "Cannot make a reservation for a room currently under cleaning.");

            bool isConflicting = await _context.RoomReservations.AnyAsync(res =>
                res.RoomID == request.RoomID &&
                res.CheckOutDate.Date > request.CheckInDate.Date &&
                res.CheckInDate.Date < request.CheckOutDate.Date &&
                res.ReservationStatus.ReservationStatusName != "Cancelled" &&
                res.ReservationStatus.ReservationStatusName != "Completed");

            if (isConflicting)
                return (false, "Room is already reserved for the selected dates.");

            var reservation = new RoomReservation
            {
                RoomID = room.RoomID,
                UserID = actualUserID,
                CheckInDate = request.CheckInDate.Date,
                CheckOutDate = request.CheckOutDate.Date,
                ReservationStatusID = 1, // Pending
                SpecialRequests = request.SpecialRequests,
                CreatedAt = DateTime.Now,
                CreatedByReceptionistID = receptionistID
            };

            _context.RoomReservations.Add(reservation);
            await _context.SaveChangesAsync();
            await UpdateRoomStatusIfNeeded(room.RoomID);

            return (true, $"Reservation created successfully for room {room.RoomNumber}");
        }

        public async Task<IEnumerable<UserReservationResponseDTO>> GetUserReservations(int userID)
        {
            return await _context.RoomReservations
                .Include(r => r.Room).ThenInclude(room => room.RoomType)
                .Include(r => r.ReservationStatus)
                .Where(r => r.UserID == userID)
                .Select(r => new UserReservationResponseDTO
                {
                    ReservationID = r.ReservationID,
                    CheckInDate = r.CheckInDate,
                    CheckOutDate = r.CheckOutDate,
                    Status = r.ReservationStatus.ReservationStatusName,
                    RoomName = r.Room.RoomType.Name
                }).ToListAsync();
        }

        public async Task<IEnumerable<RoomReservationDTO>> GetAllReservations()
        {
            var reservations = await _context.RoomReservations
                .Include(r => r.Room).ThenInclude(room => room.RoomType)
                .Include(r => r.ReservationStatus)
                .Include(r => r.User)
                .Include(r => r.CreatedByReceptionist).ThenInclude(rp => rp.User)
                .ToListAsync();

            return reservations.Select(r => new RoomReservationDTO
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
                ReceptionistFirstName = r.CreatedByReceptionist?.User?.FirstName,
                ReceptionistLastName = r.CreatedByReceptionist?.User?.LastName,
                ReceptionistEmail = r.CreatedByReceptionist?.User?.Email
            }).ToList();
        }

        public async Task<string> CancelReservation(int reservationID, int userID, bool isAdminOrStaff = false)
        {
            var reservation = await _context.RoomReservations
                .Include(r => r.ReservationStatus)
                .Include(r => r.Room)
                .FirstOrDefaultAsync(r => r.ReservationID == reservationID);

            if (reservation == null) return "Reservation not found";
            if (reservation.ReservationStatus.ReservationStatusName == "Completed")
                return "Cannot cancel a reservation that is already completed.";
            if (!isAdminOrStaff && reservation.UserID != userID)
                return "You are not authorized to cancel this reservation";

            var cancelledStatus = await _context.ReservationStatuses.FirstOrDefaultAsync(rs => rs.ReservationStatusName == "Cancelled");
            if (cancelledStatus == null) return "Cancelled status not found";

            reservation.ReservationStatusID = cancelledStatus.ReservationStatusID;
            reservation.CheckOutDate = DateTime.Now;

            await _context.SaveChangesAsync();
            await UpdateRoomStatusIfNeeded(reservation.RoomID);

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

            var newCheckIn = (request.CheckInDate ?? reservation.CheckInDate).Date;
            var newCheckOut = (request.CheckOutDate ?? reservation.CheckOutDate).Date;

            if (newCheckIn >= newCheckOut)
                return "Check-out date must be after check-in date";
            if (newCheckIn < DateTime.Now.Date)
                return "Check-in date cannot be in the past";

            bool isConflicting = await _context.RoomReservations.AnyAsync(res =>
                res.RoomID == reservation.RoomID &&
                res.ReservationID != reservationID &&
                res.CheckOutDate.Date > newCheckIn &&
                res.CheckInDate.Date < newCheckOut &&
                res.ReservationStatus.ReservationStatusName != "Cancelled" &&
                res.ReservationStatus.ReservationStatusName != "Completed");

            if (isConflicting)
                return "Room is already reserved for the selected dates.";

            reservation.CheckInDate = newCheckIn;
            reservation.CheckOutDate = newCheckOut;
            reservation.SpecialRequests = request.SpecialRequests;

            await _context.SaveChangesAsync();
            await UpdateRoomStatusIfNeeded(reservation.RoomID);

            return "Reservation updated successfully";
        }

        public async Task<string> UpdateReservationStatus(int reservationID, int statusID)
        {
            var reservation = await _context.RoomReservations
                .Include(r => r.ReservationStatus)
                .FirstOrDefaultAsync(r => r.ReservationID == reservationID);

            if (reservation == null)
                return "Reservation not found";

            var status = await _context.ReservationStatuses.FirstOrDefaultAsync(rs => rs.ReservationStatusID == statusID);
            if (status == null)
                return "Invalid status ID";

            reservation.ReservationStatusID = statusID;
            await _context.SaveChangesAsync();
            await UpdateRoomStatusIfNeeded(reservation.RoomID);

            return "Reservation status updated successfully";
        }

        public async Task<string> MarkReservationCompleted(int reservationID, int userID)
        {
            var reservation = await _context.RoomReservations
                .Include(r => r.ReservationStatus)
                .Include(r => r.Room)
                .FirstOrDefaultAsync(r => r.ReservationID == reservationID);

            if (reservation == null)
                return "Reservation not found";

            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserID == userID);
            var role = user != null ? await _context.Roles.FirstOrDefaultAsync(r => r.RoleID == user.RoleID) : null;

            if (user == null || role == null)
                return "User or role not found";

            if (reservation.UserID != userID && role.RoleType != "Admin" && role.RoleType != "RoomRecepsionist")
                return "You are not authorized to complete this reservation";

            if (DateTime.Now.Date < reservation.CheckOutDate.Date)
                return "Cannot mark reservation as completed before the check-out date";

            var completedStatus = await _context.ReservationStatuses.FirstOrDefaultAsync(rs => rs.ReservationStatusName == "Completed");
            if (completedStatus == null)
                return "Completed status not found";

            reservation.ReservationStatusID = completedStatus.ReservationStatusID;

            await _context.SaveChangesAsync();
            await UpdateRoomStatusIfNeeded(reservation.RoomID);

            return "Reservation marked as completed";
        }

        private async Task UpdateRoomStatusIfNeeded(int roomID)
        {
            var room = await _context.Rooms.Include(r => r.RoomStatus).FirstOrDefaultAsync(r => r.RoomID == roomID);
            if (room == null) return;

            var activeReservationExists = await _context.RoomReservations
                .Include(r => r.ReservationStatus)
                .AnyAsync(r =>
                    r.RoomID == roomID &&
                    r.ReservationStatus.ReservationStatusName != "Cancelled" &&
                    r.ReservationStatus.ReservationStatusName != "Completed" &&
                    r.CheckInDate.Date <= DateTime.Now.Date &&
                    r.CheckOutDate.Date > DateTime.Now.Date);

            int occupiedStatusID = (await _context.RoomStatuses.FirstOrDefaultAsync(s => s.RoomStatusName == "Occupied"))?.RoomStatusID ?? 0;
            int availableStatusID = (await _context.RoomStatuses.FirstOrDefaultAsync(s => s.RoomStatusName == "Available"))?.RoomStatusID ?? 0;

            if (activeReservationExists)
            {
                if (room.RoomStatusID != occupiedStatusID)
                {
                    room.RoomStatusID = occupiedStatusID;
                    await _context.SaveChangesAsync();
                }
            }
            else
            {
                if (room.RoomStatusID != availableStatusID)
                {
                    room.RoomStatusID = availableStatusID;
                    await _context.SaveChangesAsync();
                }
            }
        }
    }
}
