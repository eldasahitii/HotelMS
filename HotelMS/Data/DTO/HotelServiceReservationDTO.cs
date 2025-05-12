namespace HotelMS.Data.DTO
{
    public class HotelServiceReservationDTO
    {
        public int ReservationId { get; set; }
        public DateTime ReservationDate { get; set; }
    }
}
//using System;
//using System.ComponentModel.DataAnnotations;

//namespace HotelMS.Data.DTO
//{
//    public class HotelServiceReservationCreateDTO
//    {
//        [Required]
//        public int UserId { get; set; }

//        [Required]
//        public int HotelServiceId { get; set; }

//        public int? ScheduleId { get; set; }

//        [Required]
//        public DateTime ReservationTime { get; set; }

//        [Required]
//        [RegularExpression("^(Confirmed|Pending|Cancelled)$", ErrorMessage = "Status must be 'Confirmed', 'Pending', or 'Cancelled'.")]
//        public string Status { get; set; }
//    }
//}

