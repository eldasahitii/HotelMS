using System.ComponentModel.DataAnnotations;

namespace HotelMS.Data.DTO
{
    public class RoomReservationDTO
    {
        public int ReservationID { get; set; }
        public string RoomTypeName { get; set; }
        public string ReservationStatusName { get; set; }
        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }
        public string? SpecialRequests { get; set; }
        public int UserID { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public int? CreatedByReceptionistID { get; set; }
        public string? ReceptionistFirstName { get; set; }
        public string? ReceptionistLastName { get; set; }
        public string? ReceptionistEmail { get; set; }
    }
}
