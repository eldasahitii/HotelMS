using System;
using System.ComponentModel.DataAnnotations;

namespace HotelMS.Data.DTO
{
    public class HotelServiceReservationDTO
    {
        public int ReservationID { get; set; }

        public int ServiceId { get; set; }           // FK to service

        [Required]
        public string FirstName { get; set; }

        [Required]
        public string LastName { get; set; }

        [Required, EmailAddress]
        public string Email { get; set; }

        [Required, Phone]
        public string Phone { get; set; }

        [Required]
        public DateTime ReservationDate { get; set; }

        [Required]
        public TimeSpan StartTime { get; set; }

        [Required]
        public TimeSpan EndTime { get; set; }

        public int ReservationStatusID { get; set; }

        public string ReservationStatusName { get; set; }   // User-friendly status

        public DateTime CreatedAt { get; set; }
    }
}