
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace HotelMS.Models.DTOs
{
    
    public class HotelServiceDetailDTO
    {
        //[Required]
        public required string DetailImage { get; set; }
        //[Required]
        public required string DetailTitle { get; set; }
        //[Required]
        public required string DetailDescription { get; set; }

        public required string Price { get; set; } = "€25 per person";
    }
}
