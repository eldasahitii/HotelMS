using HotelMS.Models;

namespace HotelMS.Data.DTO
{
    public class HotelServiceDTO
    {
        public string Type { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public bool IsActive { get; set; }

        public ICollection<HotelServiceScheduleDTO> HotelServiceSchedules { get; set; }
        public ICollection<HotelServiceReservationDTO> HotelServiceReservations { get; set; }

    }
}
