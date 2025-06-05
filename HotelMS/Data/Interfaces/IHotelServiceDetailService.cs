using HotelMS.Data.DTO;
using HotelMS.Models.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HotelMS.Data.Interfaces
{
    public interface IHotelServiceDetailService
    {
        Task<HotelServiceDetailDTO> AddServiceDetailAsync(HotelServiceDetailDTO request);
        Task<HotelServiceDetailDTO> GetServiceDetailAsync(int id);
        Task<IEnumerable<HotelServiceDetailDTO>> GetAllServiceDetailsAsync();
        Task DeleteServiceDetailAsync(int id);
        Task<HotelServiceDetailDTO> UpdateServiceDetailAsync(int id, HotelServiceDetailDTO request);
    }
}
