using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace HotelMS.Models
{
    public class CleaningStaff
    {

        [Key]
        public int CleaningStaffId { get; set; }

        [ForeignKey("User")]
        public int UserID { get; set; }

        public User User { get; set; }  

        public ICollection<CleaningStatus> CleaningStatuses { get; set; }

    }
}
