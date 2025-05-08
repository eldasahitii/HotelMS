using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace HotelMS.Models
{
    public class CleaningAssignment
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int CleaningAssignmentID { get; set; }

        [Required]
        public int RoomID { get; set; }
        [ForeignKey("RoomID")]
        public Room Room { get; set; }

        [Required]
        public int CleaningStaffID { get; set; }
        [ForeignKey("CleaningStaffID")]
        public CleaningStaff CleaningStaff { get; set; }

        public DateTime AssignedAt { get; set; } = DateTime.Now;
        public DateTime? StartedAt { get; set; }
        public DateTime? FinishedAt { get; set; }

        [Required]
        public string Status { get; set; } = "Pending";

        public int? AssignedByUserID { get; set; }
        [ForeignKey("AssignedByUserID")]
        public User AssignedBy { get; set; }

    }
}
