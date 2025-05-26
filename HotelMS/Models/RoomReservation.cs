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

        public int? CreatedByReceptionistID { get; set; } 
        [ForeignKey("CreatedByReceptionistID")]
        public RoomRecepsionist CreatedByReceptionist { get; set; } 

        [Required]
        public DateTime CheckInDate { get; set; }

        public DateTime CheckOutDate { get; set; }

        public int ReservationStatusID { get; set; }
        public ReservationStatus ReservationStatus { get; set; }

        public string? SpecialRequests { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}

