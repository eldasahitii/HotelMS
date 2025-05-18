namespace HotelMS.Data.DTO
{
    public class MenuItemCreateDTO
    {
        public string Name { get; set; }

        public string Description { get; set; }

        public double Price { get; set; }

        public string image_url { get; set; }

        public Boolean is_available { get; set; }

        public int MenuCategoryID { get; set; }
    }
}
