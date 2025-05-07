using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace HotelMS.Models
{
    public class Room
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int RoomID { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string Capacity { get; set; }
        [Required]
        public string Size { get; set; }
        [Required]
        public string Description { get; set; }
        [Required]
        public decimal Price { get; set; }
        public bool IsAvailable { get; set; } = true;
        [Required]
        public string ImageUrl { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        //public ICollection<RoomAmenity> RoomAmenities { get;set; }
        //public ICollection<Reservation>Reservations { get; set; }
    }
}
