namespace HotelMS.Data.DTO
{
    public class HotelServiceDetailDTO
    {
        public int Id { get; set; }  // Exposes DetailId from the model
        public int ServiceId { get; set; } // Foreign key
        public string Title { get; set; }
        public string Description { get; set; }
        public string ImageUrl { get; set; }
        public string? Price { get; set; }
    }
}