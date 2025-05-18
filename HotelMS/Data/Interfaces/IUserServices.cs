using HotelMS.Data.DTO;
using HotelMS.Models;

namespace HotelMS.Data.Interfaces
{
    public interface IUserServices
    {
        Task<User> GetUser(int id);
        Task<IEnumerable<UserDTO>> GetAll();
       
        Task DeleteUser(int id);
        Task<User> UpdateUser(int id, UserDTO request);

    }
}
