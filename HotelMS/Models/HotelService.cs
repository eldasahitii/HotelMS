using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
namespace HotelMS.Models
{
    public class HotelService
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        
        public required string HeroImage { get; set; }
        
        public required string HeroTitle { get; set; }
        
        public required string HeroDescription { get; set; }
    }
}
