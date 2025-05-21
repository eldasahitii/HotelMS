namespace HotelMS.Data.DTO
{
    public class CleaningAssignmentDTO
    {
        public int CleaningAssignmentID { get; set; }
        public int RoomID { get; set; }
        public string? RoomName { get; set; }
        public string? RoomStatus { get; set; }
        public int CleaningStaffID { get; set; }
        public string? StaffName { get; set; }
        public string? RoomNumber { get; set; }

        public string? Status { get; set; }

        public DateTime AssignedAt { get; set; }
        public DateTime? StartedAt { get; set; }
        public DateTime? FinishedAt { get; set; }
        public int? AssignedByUserID { get; set; }
        public string? AssignedByName { get; set; }

    }
}
