using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace HotelMS.Models
{
    public class RestaurantTable
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]

        public int RestaurantTableID { get; set; }
        [Required]

        public int TableNumber { get; set; }

        public string Status { get; set; }

        public ICollection<Reservation> Reservations { get; set; }
        

    }
}
