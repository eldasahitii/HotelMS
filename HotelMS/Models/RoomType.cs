using System.ComponentModel.DataAnnotations;

namespace HotelMS.Models
{
    public class RoomType
    {
        [Key]
        public int RoomTypeID { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; }          

        [Required]
        [MaxLength(50)]
        public string Capacity { get; set; }    

        [Required]
        [MaxLength(50)]
        public string Size { get; set; }           

        [Required]
        public string Description { get; set; }   

        [Required]
        public decimal Price { get; set; }         

        public ICollection<Room> Rooms { get; set; }

        public ICollection<RoomImage> RoomImages { get; set; }  

    }
}
