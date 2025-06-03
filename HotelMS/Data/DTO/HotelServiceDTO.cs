using HotelMS.Models;
using HotelMS.Models.DTOs;

namespace HotelMS.Data.DTO
{
    public class HotelServiceDTO
    {
        public string Type { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public bool IsActive { get; set; }

        public ICollection<HotelServiceDetailDTO> HotelServiceDetails { get; set; }
        public ICollection<HotelServiceScheduleCreateUpdateDTO> HotelServiceScheduleCreateUpdates { get; set; }
        public ICollection<HotelServiceReservationDTO> HotelServiceReservations { get; set; }

    }
}
