using System.Collections.Generic;
using System.Threading.Tasks;
using HotelMS.Data.DTO;

namespace HotelMS.Services.Interfaces
{
    public interface IServiceReservationStatusService
    {
        Task<IEnumerable<ServiceReservationStatusDTO>> GetAllStatusesAsync();
        Task<ServiceReservationStatusDTO?> GetStatusByIdAsync(int statusId);
        Task<int> CreateStatusAsync(ServiceReservationStatusDTO statusDto);
        Task<bool> UpdateStatusAsync(ServiceReservationStatusDTO statusDto);
        Task<bool> DeleteStatusAsync(int statusId);
    }
}
