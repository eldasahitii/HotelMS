using System.Collections.Generic;
using System.Threading.Tasks;
using HotelMS.Data.DTO;

namespace HotelMS.Services.Interfaces
{
    public interface IServiceRecepsionistService
    {
        Task<IEnumerable<ServiceRecepsionistDTO>> GetAllRecepsionistsAsync();
        Task<ServiceRecepsionistDTO?> GetRecepsionistByIdAsync(int recepsionistId);
        Task<int> CreateRecepsionistAsync(ServiceRecepsionistDTO recepsionistDto);
        Task<bool> UpdateRecepsionistAsync(ServiceRecepsionistDTO recepsionistDto);
        Task<bool> DeleteRecepsionistAsync(int recepsionistId);
    }
}
