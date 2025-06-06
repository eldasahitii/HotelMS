using System;
using System.ComponentModel.DataAnnotations;

namespace HotelMS.Data.DTO
{
    public class HotelServiceReservationUpdateDTO
    {
        public DateTime? ReservationDate { get; set; }

       
        public string? TimeSlot { get; set; }

        
        public string? FirstName { get; set; }

        
        public string? LastName { get; set; }

        
        public string? Email { get; set; }

        public string? Phone { get; set; }

        // Optional: public string? SpecialRequests { get; set; }
    }
}
