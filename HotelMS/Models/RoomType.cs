using System.ComponentModel.DataAnnotations;

namespace HotelMS.Models
{
    public class RoomType
    {
        [Key]
        public int RoomTypeID { get; set; }

        [Required]
        [MaxLength(50)]
        public string Name { get; set; }

        public ICollection<Room> Rooms { get; set; } 
    }
}
