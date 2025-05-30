namespace HotelMS.Data.DTO
{
    public class UserReservationResponseDTO
    {
            public int ReservationID { get; set; }
            public string RoomName { get; set; }
            public DateTime CheckInDate { get; set; }
            public DateTime CheckOutDate { get; set; }
            public string Status { get; set; }
    }

    }

