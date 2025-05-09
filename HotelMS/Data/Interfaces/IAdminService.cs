using HotelMS.Data.DTO;
using HotelMS.Models;

namespace HotelMS.Data.Interfaces
{
    public interface IAdminService
    {
        Task<string> AddManager(UserRegistrationDTO request);
        Task<User> GetManagerByID(int id);
        Task<IEnumerable<User>> GetManagers();
        Task<User> UpdateManager(int id,UserDTO request);
        Task<string> DeleteManager(int id);
    }
}
