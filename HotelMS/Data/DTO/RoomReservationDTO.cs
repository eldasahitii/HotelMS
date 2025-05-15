using System.ComponentModel.DataAnnotations;

namespace HotelMS.Data.DTO
{
    public class RoomReservationDTO
    {
        public string RoomTypeName { get; set; }
        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }
        public string? SpecialRequests { get; set; }
    }
}
