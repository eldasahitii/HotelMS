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

//        public async Task<IEnumerable<HotelServiceDetail>> GetSchedulesByServiceIdAsync(int serviceId)
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
