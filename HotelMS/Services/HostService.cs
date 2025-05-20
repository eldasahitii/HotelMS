using System.Security.Cryptography;
using System.Text;
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

        public async Task<List<RestaurantReservation>> GetAllReservationsAsync()
        {
            return await _dbContext.RestaurantReservations
                .Include(r => r.RestaurantTable)
                .ToListAsync();
        }

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


        //public async Task<RestaurantReservationDTO> CreateReservationAsync(RestaurantReservationCreateDTO dto)
        //{
        //    _dbContext.RestaurantReservations.Add(reservation);
        //    await _dbContext.SaveChangesAsync();
        //    return reservation;
        //}

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
