using HotelMS.Data;
using HotelMS.Data.DTO;
using HotelMS.Models;
using HotelMS.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace HotelMS.Services
{
    public class ServiceRecepsionistService : IServiceRecepsionistService
    {
        private readonly DataContext _context;

        public ServiceRecepsionistService(DataContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ServiceRecepsionistDTO>> GetAllRecepsionistsAsync()
        {
            return await _context.ServiceRecepsionists
                .Select(r => new ServiceRecepsionistDTO
                {
                    Id = r.Id,
                    FirstName = r.FirstName,
                    LastName = r.LastName,
                    Email = r.Email,
                    Phone = r.Phone,  // <-- add this
                    TotalReservationsHandled = r.TotalReservationsHandled // 
                }).ToListAsync();
        }

        public async Task<ServiceRecepsionistDTO?> GetRecepsionistByIdAsync(int id)
        {
            var recep = await _context.ServiceRecepsionists.FindAsync(id);
            if (recep == null) return null;

            return new ServiceRecepsionistDTO
            {
                Id = recep.Id,
                FirstName = recep.FirstName,
                LastName = recep.LastName,
                Email = recep.Email,
                Phone = recep.Phone,
                TotalReservationsHandled = recep.TotalReservationsHandled
            };
        }

        //public async Task<int> CreateRecepsionistAsync(ServiceRecepsionistDTO dto)
        //{
        //    var recep = new ServiceRecepsionist
        //    {
        //        FirstName = dto.FirstName,
        //        LastName = dto.LastName,
        //        Email = dto.Email,
        //       Phone = dto.Phone,
        //        TotalReservationsHandled = dto.TotalReservationsHandled
        //    };
        //    _context.ServiceRecepsionists.Add(recep);
        //    await _context.SaveChangesAsync();
        //    return recep.Id;
        //}
        public async Task<int> CreateRecepsionistAsync(ServiceRecepsionistDTO dto)
        {
            var recep = new ServiceRecepsionist
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                Phone = dto.Phone,  // <-- assign Phone here
                TotalReservationsHandled = dto.TotalReservationsHandled  // optional, but recommended
            };
            _context.ServiceRecepsionists.Add(recep);
            await _context.SaveChangesAsync();
            return recep.Id;
        }


        public async Task<bool> UpdateRecepsionistAsync(ServiceRecepsionistDTO dto)
        {
            var recep = await _context.ServiceRecepsionists.FindAsync(dto.Id);
            if (recep == null) return false;

            recep.FirstName = dto.FirstName;
            recep.LastName = dto.LastName;
            recep.Email = dto.Email;
            recep.Phone = dto.Phone;
            recep.TotalReservationsHandled = dto.TotalReservationsHandled;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteRecepsionistAsync(int id)
        {
            var recep = await _context.ServiceRecepsionists.FindAsync(id);
            if (recep == null) return false;

            _context.ServiceRecepsionists.Remove(recep);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
