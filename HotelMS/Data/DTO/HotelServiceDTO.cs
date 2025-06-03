using HotelMS.Models;
using HotelMS.Models.DTOs;

namespace HotelMS.Data.DTO
{
    public class HotelServiceDTO
    {
        public required string HeroImage { get; set; }
        public required string HeroTitle { get; set; }
        public required string HeroDescription { get; set; }
    }
}
