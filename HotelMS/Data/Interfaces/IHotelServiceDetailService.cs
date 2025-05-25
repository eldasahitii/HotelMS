using HotelMS.Data.DTO;
using HotelMS.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HotelMS.Data.Interfaces
{
    public interface IHotelServiceDetailService
    {
        Task<HotelServiceDetail> AddHotelServiceDetail(HotelServiceDetailDTO request);
        Task<HotelServiceDetail> GetHotelServiceDetail(int id);
        Task<IEnumerable<HotelServiceDetail>> GetAllHotelServiceDetails();
        Task DeleteHotelServiceDetail(int id);
        Task<HotelServiceDetail> UpdateHotelServiceDetail(int id, HotelServiceDetailDTO request);
    }
}
