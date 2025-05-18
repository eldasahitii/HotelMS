//using HotelMS.Data;
//using HotelMS.Data.DTO;
//using HotelMS.Data.Interfaces;
//using HotelMS.Models;
//using Microsoft.EntityFrameworkCore;
//using static System.Runtime.InteropServices.JavaScript.JSType;

//namespace HotelMS.Services
//{
//    public class HotelServiceScheduleService : IHotelServiceScheduleService
//    {
//        private readonly DataContext _context;

//        public HotelServiceScheduleService(DataContext context)
//        {
//            _context = context;
//        } 
//        public async Task <IEnumerable<HotelServiceSchedule>> GetAllSchedulesAsync ()
//        {
//            return await _context.HotelServiceSchedules
//                .Include(s => s.Service)
//                .ToListAsync();
//        }
//        public async Task<HotelServiceSchedule> GetScheduleByIdAsync(int id)
//        {
//            return await _context.HotelServiceSchedules
//                .Include(s => s.Service)
//                .FirstOrDefaultAsync(s => s.Id == id);
//        }
//        public async Task <HotelServiceSchedule> CreateScheduleAsync(HotelServiceSchedule schedule)
//        {
//            if (schedule.EndTime <= schedule.StartTime)
//                throw new ArgumentException("End time must be after start time.");

//            var hasOverlap = await _context.HotelServiceSchedules.AnyAsync(s =>
//            s.HotelServiceId == schedule.HotelServiceId &&
//            s.IsAvailable &&
//            s.StartTime < schedule.EndTime &&
//            schedule.StartTime < s.EndTime
//            );

//            if (hasOverlap)
//                throw new InvalidOperationException("Schedule overlaps with an existing available slot.");

//            _context.HotelServiceSchedules.Add(schedule);
//            await _context.SaveChangesAsync();
//            return schedule;
//        }
//        public async Task<bool> DeleteScheduleAsync(int id)
//        {
//            var schedule = await _context.HotelServiceSchedules.FindAsync(id);
//            if (schedule == null) return false;

//            _context.HotelServiceSchedules.Remove(schedule);
//            await _context.SaveChangesAsync();
//            return true;
//        }
//    }
//}
//using System.Collections.Generic;
//using System.Linq;
//using System.Threading.Tasks;
//using HotelMS.Data;
//using HotelMS.Models;
//using HotelMS.Models.DTOs;
//using Microsoft.EntityFrameworkCore;

//namespace HotelMS.Services
//{
//    public class HotelServiceScheduleService : IHotelServiceScheduleService
//    {
//        private readonly DataContext _context;

//        public HotelServiceScheduleService(DataContext context)
//        {
//            _context = context;
//        }

//        public async Task<IEnumerable<HotelServiceScheduleDTO>> GetAllAsync()
//        {
//            return await _context.HotelServiceSchedules
//                .Select(x => new HotelServiceScheduleDTO
//                {
//                    Id = x.Id,
//                    HotelServiceId = x.HotelServiceId,
//                    StartTime = x.StartTime,
//                    EndTime = x.EndTime,
//                    IsAvailable = x.IsAvailable
//                }).ToListAsync();
//        }

//        public async Task<HotelServiceScheduleDTO> GetByIdAsync(int id)
//        {
//            var schedule = await _context.HotelServiceSchedules.FindAsync(id);
//            if (schedule == null) return null;

//            return new HotelServiceScheduleDTO
//            {
//                Id = schedule.Id,
//                HotelServiceId = schedule.HotelServiceId,
//                StartTime = schedule.StartTime,
//                EndTime = schedule.EndTime,
//                IsAvailable = schedule.IsAvailable
//            };
//        }

//        public async Task<HotelServiceScheduleDTO> CreateAsync(HotelServiceScheduleCreateUpdateDTO dto)
//        {

//            var schedule = new HotelServiceSchedule
//            {
//                HotelServiceId = dto.HotelServiceId,
//                StartTime = dto.StartTime,
//                EndTime = dto.EndTime,
//                IsAvailable = dto.IsAvailable
//            };

//            _context.HotelServiceSchedules.Add(schedule);
//            await _context.SaveChangesAsync();

//            return new HotelServiceScheduleDTO
//            {
//                Id = schedule.Id,
//                HotelServiceId = schedule.HotelServiceId,
//                StartTime = schedule.StartTime,
//                EndTime = schedule.EndTime,
//                IsAvailable = schedule.IsAvailable
//            };
//        }


//        public async Task<bool> UpdateAsync(int id, HotelServiceScheduleCreateUpdateDTO DTO)
//        {
//            var schedule = await _context.HotelServiceSchedules.FindAsync(id);
//            if (schedule == null) return false;

//            schedule.HotelServiceId = DTO.HotelServiceId;
//            schedule.StartTime = DTO.StartTime;
//            schedule.EndTime = DTO.EndTime;
//            schedule.IsAvailable = DTO.IsAvailable;

//            _context.HotelServiceSchedules.Update(schedule);
//            await _context.SaveChangesAsync();
//            return true;
//        }

//        public async Task<bool> DeleteAsync(int id)
//        {
//            var schedule = await _context.HotelServiceSchedules.FindAsync(id);
//            if (schedule == null) return false;

//            _context.HotelServiceSchedules.Remove(schedule);
//            await _context.SaveChangesAsync();
//            return true;
//        }
//    }
//}
using HotelMS.Data.DTO;
using HotelMS.Data;
using HotelMS.Models;
using HotelMS.Data.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HotelMS.Services
{
    public class HotelServiceScheduleService : IHotelServiceScheduleService
    {
        private readonly DataContext _dbContext;

        public HotelServiceScheduleService(DataContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<HotelServiceSchedule> AddSchedule(HotelServiceScheduleDTO request)
        {
            try
            {
                var schedule = new HotelServiceSchedule
                {
                    HotelServiceId = request.HotelServiceId,
                    StartTime = request.StartTime,
                    EndTime = request.EndTime,
                    IsAvailable = request.IsAvailable
                };

                _dbContext.HotelServiceSchedules.Add(schedule);
                await _dbContext.SaveChangesAsync();

                return schedule;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw new Exception("An error occurred while attempting to save the hotel service schedule.");
            }
        }

        public async Task<HotelServiceSchedule> GetSchedule(int id)
        {
            try
            {
                return await _dbContext.HotelServiceSchedules.FindAsync(id);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw new Exception("An error occurred while retrieving the hotel service schedule.");
            }
        }

        public async Task<IEnumerable<HotelServiceSchedule>> GetAllSchedules(int? hotelServiceId = null)
        {
            try
            {
                IQueryable<HotelServiceSchedule> query = _dbContext.HotelServiceSchedules;

                if (hotelServiceId.HasValue)
                {
                    query = query.Where(s => s.HotelServiceId == hotelServiceId.Value);
                }

                return await query.ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw new Exception("An error occurred while retrieving hotel service schedules.");
            }
        }

        public async Task<HotelServiceSchedule> UpdateSchedule(int id, HotelServiceScheduleDTO request)
        {
            try
            {
                var schedule = await _dbContext.HotelServiceSchedules.FindAsync(id);

                if (schedule == null)
                {
                    return null;
                }

                schedule.HotelServiceId = request.HotelServiceId;
                schedule.StartTime = request.StartTime;
                schedule.EndTime = request.EndTime;
                schedule.IsAvailable = request.IsAvailable;

                await _dbContext.SaveChangesAsync();

                return schedule;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw new Exception("An error occurred while attempting to update the hotel service schedule.");
            }
        }

        public async Task DeleteSchedule(int id)
        {
            try
            {
                var schedule = await _dbContext.HotelServiceSchedules.FindAsync(id);
                if (schedule != null)
                {
                    _dbContext.HotelServiceSchedules.Remove(schedule);
                    await _dbContext.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw new Exception("An error occurred while attempting to delete the hotel service schedule.");
            }
        }
    }
}

