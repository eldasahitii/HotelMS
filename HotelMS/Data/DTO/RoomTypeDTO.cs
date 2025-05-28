using System.ComponentModel.DataAnnotations;

namespace HotelMS.Data.DTO
{
    public class RoomTypeDTO
    {
        public int RoomTypeID { get; set; }

        [Required]
        public string Name { get; set; }
        public string Capacity { get; set; }
        public string Size { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public List<RoomImageDTO>? Images { get; set; }
    }

}
