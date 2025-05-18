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

        public async Task<RestaurantReservation> CreateReservationAsync(RestaurantReservation reservation)
        {
            _dbContext.RestaurantReservations.Add(reservation);
            await _dbContext.SaveChangesAsync();
            return reservation;
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
