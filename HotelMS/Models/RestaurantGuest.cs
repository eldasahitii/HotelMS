using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace HotelMS.Models
{
    public class RestaurantGuest
    {
        [Key]
        public int GuestID { get; set; }

        [Required]
        public string FirstName { get; set; }

        public string LastName { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        public string PhoneNumber { get; set; }

        public ICollection<RestaurantReservation> RestaurantReservations { get; set; }
    }
}
