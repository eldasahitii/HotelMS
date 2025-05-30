namespace HotelMS.Data.DTO
{
    public class RestaurantTableDTO
    {
        public int RestaurantTableID { get; set; }

        public int TableNumber { get; set; }

        public string Status { get; set; } = "Available";

        public int Capacity { get; set; }
    }
}
