namespace HotelMS.Data.DTO
{
    public class RestaurantReservationCreateDTO
    {
        public int GuestID { get; set; }

        public int RestaurantTableID { get; set; }

        public DateTime DateTime { get; set; }

        public string Status { get; set; } = "Booked";
    }
}
