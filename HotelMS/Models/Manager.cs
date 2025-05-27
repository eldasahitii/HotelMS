using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotelMS.Models
{
    public class Manager
    {
        [Key]
        public int ManagerID { get; set; }

        [ForeignKey("User")]
        public int UserID { get; set; }
        public User User { get; set; }

        [ForeignKey("ManagerType")]
        public int ManagerTypeID { get; set; }

        [Required]
        public ManagerType ManagerType { get; set; }

        public DateTime AssignedAt { get; set; } = DateTime.UtcNow;
    }
}
