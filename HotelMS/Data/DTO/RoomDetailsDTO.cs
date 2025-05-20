using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace HotelMS.Data.DTO
{
    public class RoomDetailsDTO
    {
        public int RoomID { get; set; }
        [Required]
        public string RoomNumber { get; set; }
        [Required]
        public string Title { get; set; }

        public DateTime CreatedAt { get; set; }

        [Required]
        public int RoomStatusID { get; set; }

        public string RoomStatusName { get; set; }

        public RoomTypeDTO RoomType { get; set; }
    }
}