using HotelMS.Data.DTO;
using HotelMS.Models;

namespace HotelMS.Data.Interfaces
{
    public interface IAuthService
    {
        Task<UserDTO> Register(UserRegistrationDTO request);
        Task<string> Login(UserLoginDTO request);
        Task<UserDTO> ChangePassword(int UserID, ChangePasswordDTO request);
    }
}
