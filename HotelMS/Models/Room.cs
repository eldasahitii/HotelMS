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
        public string RoomNumber { get; set; }

        [Required]
        public string Title { get; set; }

        //[Required]
        //public string Capacity { get; set; }

        //[Required]
        //public string Size { get; set; }

        //[Required]
        //public string Description { get; set; }

        //[Required]
        //public decimal Price { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public int RoomTypeID { get; set; }
        public RoomType RoomType { get; set; }

        public int RoomStatusID { get; set; }
        public RoomStatus RoomStatus { get; set; }

        public ICollection<RoomReservation> Reservations { get; set; }
        //public ICollection<RoomImage> RoomImages { get; set; }
    }

}
