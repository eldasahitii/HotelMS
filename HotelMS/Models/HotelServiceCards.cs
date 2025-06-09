using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace HotelMS.Models
{
    public class HotelServiceCards
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        //[Required]
        public required string CardImage { get; set; }
        //[Required]
        public required string CardTitle { get; set; }
        //[Required]
        public required string CardDescription { get; set; }
        public required string CardLink { get; set; }
    }
}
