using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace HotelMS.Models
{
    public class ReservationStatus
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ReservationStatusID { get; set; } 
        [Required]
        public string ReservationStatusName { get; set; } 
        public ICollection<RoomReservation> RoomReservations { get; set; } 
    }
}
