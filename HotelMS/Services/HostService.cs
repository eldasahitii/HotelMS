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
                .Include(r => r.RestaurantTable)
                .Select(r => new RestaurantReservationDTO
                {
                    ReservationID = r.ReservationID,
                    GuestID = r.GuestID,
                    GuestName = r.RestaurantGuest.FirstName + " " + r.RestaurantGuest.LastName,
                    Email = r.RestaurantGuest.Email,
                    PhoneNumber = r.RestaurantGuest.PhoneNumber,
                    RestaurantTableID = r.RestaurantTableID,
                    TableNumber = r.RestaurantTable.TableNumber,
                    DateTime = r.date_time,
                    Status = r.status
                })
                .ToListAsync();
        }

        //public async Task<List<RestaurantReservation>> GetAllReservationsAsync()
        //{
        //    return await _dbContext.RestaurantReservations
        //        .Include(r => r.RestaurantTable)
        //        .ToListAsync();
        //}

        public async Task<RestaurantReservation> GetReservationByIdAsync(int id)
        {
            return await _dbContext.RestaurantReservations
                .Include(r => r.RestaurantTable)
                .FirstOrDefaultAsync(r => r.ReservationID == id);
        }

        public async Task<RestaurantReservationDTO> CreateReservationAsync(RestaurantReservationCreateDTO dto)
        {

            bool isBooked = await _dbContext.RestaurantReservations.AnyAsync(r => r.RestaurantTableID == dto.RestaurantTableID && r.date_time == dto.DateTime && r.status != "Canceled");

                if(isBooked)
            {
                throw new Exception("This table is already booked at the selected date and time.");
            }
            // Create a new reservation entity from the DTO
            var reservation = new RestaurantReservation
            {
                GuestID = dto.GuestID,
                RestaurantTableID = dto.RestaurantTableID,
                date_time = dto.DateTime,
                status = dto.Status
            };

            _dbContext.RestaurantReservations.Add(reservation);
            await _dbContext.SaveChangesAsync();

            // Optionally, include the table info to populate DTO fields
            var table = await _dbContext.RestaurantTables
                .FirstOrDefaultAsync(t => t.RestaurantTableID == dto.RestaurantTableID);

            // Return a clean DTO
            return new RestaurantReservationDTO
            {
                ReservationID = reservation.ReservationID,
                GuestID = reservation.GuestID,
                RestaurantTableID = reservation.RestaurantTableID,
                TableNumber = table?.TableNumber ?? 0, // fallback if null
                DateTime = reservation.date_time,
                Status = reservation.status,
                GuestName = "" // you can fetch guest name if needed
            };
        }




        public async Task<RestaurantReservationDTO> CreateReservationWithGuestAsync(RestaurantReservationGuestDTO dto)
        {
            if (dto.DateTime <= DateTime.Now)
                throw new Exception("Reservation must be for a future time.");

            if (dto.DateTime.Hour < 10 || dto.DateTime.Hour >= 22)
                throw new Exception("Reservations are allowed only between 10:00 and 22:00.");

            var tableExists = await _dbContext.RestaurantTables.AnyAsync(t => t.RestaurantTableID == dto.RestaurantTableID);
            if (!tableExists)
                throw new Exception("The selected table does not exist.");



            int reservationDuration = 90;

            var newStart = dto.DateTime;
            var newEnd = newStart.AddMinutes(reservationDuration);

            bool isBooked = await _dbContext.RestaurantReservations.AnyAsync(r =>
                r.RestaurantTableID == dto.RestaurantTableID &&
                r.status != "Canceled" &&
                r.date_time < newEnd &&
                r.date_time.AddMinutes(reservationDuration) > newStart
            );


            if (isBooked)
                throw new Exception("This table is already reserved during the selected time. Please choose a different time slot.");



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
                RestaurantTableID = dto.RestaurantTableID,
                date_time = dto.DateTime,
                status = dto.Status ?? "Booked"
            };

            _dbContext.RestaurantReservations.Add(reservation);
            await _dbContext.SaveChangesAsync();

            var table = await _dbContext.RestaurantTables
                .FirstOrDefaultAsync(t => t.RestaurantTableID == reservation.RestaurantTableID);

            return new RestaurantReservationDTO
            {
                ReservationID = reservation.ReservationID,
                GuestID = guest.GuestID,
                GuestName = $"{guest.FirstName} {guest.LastName}",
                Email = guest.Email,
                PhoneNumber = guest.PhoneNumber,
                RestaurantTableID = reservation.RestaurantTableID,
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
            var reservation = await _dbContext.RestaurantReservations.FindAsync(id);
            if (reservation == null) return false;

            reservation.status = newStatus;
            await _dbContext.SaveChangesAsync();
            return true;
        }
    }
}
