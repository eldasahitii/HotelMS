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
    public class HotelServiceReservationService : IHotelServiceReservationService
    {
        private readonly DataContext dataContext;

        public HotelServiceReservationService(DataContext context)
        {
            dataContext = context;
        }

        public async Task<string> MakeReservation(int userID, HotelServiceReservationDTO request, List<string> roles)
        {
            if (request.ReservationDate < DateTime.Now.Date)
                return "Reservation date cannot be in the past";

            if (request.EndTime <= request.StartTime)
                return "End time must be after start time";

            var userExists = await dataContext.Users.AnyAsync(u => u.UserID == userID);
            if (!userExists)
                return $"User with ID {userID} does not exist.";

            var service = await dataContext.HotelServices.FirstOrDefaultAsync(s => s.Id == request.ServiceId);
            if (service == null)
                return "Selected service does not exist.";

            bool isConflicting = await dataContext.HotelServiceReservations.AnyAsync(res =>
                res.ServiceId == request.ServiceId &&
                res.ReservationDate == request.ReservationDate &&
                res.ReservationStatus.ReservationStatusName != "Cancelled" &&
                ((res.StartTime < request.EndTime && res.EndTime > request.StartTime)));

            if (isConflicting)
                return "Selected time slot is already booked for this service.";

            var reservation = new HotelServiceReservation
            {
                ServiceId = request.ServiceId,
                FirstName = request.FirstName,
                LastName = request.LastName,
                Email = request.Email,
                Phone = request.Phone,
                ReservationDate = request.ReservationDate,
                StartTime = request.StartTime,
                EndTime = request.EndTime,
                ReservationStatusID = 1,
                CreatedAt = DateTime.Now
            };

            dataContext.HotelServiceReservations.Add(reservation);
            await dataContext.SaveChangesAsync();

            return $"Reservation created successfully for {service.Name} on {request.ReservationDate.ToShortDateString()}";
        }

        public async Task<IEnumerable<HotelServiceReservationDTO>> GetUserReservations(int userID)
        {
            var userEmail = await dataContext.Users
                .Where(u => u.UserID == userID)
                .Select(u => u.Email)
                .FirstOrDefaultAsync();

            return await dataContext.HotelServiceReservations
                .Include(r => r.HotelService)
                .Include(r => r.ReservationStatus)
                .Where(r => r.Email == userEmail)
                .Select(r => new HotelServiceReservationDTO
                {
                    ReservationID = r.ReservationID,
                    ServiceId = r.ServiceId,
                    FirstName = r.FirstName,
                    LastName = r.LastName,
                    Email = r.Email,
                    Phone = r.Phone,
                    ReservationDate = r.ReservationDate,
                    StartTime = r.StartTime,
                    EndTime = r.EndTime,
                    ReservationStatusID = r.ReservationStatusID,
                    ReservationStatusName = r.ReservationStatus.ReservationStatusName,
                    CreatedAt = r.CreatedAt
                })
                .ToListAsync();
        }

        public async Task<IEnumerable<HotelServiceReservationDTO>> GetAllReservations()
        {
            return await dataContext.HotelServiceReservations
                .Include(r => r.HotelService)
                .Include(r => r.ReservationStatus)
                .Select(r => new HotelServiceReservationDTO
                {
                    ReservationID = r.ReservationID,
                    ServiceId = r.ServiceId,
                    FirstName = r.FirstName,
                    LastName = r.LastName,
                    Email = r.Email,
                    Phone = r.Phone,
                    ReservationDate = r.ReservationDate,
                    StartTime = r.StartTime,
                    EndTime = r.EndTime,
                    ReservationStatusID = r.ReservationStatusID,
                    ReservationStatusName = r.ReservationStatus.ReservationStatusName,
                    CreatedAt = r.CreatedAt
                })
                .ToListAsync();
        }

        public async Task<string> CancelReservation(int reservationID, int userID, bool isAdminOrStaff = false)
        {
            var reservation = await dataContext.HotelServiceReservations
                .Include(r => r.ReservationStatus)
                .FirstOrDefaultAsync(r => r.ReservationID == reservationID);

            if (reservation == null)
                return "Reservation not found";

            if (reservation.ReservationStatus.ReservationStatusName == "Completed")
                return "Cannot cancel a reservation that is already completed.";

            if (!isAdminOrStaff && !await IsUserReservationOwner(userID, reservation.Email))
                return "You are not authorized to cancel this reservation";

            var cancelledStatus = await dataContext.ReservationStatuses
                .FirstOrDefaultAsync(rs => rs.ReservationStatusName == "Cancelled");

            if (cancelledStatus == null)
                return "Cancelled status not found";

            reservation.ReservationStatusID = cancelledStatus.ReservationStatusID;
            await dataContext.SaveChangesAsync();

            return "Reservation cancelled successfully";
        }

        public async Task<string> UpdateReservation(int reservationID, HotelServiceReservationUpdateDTO request, int userID, List<string> roles)
        {
            var reservation = await dataContext.HotelServiceReservations
                .Include(r => r.ReservationStatus)
                .FirstOrDefaultAsync(r => r.ReservationID == reservationID);

            if (reservation == null)
                return "Reservation not found";

            bool isAdminOrStaff = roles.Contains("Admin") || roles.Contains("Staff");

            if (!isAdminOrStaff && !await IsUserReservationOwner(userID, reservation.Email))
                return "You are not authorized to update this reservation";

            if (request.ReservationDate < DateTime.Now.Date)
                return "Reservation date cannot be in the past";

            if (request.EndTime <= request.StartTime)
                return "End time must be after start time";

            bool isConflicting = await dataContext.HotelServiceReservations.AnyAsync(res =>
                res.ServiceId == reservation.ServiceId &&
                res.ReservationID != reservationID &&
                res.ReservationDate == request.ReservationDate &&
                res.ReservationStatus.ReservationStatusName != "Cancelled" &&
                ((res.StartTime < request.EndTime && res.EndTime > request.StartTime)));

            if (isConflicting)
                return "Selected time slot is already booked for this service.";

            reservation.ReservationDate = request.ReservationDate;
            reservation.StartTime = request.StartTime;
            reservation.EndTime = request.EndTime;
            reservation.Phone = request.Phone;
            reservation.Email = request.Email;

            await dataContext.SaveChangesAsync();

            return "Reservation updated successfully";
        }

        public async Task<string> UpdateReservationStatus(int reservationID, int statusID)
        {
            var reservation = await dataContext.HotelServiceReservations
                .FirstOrDefaultAsync(r => r.ReservationID == reservationID);

            if (reservation == null)
                return "Reservation not found";

            var status = await dataContext.ReservationStatuses
                .FirstOrDefaultAsync(rs => rs.ReservationStatusID == statusID);

            if (status == null)
                return "Invalid status ID";

            reservation.ReservationStatusID = statusID;
            await dataContext.SaveChangesAsync();

            return "Reservation status updated successfully";
        }

        public async Task<string> MarkReservationCompleted(int reservationID, int userID)
        {
            var reservation = await dataContext.HotelServiceReservations
                .Include(r => r.ReservationStatus)
                .FirstOrDefaultAsync(r => r.ReservationID == reservationID);

            if (reservation == null)
                return "Reservation not found";

            var user = await dataContext.Users.FirstOrDefaultAsync(u => u.UserID == userID);
            if (user == null)
                return "User not found";

            var role = await dataContext.Roles.FirstOrDefaultAsync(r => r.RoleID == user.RoleID);
            if (role == null)
                return "User role not found";

            if (reservation.Email != user.Email && role.RoleType != "Admin" && role.RoleType != "Staff")
                return "You are not authorized to complete this reservation.";

            var completedStatus = await dataContext.ReservationStatuses
                .FirstOrDefaultAsync(rs => rs.ReservationStatusName == "Completed");

            if (completedStatus == null)
                return "Completed status not found";

            reservation.ReservationStatusID = completedStatus.ReservationStatusID;
            await dataContext.SaveChangesAsync();

            return "Reservation marked as completed";
        }

        private async Task<bool> IsUserReservationOwner(int userID, string reservationEmail)
        {
            var userEmail = await dataContext.Users
                .Where(u => u.UserID == userID)
                .Select(u => u.Email)
                .FirstOrDefaultAsync();

            return string.Equals(userEmail, reservationEmail, StringComparison.OrdinalIgnoreCase);
        }
    }
}
