namespace HotelMS.Models
{
    public class Recepsionist
    {
        public int RecepsionistID { get; set; }
        public string Phone { get; set; }
        public TimeSpan ShiftStart { get; set; }
        public TimeSpan ShiftEnd { get; set; }
        public string RecepsionistType { get; set; }
        public decimal Salary { get; set; }
        public int UserID { get; set; }
        public User User { get; set; }
    }
}
