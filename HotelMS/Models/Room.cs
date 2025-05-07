namespace HotelMS.Models
{
    public class Room
    {
        public int RoomID { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Capacity { get; set; }
        public string Size { get; set; }=string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public bool IsAvailable { get; set; } = true;
        public string ImageUrl { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        //public ICollection<RoomAmenity> RoomAmenities { get;set; }
        //public ICollection<Reservation>Reservations { get; set; }
    }
}
