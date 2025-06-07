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

        public required int ServiceID { get; set; }
        public HotelService? Service { get; set; }  // Nullable navigation property

        public required int UserID { get; set; }
        public User? User { get; set; }  // Nullable navigation property

        public int? CreatedByServiceReceptionistID { get; set; } = null;
        [ForeignKey("CreatedByServiceReceptionistID")]
        public ServiceRecepsionist? CreatedByServiceReceptionist { get; set; }  // Nullable navigation property

        [DataType(DataType.Date)]
        public required DateTime ReservationDate { get; set; }

        [MaxLength(50)]
        public required string TimeSlot { get; set; }

        [MaxLength(100)]
        public required string FirstName { get; set; }

        [MaxLength(100)]
        public required string LastName { get; set; }

        [EmailAddress]
        [MaxLength(255)]
        public required string Email { get; set; }

        [Phone]
        [MaxLength(20)]
        public required string Phone { get; set; }

        public int ServiceStatusID { get; set; }  // changed from ReservationStatusID
        public ServiceStatus? ServiceStatus { get; set; }  // changed from ReservationStatus


        public DateTime CreatedAt { get; set; } = DateTime.Now;

    }
}