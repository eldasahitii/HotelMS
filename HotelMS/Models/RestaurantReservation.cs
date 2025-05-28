using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;


namespace HotelMS.Models
{
    public class RestaurantReservation
    {

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]

        public int ReservationID { get; set; }
      

        [ForeignKey("RestaurantGuest")]
        public int? GuestID { get; set; }
        public RestaurantGuest RestaurantGuest { get; set; }

        public int? UserID { get; set; }
        [ForeignKey("UserID")]
        public User User { get; set; }

        public DateTime date_time { get; set; }

        public string status { get; set; }

        public int RestaurantTableID { get; set; }
        public RestaurantTable RestaurantTable { get; set; }

       

    }
}
