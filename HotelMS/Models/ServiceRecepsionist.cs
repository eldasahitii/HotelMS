using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotelMS.Models
{
    //[Table("ServiceRecepsionist")]  // maps this class to DB table with that exact name
    public class ServiceRecepsionist
    {
        [Key]
        public int ServiceReceptionistID { get; set; }

        [ForeignKey("User")]
        public int UserID { get; set; }
        public User User { get; set; }

        [Required]
        public string Shift { get; set; }

        [ForeignKey("AssignedByUser")]
        public int AssignedByUserID { get; set; }
        public User AssignedByUser { get; set; }

        public DateTime AssignedAt { get; set; } = DateTime.UtcNow;
    }
}
