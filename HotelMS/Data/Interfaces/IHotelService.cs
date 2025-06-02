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
