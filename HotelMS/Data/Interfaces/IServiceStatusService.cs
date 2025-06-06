using HotelMS.Data.DTO;
using HotelMS.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HotelMS.Data.Interfaces
{
    public interface IServiceStatusService
    {
        Task<ServiceStatus> AddServiceStatus(ServiceStatusDTO request);
        Task<ServiceStatus> GetServiceStatus(int id);
        Task<IEnumerable<ServiceStatus>> GetAllServiceStatus();
        Task DeleteServiceStatus(int id);
        Task<ServiceStatus> UpdateServiceStatus(int id, ServiceStatusDTO request);
    }
}
