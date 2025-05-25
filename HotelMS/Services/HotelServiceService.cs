using HotelMS.Data;
using HotelMS.Data.DTO;
using HotelMS.Data.Interfaces;
using HotelMS.Models;
using Mapster;
using Microsoft.EntityFrameworkCore;

namespace HotelMS.Services
{
    public class HotelServiceService : IHotelService
    {
        private readonly DataContext _dbContext;

        public HotelServiceService(DataContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<HotelService> AddService(HotelServiceDTO request)
        {
            try
            {
                // Map DTO to Entity
                var service = request.Adapt<HotelService>();

                _dbContext.HotelServices.Add(service);
                await _dbContext.SaveChangesAsync();

                return service;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An error occurred: {ex.Message}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"Inner Exception: {ex.InnerException.Message}");
                }
                throw new Exception("An error occurred while adding the service.");
            }
        }

        public async Task<HotelService> GetService(int id)
        {
            try
            {
                var service = await _dbContext.HotelServices.FindAsync(id);
                return service;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw new Exception("An error occurred while retrieving the service.");
            }
        }

        public async Task<IEnumerable<HotelService>> GetAllServices()
        {
            try
            {
                return await _dbContext.HotelServices.ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw new Exception("An error occurred while retrieving all services.");
            }
        }

        public async Task<HotelService> UpdateService(int id, HotelServiceDTO request)
        {
            var service = await _dbContext.HotelServices.FindAsync(id);
            if (service == null) return null;

            // Map updated values from DTO
            request.Adapt(service);

            await _dbContext.SaveChangesAsync();
            return service;
        }

        public async Task DeleteService(int id)
        {
            try
            {
                var service = await _dbContext.HotelServices.FindAsync(id);
                if (service != null)
                {
                    _dbContext.HotelServices.Remove(service);
                    await _dbContext.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw new Exception("An error occurred while deleting the service.");
            }
        }
    }
}


