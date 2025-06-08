using HotelMS.Data;
using HotelMS.Data.DTO;
using HotelMS.Models;
using HotelMS.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace HotelMS.Services
{
    public class ServiceReservationStatusService : IServiceReservationStatusService
    {
        private readonly DataContext _context;

        public ServiceReservationStatusService(DataContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ServiceReservationStatusDTO>> GetAllStatusesAsync()
        {
            return await _context.ServiceReservastionStatuses
                .Select(s => new ServiceReservationStatusDTO
                {
                    Id = s.Id,
                    StatusName = s.StatusName
                }).ToListAsync();
        }

        public async Task<ServiceReservationStatusDTO?> GetStatusByIdAsync(int id)
        {
            var status = await _context.ServiceReservastionStatuses.FindAsync(id);
            if (status == null) return null;

            return new ServiceReservationStatusDTO
            {
                Id = status.Id,
                StatusName = status.StatusName
            };
        }

        public async Task<int> CreateStatusAsync(ServiceReservationStatusDTO dto)
        {
            var status = new ServiceReservationStatus
            {
                StatusName = dto.StatusName
            };
            _context.ServiceReservastionStatuses.Add(status);
            await _context.SaveChangesAsync();
            return status.Id;
        }

        public async Task<bool> UpdateStatusAsync(ServiceReservationStatusDTO dto)
        {
            var status = await _context.ServiceReservastionStatuses.FindAsync(dto.Id);
            if (status == null) return false;

            status.StatusName = dto.StatusName;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteStatusAsync(int id)
        {
            var status = await _context.ServiceReservastionStatuses.FindAsync(id);
            if (status == null) return false;

            _context.ServiceReservastionStatuses.Remove(status);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
