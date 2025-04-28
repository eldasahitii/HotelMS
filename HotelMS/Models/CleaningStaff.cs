namespace HotelMS.Models
{
    public class CleaningStaff
    {
        public int CleaningStaffID { get; set; }
        public TimeSpan ShiftStart { get; set; }
        public TimeSpan ShiftEnd { get; set; }
        public decimal Salary { get; set; }
        public string AssignedTasks { get; set; }
        public int CompletedTasks { get; set; }
        public string UserID { get; set; }
        public User User { get; set; }

    }
}
