using System.ComponentModel.DataAnnotations;

namespace HotelMS.Data.DTO
{
    public class BulkRoomCreateDTO
    {
        [Required]
        public int RoomTypeID { get; set; }

        [Required]
        public int RoomStatusID { get; set; }

        [Required]
        public string Prefix { get; set; }

        [Required]
        [Range(1, 1000)]
        public int NumberOfRooms { get; set; }

        [Required]
        public int StartingRoomNumber { get; set; }
    }

}
