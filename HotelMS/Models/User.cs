using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace HotelMS.Models
{
    public class User
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int UserID { get; set; }

        [Required]
        [MaxLength(30)]
        public string FirstName { get; set; }
        [Required]
        [MaxLength(30)]
        public string LastName { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        [MinLength(6)]
        public byte[]? PasswordHash { get; set; }

        [Required]
        public byte[] PasswordSalt { get; set; }

        [RegularExpression(@"^\d{9}$", ErrorMessage = "Phone number must be exactly 9 digits.")]
        public string? Phone { get; set; }

        public string? Address { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public int RoleID { get; set; }
        public Role Role { get; set; }
        public RoomRecepsionist RoomRecepsionist { get; set; }
        public ICollection<RoomReservation> RoomReservations { get; set; }
        public string? RefreshToken { get; set; }
        public DateTime? RefreshTokenExpiry { get; set; }



    }
}
