//using HotelMS.Models;
//using HotelMS.Data.DTO;


//namespace HotelMS.Data.Interfaces
//{
//    public interface IHotelServiceService
//    {
//        Task<IEnumerable<HotelService>> GetServicesByTypeAsync(string type);
//        Task<HotelService> GetServiceByIdAsync(int id);
//        Task<IEnumerable<HotelServiceSchedule>> GetSchedulesByServiceIdAsync(int serviceId);
//        Task<HotelServiceReservation> ReserveServiceAsync(HotelServiceReservation reservation);
//        Task<HotelService> UpdateServiceAsync(int id, HotelService updatedService);
//        Task<bool> DeleteServiceAsync(int id);

//    }
//}
using HotelMS.Data.DTO;
using HotelMS.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HotelMS.Data.Interfaces
{
    public interface IHotelService
    {
        Task<HotelService> AddService(HotelServiceDTO request);
        Task<HotelService> GetService(int id);
        Task<IEnumerable<HotelService>> GetAllServices();
        Task DeleteService(int id);
        Task<HotelService> UpdateService(int id, HotelServiceDTO request);
    }
}
