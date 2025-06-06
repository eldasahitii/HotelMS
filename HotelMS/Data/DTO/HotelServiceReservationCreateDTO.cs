using System;
using System.ComponentModel.DataAnnotations;

namespace HotelMS.Data.DTO
{
    public class HotelServiceReservationCreateDTO
    {
        
        public required int ServiceID { get; set; }

        
        public required DateTime ReservationDate { get; set; }

      
        public required string TimeSlot { get; set; } = null!;

        [Required]
        [MaxLength(100)]
        public string FirstName { get; set; } = null!;

        
        public required string LastName { get; set; } = null!;

       
        public required string Email { get; set; } = null!;

       
        public required string Phone { get; set; } = null!;

        public int? CustomerUserID { get; set; }

        // Optional: public int? ReceptionistID { get; set; }
        // Optional: public string? SpecialRequests { get; set; }
    }
}
