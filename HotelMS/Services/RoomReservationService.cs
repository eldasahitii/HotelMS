using HotelMS.Data;
using HotelMS.Data.DTO;
using HotelMS.Data.Interfaces;
using HotelMS.Models;
using Microsoft.EntityFrameworkCore;

namespace HotelMS.Services
{
    public class RoomReservationService : IRoomReservationService
    {
        private readonly DataContext _context;

        public RoomReservationService(DataContext context)
        {
            _context = context;
        }

        public async Task<string> MakeReservation(int userID, RoomReservationDTO request)
        {
            var room = await _context.Rooms.FirstOrDefaultAsync(r => r.RoomID == request.RoomID);
            if (room == null) {
                return "Room not found";
            }

            if (request.CheckInDate >= request.CheckOutDate)
            {
                return "Check out date must be after check in date";
            }

            if (request.CheckInDate < DateTime.Now.Date) {
                return "Check in date cannot be in the past";
            }

            bool isRoomBooked = await _context.RoomReservations.AnyAsync(
                r => r.RoomID == request.RoomID && r.CheckOutDate > request.CheckInDate
                && r.CheckInDate < r.CheckOutDate);

            if (isRoomBooked)
            {
                return "Room is already booked for the selected dates";
            }

            var reservation = new RoomReservation
            {
                RoomID = request.RoomID,
                UserID = userID,
                CheckInDate = request.CheckInDate,
                CheckOutDate = request.CheckOutDate,
                ReservationStatusID = 1,
                CreatedAt = DateTime.Now,
            };

            _context.RoomReservations.Add(reservation);
            await _context.SaveChangesAsync();

            return "Reservation created successfully";

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
                    RoomName = r.Room.Name,
                    CheckInDate = r.CheckInDate,
                    CheckOutDate = r.CheckOutDate,
                    Status = r.ReservationStatus.ReservationStatusName
                })
                .ToListAsync();
        }

        public async Task<IEnumerable<RoomReservation>> GetAllReservations()
        {
            return await _context.RoomReservations.Include(r => r.Room)
                .Include(r => r.ReservationStatus)
                .ToListAsync();
        }

        public async Task<string> CancelReservation(int reservationID, int userID)
        {
            var reservation = await _context.RoomReservations
                .Include(r => r.ReservationStatus)
                .FirstOrDefaultAsync(r => r.ReservationID == reservationID);

            if (reservation == null)
            {
                return "Reservation not found";
            }

            if (reservation.UserID != userID) {
                return "You are not authorized to cancel this reservation";
            }

            var cancelledStatus = await _context.ReservationStatuses
                .FirstOrDefaultAsync(rs => rs.ReservationStatusName == "Cancelled");

            if (cancelledStatus == null) {
                return "Cancelled status not found";
            }

            reservation.CheckOutDate = DateTime.Now;

            await _context.SaveChangesAsync();

            return "Reservation cancelled successfully";
        }

        public async Task<string> UpdateReservationStatus(int reservationID, int statusID)
        {
            var reservation = await _context.RoomReservations
                .Include(r => r.ReservationStatus)
                .FirstOrDefaultAsync(r => r.ReservationID == reservationID);

            if (reservation == null) {
                return "Reservation not found";
            }

            var status = await _context.ReservationStatuses
                .FirstOrDefaultAsync(rs => rs.ReservationStatusID == statusID);

            if (status == null) {
                return "Invalid status ID";
            }

            reservation.ReservationStatusID = statusID;

            await _context.SaveChangesAsync();

            return "Reservation status updated successfully";

        }
    }
}

