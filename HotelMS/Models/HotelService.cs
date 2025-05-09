namespace HotelMS.Models
{
    public class HotelService
    {
        public int Id { get; set; }
        public string Type { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public bool IsActive { get; set; }

        public ICollection<HotelServiceSchedule> HotelServiceSchedules { get; set; }
        public ICollection<HotelServiceReservation> HotelServiceReservations { get; set; }

    }
}
