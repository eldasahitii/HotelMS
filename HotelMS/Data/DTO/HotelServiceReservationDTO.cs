using System;

namespace HotelMS.Data.DTO
{
    public class HotelServiceReservationDTO
    {
        public int ReservationID { get; set; }

        // Service info (e.g., service name)
        public string ServiceName { get; set; } = null!;

        // User info (customer)
        public int UserID { get; set; }
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Phone { get; set; } = null!;

        // Receptionist info (nullable, because it might not be assigned)
        public int? CreatedByServiceReceptionistID { get; set; }
        public string? ReceptionistFirstName { get; set; }
        public string? ReceptionistLastName { get; set; }
        public string? ReceptionistEmail { get; set; }

        // Reservation details
        public DateTime ReservationDate { get; set; }
        public string TimeSlot { get; set; } = null!;

        // Reservation status
        public string ReservationStatusName { get; set; } = null!;

        // Optional special requests (you had it commented out, I included it here)
        //public string? SpecialRequests { get; set; }

        // When the reservation was created
        public DateTime CreatedAt { get; set; }
    }
}
