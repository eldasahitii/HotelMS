namespace HotelMS.Data.DTO
{
    public class RoomImageDTO
    {
        public int RoomImageID { get; set; }
        public int RoomTypeID { get; set; }
        public string ImageUrl { get; set; }
        public bool IsPreview { get; set; }
    }
}
