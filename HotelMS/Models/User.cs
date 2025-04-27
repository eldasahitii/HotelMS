using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace HotelMS.Models
{
    public class User
    {
        public int UserID { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? Phone {  get; set; }
        public string? Address { get; set; }
        public byte[]? profilePicture { get; set; }
        public int RoleID { get; set; }
        public Role Role { get; set; }
        public Recepsionist? Recepsionist { get; set; }
        public CleaningStaff? CleaningStaff { get; set; }


    }
}
