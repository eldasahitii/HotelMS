//using HotelMS.Models;
//using HotelMS.Data.DTO;

//namespace HotelMS.Data.Interfaces
//{
//    public interface IHotelServiceScheduleService
//    {
//        Task<IEnumerable<HotelServiceSchedule>> GetAllSchedulesAsync();
//        Task<HotelServiceSchedule> GetScheduleByIdAsync(int id);
//        Task<HotelServiceSchedule> CreateScheduleAsync(HotelServiceSchedule schedule);
//        Task<bool> DeleteScheduleAsync(int id);
//    }
//}

using System.Collections.Generic;
using System.Threading.Tasks;
using HotelMS.Models.DTOs;

namespace HotelMS.Services
{
    public interface IHotelServiceScheduleService
    {
        Task<IEnumerable<HotelServiceScheduleDTO>> GetAllAsync();
        Task<HotelServiceScheduleDTO> GetByIdAsync(int id);
        Task<HotelServiceScheduleDTO> CreateAsync(HotelServiceScheduleCreateUpdateDTO DTO);
        Task<bool> UpdateAsync(int id, HotelServiceScheduleCreateUpdateDTO DTO);
        Task<bool> DeleteAsync(int id);
    }
}
