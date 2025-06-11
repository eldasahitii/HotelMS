using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using HotelMS.Data;
using HotelMS.Data.DTO;
using HotelMS.Data.Interfaces;
using HotelMS.Models;
using Microsoft.EntityFrameworkCore;

namespace HotelMS.Services
{
    public class HostService : IHostService
    {
        private readonly DataContext _dbContext;

        public HostService(DataContext dbContext)
        {
            _dbContext = dbContext;
        }


        public async Task<List<RestaurantReservationDTO>> GetAllReservationsAsync()
        {
            return await _dbContext.RestaurantReservations
                .Include(r => r.RestaurantGuest)
                .Include(r => r.User)
                .Include(r => r.RestaurantTable)
                .Select(r => new RestaurantReservationDTO
                {
                    ReservationID = r.ReservationID,
                    GuestID = r.GuestID,
                    GuestName = r.GuestID != null && r.RestaurantGuest != null
                    ? r.RestaurantGuest.FirstName + " " + r.RestaurantGuest.LastName
    :               (r.User != null ? r.User.FirstName + " " + r.User.LastName : "Unknown"),

                    Email = r.GuestID != null && r.RestaurantGuest != null
                    ? r.RestaurantGuest.Email
    :               (r.User != null ? r.User.Email : ""),

                    PhoneNumber = r.GuestID != null && r.RestaurantGuest != null
                    ? r.RestaurantGuest.PhoneNumber
    :               (r.User != null ? r.User.Phone : ""),

                    RestaurantTableID = r.RestaurantTableID,
                    TableNumber = r.RestaurantTable.TableNumber,
                    DateTime = r.date_time,
                    Status = r.status
                })
                .ToListAsync();
        }

        public async Task<RestaurantReservation> GetReservationByIdAsync(int id)
        {
            return await _dbContext.RestaurantReservations
                .Include(r => r.RestaurantTable)
                .FirstOrDefaultAsync(r => r.ReservationID == id);
        }


        public async Task<RestaurantReservationDTO> CreateReservationWithGuestAsync(RestaurantReservationGuestDTO dto)
        {
            try
            {
                if (dto.DateTime <= DateTime.Now)
                    throw new Exception("Reservation must be for a future time.");

                if (dto.DateTime.Hour < 10 || dto.DateTime.Hour >= 22)
                    throw new Exception("Reservations are allowed only between 10:00 and 22:00.");

                int reservationDuration = 90;
                var newStart = dto.DateTime;
                var newEnd = newStart.AddMinutes(reservationDuration);

                var availableTable = await _dbContext.RestaurantTables
                    .Where(t => !_dbContext.RestaurantReservations.Any(r =>
                        r.RestaurantTableID == t.RestaurantTableID &&
                        r.status != "Canceled" &&
                        r.date_time < newEnd &&
                        r.date_time.AddMinutes(reservationDuration) > newStart))
                    .FirstOrDefaultAsync();

                if (availableTable == null)
                    throw new Exception("No available tables at the selected time.");

                
                var existingGuest = await _dbContext.RestaurantGuests
                    .FirstOrDefaultAsync(g => g.Email.ToLower() == dto.Email.ToLower());

                RestaurantGuest guest;

                if (existingGuest != null)
                {
                    guest = existingGuest;
                }
                else
                {
                    guest = new RestaurantGuest
                    {
                        FirstName = dto.FirstName,
                        LastName = dto.LastName,
                        Email = dto.Email,
                        PhoneNumber = dto.PhoneNumber
                    };

                    _dbContext.RestaurantGuests.Add(guest);
                    await _dbContext.SaveChangesAsync();
                }

                var reservation = new RestaurantReservation
                {
                    GuestID = guest.GuestID,
                    RestaurantTableID = availableTable.RestaurantTableID,
                    date_time = dto.DateTime,
                    status = "Occupied"
                };

                _dbContext.RestaurantReservations.Add(reservation);
                await _dbContext.SaveChangesAsync();

                return new RestaurantReservationDTO
                {
                    ReservationID = reservation.ReservationID,
                    GuestID = guest.GuestID,
                    GuestName = $"{guest.FirstName} {guest.LastName}",
                    Email = guest.Email,
                    PhoneNumber = guest.PhoneNumber,
                    RestaurantTableID = availableTable.RestaurantTableID,
                    TableNumber = availableTable.TableNumber,
                    DateTime = reservation.date_time,
                    Status = reservation.status
                };
            }
            catch (Exception ex)
            {
                throw new Exception($"Inner error: {ex.InnerException?.Message ?? ex.Message}");
            }
        }


        
        public async Task<RestaurantReservationDTO> CreateReservationForUserByEmailAsync(RestaurantReservationUserDTO dto)
        {
            var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == dto.Email.ToLower());
            if (user == null)
                throw new Exception("User not found with this email.");

            if (dto.DateTime <= DateTime.Now)
                throw new Exception("Reservation must be for a future time.");

            if (dto.DateTime.Hour < 10 || dto.DateTime.Hour >= 22)
                throw new Exception("Reservations are allowed only between 10:00 and 22:00.");

            int duration = 90;
            var newStart = dto.DateTime;
            var newEnd = newStart.AddMinutes(duration);

            int assignedTableID;

            if (dto.RestaurantTableID > 0)
            {
                
                bool isBooked = await _dbContext.RestaurantReservations.AnyAsync(r =>
                    r.RestaurantTableID == dto.RestaurantTableID &&
                    r.status != "Canceled" &&
                    r.date_time < newEnd &&
                    r.date_time.AddMinutes(duration) > newStart);

                if (isBooked)
                    throw new Exception("Selected table is already booked at the chosen time.");

                assignedTableID = dto.RestaurantTableID;
            }
            else
            {
                
                var availableTable = await _dbContext.RestaurantTables
                    .Where(t => !_dbContext.RestaurantReservations.Any(r =>
                        r.RestaurantTableID == t.RestaurantTableID &&
                        r.status != "Canceled" &&
                        r.date_time < newEnd &&
                        r.date_time.AddMinutes(duration) > newStart))
                    .FirstOrDefaultAsync();

                if (availableTable == null)
                    throw new Exception("No available tables at the selected time.");

                assignedTableID = availableTable.RestaurantTableID;
            }

            var reservation = new RestaurantReservation
            {
                UserID = user.UserID,
                RestaurantTableID = assignedTableID,
                date_time = dto.DateTime,
                status = string.IsNullOrWhiteSpace(dto.Status) ? "Occupied" : dto.Status
            };

            _dbContext.RestaurantReservations.Add(reservation);
            await _dbContext.SaveChangesAsync();

            var table = await _dbContext.RestaurantTables.FindAsync(assignedTableID);

            return new RestaurantReservationDTO
            {
                ReservationID = reservation.ReservationID,
                GuestName = $"{user.FirstName} {user.LastName}",
                Email = user.Email,
                PhoneNumber = user.Phone,
                RestaurantTableID = assignedTableID,
                TableNumber = table?.TableNumber ?? 0,
                DateTime = reservation.date_time,
                Status = reservation.status
            };
        }








        public async Task<bool> CancelReservationAsync(int id)
        {
            var reservation = await _dbContext.RestaurantReservations.FindAsync(id);
            if (reservation == null) return false;

            _dbContext.RestaurantReservations.Remove(reservation);
            await _dbContext.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateReservationAsync(int id, string newStatus)
        {
            var reservation = await _dbContext.RestaurantReservations
                .Include(r => r.RestaurantTable)
                .FirstOrDefaultAsync(r => r.ReservationID == id);

            if (reservation == null) return false;

            reservation.status = newStatus;

           

            await _dbContext.SaveChangesAsync();
            return true;
        }


        public async Task<List<RestaurantReservationDTO>> GetUserReservationsAsync(int userId)
        {
            return await _dbContext.RestaurantReservations
                .Where(r => r.UserID == userId)
                .Include(r => r.RestaurantTable)
                .Select(r => new RestaurantReservationDTO
                {
                    ReservationID = r.ReservationID,
                    RestaurantTableID = r.RestaurantTableID,
                    TableNumber = r.RestaurantTable.TableNumber,
                    DateTime = r.date_time,
                    Status = r.status
                })
                .ToListAsync();
        }

        public async Task<bool> UpdateUserReservationAsync(int id, int userId, DateTime dateTime, string status)
        {
            var reservation = await _dbContext.RestaurantReservations
                .FirstOrDefaultAsync(r => r.ReservationID == id && r.UserID == userId);

            if (reservation == null) return false;

            reservation.date_time = dateTime;
            reservation.status = status;

            await _dbContext.SaveChangesAsync();
            return true;
        }

        public async Task<bool> CancelUserReservationAsync(int id, int userId)
        {
            var reservation = await _dbContext.RestaurantReservations
                .FirstOrDefaultAsync(r => r.ReservationID == id && r.UserID == userId);

            if (reservation == null) return false;

            _dbContext.RestaurantReservations.Remove(reservation);
            await _dbContext.SaveChangesAsync();
            return true;
        }

    }
}
