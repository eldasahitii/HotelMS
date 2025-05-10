using HotelMS.Data;
using HotelMS.Data.DTO;
using HotelMS.Data.Interfaces;
using HotelMS.Models;
using Microsoft.EntityFrameworkCore;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace HotelMS.Services
{
    public class HotelServiceScheduleService : IHotelServiceScheduleService
    {
        private readonly DataContext _context;

        public HotelServiceScheduleService(DataContext context)
        {
            _context = context;
        } 
        public async Task <IEnumerable<HotelServiceSchedule>> GetAllSchedulesAsync ()
        {
            return await _context.HotelServiceSchedules
                .Include(s => s.Service)
                .ToListAsync();
        }
        public async Task <HotelServiceSchedule> CreateScheduleAsync(HotelServiceSchedule schedule)
        {
            _context.HotelServiceSchedules.Add(schedule);
            await _context.SaveChangesAsync();
            return schedule;
        }
        public async Task<bool> DeleteScheduleAsync(int id)
        {
            var schedule = await _context.HotelServiceSchedules.FindAsync(id);
            if (schedule == null) return false;

            _context.HotelServiceSchedules.Remove(schedule);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
