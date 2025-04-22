using Microsoft.AspNetCore.Identity;

namespace HotelMS.Models
{
    public class User
    {
        public int UserID { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public DateTime CreatedAt { get; set; }
        public int RoleID { get; set; }
        public Role Role { get; set; }
    }
}
