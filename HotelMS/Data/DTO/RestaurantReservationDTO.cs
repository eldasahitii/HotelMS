namespace HotelMS.Data.DTO
{
    public class RestaurantReservationDTO
    {

        public int ReservationID { get; set; }

        public int? GuestID { get; set; }

        public string GuestName { get; set; }

        public string Email { get; set; }

        public string PhoneNumber { get; set; }

        public int RestaurantTableID { get; set; }

        public int TableNumber { get; set; }

        public DateTime DateTime { get; set; }

        public string Status { get; set; }
    }
}
