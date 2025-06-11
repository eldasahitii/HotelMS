using System.ComponentModel.DataAnnotations;

namespace HotelMS.Models
{
    public class ServiceReservationStatus
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string StatusName { get; set; }  
    }
}
