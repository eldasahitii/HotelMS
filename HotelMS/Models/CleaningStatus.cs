namespace HotelMS.Models
{
    public class CleaningStatus
    {
        public int CleaningStatusID { get; set; }
        public int CleaningStaffID { get; set; }
        public int RoomID { get; set; }
        public int StatusID { get; set; }
        public DateTime CleanedAt { get; set; } = DateTime.Now;
        public string Comments { get; set; } = string.Empty;

        public CleaningStaff CleaningStaff { get; set; }
        //public Room Room { get; set; }
        //public RoomStatus RoomStatus { get; set; }
    }
}
