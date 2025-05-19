using System.ComponentModel.DataAnnotations;

namespace HotelMS.Data.DTO
{
    public class RoomDTO
    {

        [Required]
        public string Title { get; set; }

        [Required]
        public int RoomTypeID { get; set; }

        [Required]
        public int RoomStatusID { get; set; }

    }
}
