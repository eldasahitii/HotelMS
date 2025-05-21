namespace HotelMS.Models
{
    public class RoomImage
    {
        public int RoomImageID { get; set; } 
        public int RoomTypeID { get; set; }  
        public string ImageUrl { get; set; }
        public bool IsPreview { get; set; }
        public RoomType RoomType { get; set; }
    }

}
