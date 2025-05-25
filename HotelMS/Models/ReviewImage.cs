using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotelMS.Models
{
    public class ReviewImage
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ReviewImageID { get; set; }

        [Required]
        public int ReviewID { get; set; }

        [ForeignKey("ReviewID")]
        public Review Review { get; set; }

        [Required]
        public string ImageUrl { get; set; }  // Store file path or filename
    }
}
