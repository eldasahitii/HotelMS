namespace HotelMS.Data.DTO
{
    public class ServiceRecepsionistDTO
    {
        public int ServiceReceptionistID { get; set; }
        public int UserID { get; set; }

        // User info
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string Email { get; set; } = null!;

        public string Shift { get; set; } = null!;

        public int AssignedByUserID { get; set; }

        // AssignedByUser info (username or full name)
        public string AssignedByUserName { get; set; } = null!;

        public DateTime AssignedAt { get; set; }
    }
}
