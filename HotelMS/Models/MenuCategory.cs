using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;


namespace HotelMS.Models
{

    public class MenuCategory
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]

        public int MenuCategoryID { get; set; }
        [Required]

        public string Name { get; set; }

        public ICollection<MenuItem> MenuItems { get; set; }


    }
}
