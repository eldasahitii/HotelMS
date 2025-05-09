namespace HotelMS.Models
{
    public class HotelServiceReservation
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
        public int ServiceId { get; set; }
        public HotelService Service { get; set; }
        public int? ScheduleId { get; set; }
        public HotelServiceSchedule Schedule { get; set; }
        public DateTime ReservationTime { get; set; }
        public string Status { get; set; } = "Confirmed";
    }
}
