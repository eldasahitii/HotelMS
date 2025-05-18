//namespace HotelMS.Data.DTO
//{
//    public class HotelServiceReservationDTO
//    {
//        public int ReservationId { get; set; }
//        public DateTime ReservationDate { get; set; }
//    }
//}

//using System.ComponentModel.DataAnnotations;

//namespace HotelMS.Data.DTO
//{
//    public class HotelServiceReservationDTO
//    {
//        public int UserId { get; set; }
//        public int HotelServiceId { get; set; }
//        public int? ScheduleId { get; set; }
//        public DateTime ReservationTime { get; set; }

//        [RegularExpression("^(Confirmed|Pending|Cancelled)$", ErrorMessage = "Status must be 'Confirmed', 'Pending', or 'Cancelled'.")]
//        public string Status { get; set; } = "Pending";
//    }
//}
using System.ComponentModel.DataAnnotations;

namespace HotelMS.Data.DTO
{
    public class HotelServiceReservationDTO
    {
        public int ReservationId { get; set; }
        public string ServiceName { get; set; }
        public string ReservationStatus { get; set; }
        public DateTime ReservationTime { get; set; }
        public string UserFullName { get; set; }
        public string? ScheduledTimeSlot { get; set; } // Optional: Format like "10:00 AM - 11:00 AM"
    }
}
