using System;
using System.ComponentModel.DataAnnotations;

namespace HotelMS.Data.DTO
{
    public class HotelServiceReservationUpdateDTO
    {
        [Required]
        public DateTime ReservationDate { get; set; }

        [Required]
        public TimeSpan StartTime { get; set; }

        [Required]
        public TimeSpan EndTime { get; set; }

        public string Phone { get; set; }

        public string Email { get; set; }
    }
}
