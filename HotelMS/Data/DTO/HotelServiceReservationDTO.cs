using System;

namespace HotelMS.Data.DTO
{
    public class HotelServiceReservationDTO
    {
        public int ReservationID { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string Email { get; set; }

        public string Phone { get; set; }

        public DateTime ReservationDate { get; set; }

        public string TimeSlot { get; set; }

        public int HotelServiceDetailID { get; set; }
        public string? HotelServiceName { get; set; }

        public int? ReservationStatusID { get; set; }
        public string? ReservationStatusName { get; set; }

        public DateTime CreatedAt { get; set; }

        public int? ServiceRecepsionistId { get; set; }
        public string? ReceptionistFirstName { get; set; }
        public string? ReceptionistLastName { get; set; }
        public string? ReceptionistEmail { get; set; }
    }
}
