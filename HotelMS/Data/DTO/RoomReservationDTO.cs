using System.ComponentModel.DataAnnotations;

namespace HotelMS.Data.DTO
{
    public class RoomReservationDTO
    {
        [Required]
        public int RoomID { get; set; } 

        [Required]
        public DateTime CheckInDate { get; set; }

        [Required]
        public DateTime CheckOutDate { get; set; }
        public string SpecialRequests { get; set; }
    }
}
