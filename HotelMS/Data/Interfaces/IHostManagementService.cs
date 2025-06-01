using HotelMS.Data.DTO;
using HotelMS.Models;

namespace HotelMS.Data.Interfaces
{
    public interface IHostManagementService
    {
        Task<List<HostDTO>> GetAllHostsAsync();

        Task<HostDTO> GetHostByIdAsync(int userId);

        Task<HostDTO> UpdateHostAsync(int id, HostDTO updatedHost);

        Task<string> AssignHostRoleByEmailAsync(string email);



        //Task<HostDTO> CreateHostAsync(HostDTO hostDto);

        Task<bool> DeleteHostAsync(int userId);
    }
}
