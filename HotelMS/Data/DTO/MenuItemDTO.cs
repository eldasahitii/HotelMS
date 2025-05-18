namespace HotelMS.Data.DTO
{
    public class MenuItemDTO
    {

        public int MenuItemID { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public double Price { get; set; }

        public string image_url { get; set; }

        public Boolean is_available { get; set; }

        public string CategoryName { get; set; }
    }
}
