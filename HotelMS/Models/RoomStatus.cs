using System.ComponentModel.DataAnnotations;

namespace HotelMS.Models
{
    public class RoomStatus
    {
        [Key]
        public int RoomStatusID { get; set; }
        public int RoomID { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime UpdatedAt { get; set; } = DateTime.Now;

        public Room Room { get; set; }
    }
}
