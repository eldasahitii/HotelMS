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
            if (request.CheckInDate >= request.CheckOutDate)
            {
                return "Check-out date must be after check-in date";
            }

            if (request.CheckInDate < DateTime.Now.Date)
            {
                return "Check-in date cannot be in the past";
            }

            var availableRoom = await _context.Rooms
                .Include(r => r.RoomStatus)
                .Where(r => r.RoomTypeID == request.RoomTypeID && r.RoomStatus.RoomStatusName == "Available")
                .Where(r => !_context.RoomReservations.Any(res =>
                    res.RoomID == r.RoomID &&
                    res.CheckOutDate > request.CheckInDate &&
                    res.CheckInDate < request.CheckOutDate))
                .FirstOrDefaultAsync();

            if (availableRoom == null)
            {
                return "No available room of the selected type for the given dates.";
            }

            var reservation = new RoomReservation
            {
                RoomID = availableRoom.RoomID,
                UserID = userID,
                CheckInDate = request.CheckInDate,
                CheckOutDate = request.CheckOutDate,
                ReservationStatusID = 1,
                CreatedAt = DateTime.Now
            };

            _context.RoomReservations.Add(reservation);
            await _context.SaveChangesAsync();

            return $"Reservation created successfully for room {availableRoom.Name}";
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

        public async Task<string> CancelReservation(int reservationID, int userID, bool isAdminOrStaff = false)
        {
            var reservation = await _context.RoomReservations
                .Include(r => r.ReservationStatus)
                .FirstOrDefaultAsync(r => r.ReservationID == reservationID);

            if (reservation == null)
            {
                return "Reservation not found";
            }
            if (!isAdminOrStaff && reservation.UserID != userID)
            {
                return "You are not authorized to cancel this reservation";
            }

            var cancelledStatus = await _context.ReservationStatuses
                .FirstOrDefaultAsync(rs => rs.ReservationStatusName == "Cancelled");

            if (cancelledStatus == null)
            {
                return "Cancelled status not found";
            }

            reservation.ReservationStatusID = cancelledStatus.ReservationStatusID;
            reservation.CheckOutDate = DateTime.Now;

            await _context.SaveChangesAsync();

            return "Reservation cancelled successfully";
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
            await _context.SaveChangesAsync();

            return "Reservation marked as completed";
        }
    }
 }

