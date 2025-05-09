using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotelMS.Models
{
    public class HotelServiceReservation
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }

        [ForeignKey("UserId")]
        public User User { get; set; }

        [Required]
        public int HotelServiceId { get; set; }

        [ForeignKey("HotelServiceId")]
        public HotelService Service { get; set; }
        public int? ScheduleId { get; set; }

        [ForeignKey("ScheduleId")]
        public HotelServiceSchedule Schedule { get; set; }

        [Required]
        public DateTime ReservationTime { get; set; }

        [Required]
        [MaxLength(50)]
        [RegularExpression ("^(Confirmed|Pending|Cancelled)$", ErrorMessage = "Status msut be 'Confirmed', 'Pending', or 'Cancelled'.")]
        public string Status { get; set; } = "Confirmed";
    }
}
