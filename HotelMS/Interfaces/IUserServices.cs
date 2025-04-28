using HotelMS.DTO;
using HotelMS.Models;

namespace HotelMS.Interfaces
{
    public interface IUserServices
    {
        Task<User> GetUser(int id);
        Task<IEnumerable<User>> GetAll();
       
        Task DeleteUser(int id);
        Task<User> UpdateUser(int id, UserDTO request);

    }
}
