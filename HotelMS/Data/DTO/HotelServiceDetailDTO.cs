//namespace HotelMS.Data.DTO
//{
//    public class HotelServiceScheduleDTO
//    {
//        public DateTime StartTime { get; set; }
//        public DateTime EndTime { get; set; }
//        public bool isAvailable { get; set; }
//        public int HotelServiceId { get; set; }
//    }
//}

namespace HotelMS.Models.DTOs
{
    // For reading data (returns to client)
    public class HotelServiceDetailDTO
    {
        public int Id { get; set; }
        public int HotelServiceId { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public bool IsAvailable { get; set; }
    }


    // For creating/updating data (from client)
    public class HotelServiceScheduleCreateUpdateDTO
    {
        public int HotelServiceId { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public bool IsAvailable { get; set; }
    }
}
