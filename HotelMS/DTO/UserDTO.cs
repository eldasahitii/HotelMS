namespace HotelMS.DTO
{
    public class UserDTO
    {
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? Phone { get; set; }
        public string? Address { get; set; }
        public byte[]? profilePicture { get; set; }
    }
}
