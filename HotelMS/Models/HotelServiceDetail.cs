using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotelMS.Models
{
    //[Table("ServiceDetails")]
    public class HotelServiceDetail
    {
        [Key]
        [Column("DetailId")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [ForeignKey("HotelService")]
        public int ServiceId { get; set; }

        public HotelService HotelService { get; set; }

        [Required]
        [MaxLength(100)]
        public string Title { get; set; }

        [Required]
        public string Description { get; set; }

        [MaxLength(255)]
        public string ImageUrl { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal? Price { get; set; }
    }
}