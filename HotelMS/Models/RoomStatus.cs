using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotelMS.Models
{
    public class RoomStatus
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int RoomStatusID { get; set; }

        [Required]
        public string RoomStatusName { get; set; }
        public ICollection<Room> Rooms { get; set; }
    }
}
