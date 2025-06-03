using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
namespace HotelMS.Models
{
    public class HotelService
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required]
        public string Type { get; set; }
        [Required]
        public string Name { get; set; }
        public string Description { get; set; }
        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Price must be a positive number.")]
        public decimal Price { get; set; }
        public bool IsActive { get; set; } = true;

        public ICollection<HotelServiceDetail> HotelServiceDetails { get; set; }
        public ICollection<HotelServiceReservation> HotelServiceReservations { get; set; }

    }
}
