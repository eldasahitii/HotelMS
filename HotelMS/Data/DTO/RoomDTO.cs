namespace HotelMS.Data.DTO
{
    public class RoomDTO
    {
        public string Name { get; set; }
        public string Capacity { get; set; }
        public string Size { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public string ImageUrl { get; set; }
        public int RoomStatusID { get; set; }  
        public int? RoomTypeID { get; set; }      

    }
}
