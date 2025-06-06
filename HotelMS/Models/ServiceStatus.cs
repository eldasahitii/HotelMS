using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotelMS.Models
{
    public class ServiceStatus
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ServiceStatusID { get; set; }

        [Required]
        public string ServiceStatusName { get; set; }

        // Navigation property for services or service reservations related to this status
        public ICollection<HotelServiceReservation> ServiceReservations { get; set; }
    }
}
