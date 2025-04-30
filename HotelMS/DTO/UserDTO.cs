namespace HotelMS.DTO
{
    public class UserDTO
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? Phone { get; set; }
        public string? Address { get; set; }
        public byte[]? profilePicture { get; set; }
    }
}
