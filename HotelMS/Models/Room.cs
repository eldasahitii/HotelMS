using System.ComponentModel.DataAnnotations;

namespace HotelMS.Models
{
    public class Room
    {
        [Key]
        public int RoomID { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Capacity {  get; set; }
        public string Size { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty ;
        public decimal Price { get; set; }
        public bool IsAvailable { get; set; } = true;
        public string ImageUrl { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public ICollection<CleaningStatus> CleaningStatuses { get; set; } = new List<CleaningStatus>();
        public ICollection<RoomStatus> RoomStatuses { get; set; } = new List<RoomStatus>();
    }
}
