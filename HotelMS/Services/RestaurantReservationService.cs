using System.Linq.Expressions;
using HotelMS.Data;
using HotelMS.Data.DTO;
using HotelMS.Data.Interfaces;
using HotelMS.Models;
using Microsoft.EntityFrameworkCore;

namespace HotelMS.Services
{
    public class RestaurantReservationService : IRestaurantReservationService
    {
        private readonly DataContext _dbContext;

        public RestaurantReservationService(DataContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<IEnumerable<RestaurantReservation>> GetAllReservations()
        {
            try
            {
                return await _dbContext.RestaurantReservations.ToListAsync();

            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw new Exception("Error retrieving reservations.");
            }
        }
        public async Task<RestaurantReservation> GetReservation(int id)
        {
            try
            {
                return await _dbContext.RestaurantReservations.FindAsync(id);
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw new Exception("Error retrieving reservation.");
            }
        }
        public async Task<RestaurantReservation> AddReservation(RestaurantReservationCreateDTO dto)
        {
            try
            {
                var reservation = new RestaurantReservation
                {
                    GuestID = dto.GuestID,
                    RestaurantTableID = dto.RestaurantTableID,
                    date_time = dto.DateTime,
                    status = dto.Status
                };

                _dbContext.RestaurantReservations.Add(reservation);
                await _dbContext.SaveChangesAsync();
                return reservation;
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw new Exception("Error adding reservation.");
            }
        }
        public async Task<RestaurantReservation> UpdateReservation(int id, RestaurantReservationCreateDTO dto)
        {
            try
            {
                var reservation = await _dbContext.RestaurantReservations.FindAsync(id);
                if (reservation == null) return null;

                reservation.GuestID = dto.GuestID;
                reservation.RestaurantTableID = dto.RestaurantTableID;
                reservation.date_time = dto.DateTime;
                reservation.status = dto.Status;

                await _dbContext.SaveChangesAsync();
                return reservation;    
                
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw new Exception("Error updating reservation");
            }
        }
        public async Task DeleteReservation(int id)
        {
            try
            {
                var reservation = await _dbContext.RestaurantReservations.FindAsync(id);
                if (reservation != null)
                {
                    _dbContext.RestaurantReservations.Remove(reservation);
                    await _dbContext.SaveChangesAsync();
                }
              
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw new Exception("Error deleting reservation.");
            }
        }
    }
}
