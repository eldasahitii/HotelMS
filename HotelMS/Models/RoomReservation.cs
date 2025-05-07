using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotelMS.Models
{
    public class RoomReservation
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ReservationID { get; set; }
        [Required]
        public int RoomID { get; set; }
        public Room Room { get; set; }
        [Required]
        public int UserID { get; set; }
        public User User { get; set; }
        [Required]
        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }
        public string Status { get; set; } = "Pending";

        public DateTime CreatedAt { get; set; }=DateTime.Now;


    }
}
