namespace HotelMS.Data.DTO
{
    public class RoomReservationUpdateDTO
    {
        public DateTime? CheckInDate { get; set; }
        public DateTime? CheckOutDate { get; set; }
        public string? SpecialRequests { get; set; }
    }

}
