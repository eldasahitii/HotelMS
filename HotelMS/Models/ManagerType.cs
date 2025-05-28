using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace HotelMS.Models
{
    public class ManagerType
    {
        [Key]
        public int ManagerTypeID { get; set; }

        [Required]
        [MaxLength(50)]
        public string Name { get; set; }
        public ICollection<Manager> Managers { get; set; } = new List<Manager>();
    }
}
