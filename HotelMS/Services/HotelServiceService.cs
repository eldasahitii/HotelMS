//using HotelMS.Data;
//using HotelMS.Data.DTO;
//using HotelMS.Data.Interfaces;
//using HotelMS.Models;
//using Microsoft.EntityFrameworkCore;
//using static System.Runtime.InteropServices.JavaScript.JSType;

//namespace HotelMS.Services
//{
//    public class HotelServiceService : IHotelServiceService
//    {
//        private readonly DataContext _context;

//            public HotelServiceService(DataContext context)
//        {
//            _context = context;

//        }

//        public async Task<IEnumerable<HotelService>> GetServicesByTypeAsync(string type)
//        {
//            return await _context.HotelServices
//                .Where(s => s.Type == type && s.IsActive)
//                .Include(s => s.HotelServiceSchedules)
//                .ToListAsync();
//        }

//        public async Task<HotelService> GetServiceByIdAsync(int id)
//        {
//            return await _context.HotelServices
//                .Include(s => s.HotelServiceSchedules)
//                .FirstOrDefaultAsync(s => s.Id == id);
//        }

//        public async Task<IEnumerable<HotelServiceSchedule>> GetSchedulesByServiceIdAsync(int serviceId)
//        {
//            return await _context.HotelServiceSchedules
//                .Where(s => s.HotelServiceId == serviceId && s.IsAvailable)
//                .ToListAsync();
//        }

//        public async Task<HotelServiceReservation> ReserveServiceAsync (HotelServiceReservation reservation)
//        {
//            _context.HotelServiceReservations.Add(reservation);
//            await _context.SaveChangesAsync();
//            return reservation;
//        }

//        public async Task<HotelService> UpdateServiceAsync(int id, HotelService updatedService)
//        {
//            var service = await _context.HotelServices.FindAsync(id);
//            if (service == null) return null;

//            service.Name = updatedService.Name;
//            service.Description = updatedService.Description;


//            await _context.SaveChangesAsync();
//            return service;
//        }

//        public async Task<bool> DeleteServiceAsync(int id)
//        {
//            var service = await _context.HotelServices.FindAsync(id);
//            if (service == null) return false;

//            _context.HotelServices.Remove(service);
//            await _context.SaveChangesAsync();
//            return true;
//        }

//    }
//}
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
                // Map DTO to entity
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
                throw new Exception("An error occurred while attempting to save the hotel service.");
            }
        }

        public async Task<HotelService> GetService(int id)
        {
            try
            {
                var service = await _dbContext.HotelServices
                    .Include(s => s.HotelServiceSchedules)
                    .Include(s => s.HotelServiceReservations)
                    .FirstOrDefaultAsync(s => s.Id == id);

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
                var services = await _dbContext.HotelServices
                    .Include(s => s.HotelServiceSchedules)
                    .Include(s => s.HotelServiceReservations)
                    .ToListAsync();

                return services;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw new Exception("An error occurred while retrieving all hotel services.");
            }
        }

        public async Task<HotelService> UpdateService(int id, HotelServiceDTO request)
        {
            var service = await _dbContext.HotelServices.FindAsync(id);
            if (service == null) return null;

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
                throw new Exception("An error occurred while attempting to delete the hotel service.");
            }
        }
    }
}

