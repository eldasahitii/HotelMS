using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;


namespace HotelMS.Models
{
    public class Reservation
    {

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]

        public int ReservationID { get; set; }
        [Required]

        public int guest_id { get; set; }

        public DateTime date_time { get; set; }

        public string status { get; set; }

        public int RestaurantTableID { get; set; }
        public RestaurantTable RestaurantTable { get; set; }

    }
}
