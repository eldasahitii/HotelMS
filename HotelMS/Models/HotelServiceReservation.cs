using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotelMS.Models
{
    public class HotelServiceReservation
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ReservationID { get; set; }

        [Required]
        [ForeignKey("HotelService")]
        public int ServiceId { get; set; }
        public HotelService HotelService { get; set; }

        [Required]
        public string FirstName { get; set; }

        [Required]
        public string LastName { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [Phone]
        public string Phone { get; set; }

        [Required]
        public DateTime ReservationDate { get; set; }

        [Required]
        public TimeSpan StartTime { get; set; }

        [Required]
        public TimeSpan EndTime { get; set; }

        // Link to ReservationStatus table/entity
        [Required]
        public int ReservationStatusID { get; set; }
        public ReservationStatus ReservationStatus { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}
