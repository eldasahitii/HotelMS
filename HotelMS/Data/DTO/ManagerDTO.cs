namespace HotelMS.Data.DTO
{
    public class ManagerDTO
    {
        public int ManagerID { get; set; }
        public int UserID { get; set; }
        public string UserFullName { get; set; }  
        public string Email { get; set; } 
        public string ManagerTypeName { get; set; }
        public int ManagerTypeID { get; set; }
        public DateTime AssignedAt { get; set; }  
    }
}
