using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace HotelMS.Models
{
    public class ServiceRecepsionist
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string FirstName { get; set; }

        [Required]
        [MaxLength(100)]
        public string LastName { get; set; }

        [Required]
        [EmailAddress]
        [MaxLength(255)]
        public string Email { get; set; }

        [Required]
        [Phone]
        [MaxLength(20)]
        public string Phone { get; set; }
        public int TotalReservationsHandled { get; set; }

        
        public ICollection<HotelServiceReservation> Reservations { get; set; }
    }
}
