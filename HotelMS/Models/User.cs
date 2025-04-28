using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace HotelMS.Models
{
    public class User : IdentityUser
    {
        public int UserID { get; set; }

        [Required]
        [MaxLength(30)]
        public string FirstName { get; set; }
        [Required]
        [MaxLength(30)]
        public string LastName { get; set; }
        [Required]
        [MaxLength(50)]
        public string Username { get; set; }
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        [MinLength(6)]
        public string PasswordHash { get; set; }
        public DateTime CreatedAt { get; set; }=DateTime.Now;
        public string? Phone {  get; set; }
        public string? Address { get; set; }
        public int RoleID { get; set; }
        public Role Role { get; set; }
        public Recepsionist? Recepsionist { get; set; }
        public CleaningStaff? CleaningStaff { get; set; }


    }
}
