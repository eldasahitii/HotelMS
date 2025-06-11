using HotelMS.Models;

namespace HotelMS.Data.DTO
{
    public class UserRegistrationDTO
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;

        public string RoleType { get; set; } = string.Empty;
        public string? Phone { get; set; }
    }
}
