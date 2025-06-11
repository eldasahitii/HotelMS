namespace HotelMS.Data.DTO
{
    public class RestaurantReservationUserDTO
    {
        public string Email { get; set; }
        public int RestaurantTableID { get; set; }
        public DateTime DateTime { get; set; }
        public string Status { get; set; } = "Occupied";
    }
}
