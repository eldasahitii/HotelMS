using HotelMS.Models;
using HotelMS.Data.DTO;

namespace HotelMS.Data.Interfaces
{
    public interface IHotelServiceScheduleService
    {
        Task<IEnumerable<HotelServiceSchedule>> GetAllSchedulesAsync();
        Task<HotelServiceSchedule> GetScheduleByIdAsync(int id);
        Task<HotelServiceSchedule> CreateScheduleAsync(HotelServiceSchedule schedule);
        Task<bool> DeleteScheduleAsync(int id);
    }
}
