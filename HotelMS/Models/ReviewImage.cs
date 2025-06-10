using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotelMS.Models
{
    public class ReviewImage
    {
        [Key]
        public int ReviewImageID { get; set; }

        [Required]
        public int ReviewID { get; set; }

        [ForeignKey("ReviewID")]
        public Review? Review { get; set; }

        [Required]
        public string ImageUrl { get; set; } = string.Empty;
    }
}

