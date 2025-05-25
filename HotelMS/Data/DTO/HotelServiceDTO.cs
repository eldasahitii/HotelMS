namespace HotelMS.Data.DTO
{
    public class HotelServiceDTO
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string HeroImageUrl { get; set; }

        // If you want to expose the Id as well (optional)
        //public int? Id { get; set; }
    }
}

