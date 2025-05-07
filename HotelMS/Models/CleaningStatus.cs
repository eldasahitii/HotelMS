using System.ComponentModel.DataAnnotations;

namespace HotelMS.Models
{
    public class CleaningStatus
    {
        [Key]
        public int CleaningStatusID { get; set; }
        public int CleaningStaffID { get; set; }
        public int RoomID { get; set; }
        public DateTime CleanedAt { get; set; } = DateTime.Now;
        public string Comments { get; set; } = string.Empty;

        public CleaningStaff CleaningStaff { get; set; }
        public Room Room { get; set; }

    }
}
