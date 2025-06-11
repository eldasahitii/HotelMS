using System.ComponentModel.DataAnnotations;

namespace HotelMS.Models
{
    public class ReviewCategory
    {
        [Key]
        public int ReviewCategoryID { get; set; }

        [Required]
        public string CategoryName { get; set; }  

        public ICollection<Review> Reviews { get; set; }
    }
}
