using HotelMS.Data.DTO;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HotelMS.Data.Interfaces
{
    public interface IServiceRecepsionistService
    {
        Task<ServiceRecepsionistDTO> AddRecepsionist(int userId, ServiceRecepsionistDTO dto);
        Task<ServiceRecepsionistDTO> GetRecepsionistById(int id);
        Task<IEnumerable<ServiceRecepsionistDTO>> GetAllRecepsionists();
        Task<ServiceRecepsionistDTO> UpdateRecepsionist(int id, ServiceRecepsionistDTO dto);
        Task DeleteRecepsionist(int id);
    }
}
