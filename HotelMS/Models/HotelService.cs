using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotelMS.Models
{
    //[Table("Services") This maps the model to the SQL table named "Services"
    public class HotelService
    {
        [Key]
        [Column("ServiceId")] // This maps to the "ServiceId" column in the table
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; }

        public string Description { get; set; }

        [MaxLength(255)]
        public string HeroImageUrl { get; set; } // Optional hero image
        public ICollection<HotelServiceDetail> HotelServiceDetails { get; set; }

    }
}


