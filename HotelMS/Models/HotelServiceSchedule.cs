using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotelMS.Models
{
    public class HotelServiceSchedule
    {
        public int Id { get; set; }
        public int ServiceId { get; set; }
        public HotelService Service { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public bool IsAvailabale { get; set; }

    }
}
