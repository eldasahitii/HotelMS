namespace HotelMS.Data.DTO
{
    using System.ComponentModel.DataAnnotations;

    public class RoomReservationCreateDTO
    {
        [Required]
        public int RoomID { get; set; }

        [Required]
        public DateTime CheckInDate { get; set; }

        [Required]
        public DateTime CheckOutDate { get; set; }

        public string? SpecialRequests { get; set; }
        public int? CustomerUserID { get; set; }
    }

}
