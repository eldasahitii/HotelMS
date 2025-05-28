namespace HotelMS.Data.DTO
{
    public class RoomRecepsionistDTO
    {
        public int RoomReceptionistID { get; set; }
        public int UserID { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Shift { get; set; }
        public int AssignedByUserID { get; set; }
        public string AssignedByUserName { get; set; }
        public DateTime? AssignedAt { get; set; }
    }
}
