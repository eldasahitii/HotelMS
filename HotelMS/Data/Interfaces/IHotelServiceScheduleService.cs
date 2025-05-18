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


using HotelMS.Data.DTO;
using HotelMS.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HotelMS.Data.Interfaces
{
    public interface IHotelServiceScheduleService
    {
        Task<HotelServiceSchedule> AddSchedule(HotelServiceScheduleDTO request);
        Task<HotelServiceSchedule> GetSchedule(int id);
        Task<IEnumerable<HotelServiceSchedule>> GetAllSchedules(int? hotelServiceId = null);
        Task DeleteSchedule(int id);
        Task<HotelServiceSchedule> UpdateSchedule(int id, HotelServiceScheduleDTO request);
    }
}
