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
        [StringLength(100)]
        public string FirstName { get; set; }

        [Required]
        [StringLength(100)]
        public string LastName { get; set; }

        [Required]
        [EmailAddress]
        [StringLength(255)]
        public string Email { get; set; }

        [Required]
        [Phone]
        [StringLength(20)]
        public string Phone { get; set; }

        [Required]
        public DateTime ReservationDate { get; set; }

        [Required]
        [StringLength(50)]
        public string TimeSlot { get; set; }

        [Required]
        public int HotelServiceDetailID { get; set; }

        [ForeignKey("HotelServiceDetailID")]
        public HotelServiceDetail HotelServiceDetail { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        
        public int? ReservationStatusID { get; set; }

        [ForeignKey("ReservationStatusID")]
        public ReservationStatus? ReservationStatus { get; set; }

        public int? ServiceRecepsionistId { get; set; }

        [ForeignKey("ServiceRecepsionistId")]
        public ServiceRecepsionist? ServiceRecepsionist { get; set; }

    }
}
