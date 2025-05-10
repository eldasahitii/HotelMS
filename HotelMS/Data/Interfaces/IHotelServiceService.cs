using HotelMS.Models;
using HotelMS.Data.DTO;


namespace HotelMS.Data.Interfaces
{
    public interface IHotelServiceService
    {
        Task<IEnumerable<HotelService>> GetServicesByTypeAsync(string type);
        Task<HotelService> GetServiceByIdAsync(int id);
        Task<IEnumerable<HotelServiceSchedule>> GetSchedulesByServiceIdAsync(int serviceId);
        Task<HotelServiceReservation> ReserveServiceAsync(HotelServiceReservation reservation);
    }
}
