using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;

namespace HotelMS.Models
{
    [Table("Services")] // Matches the DB table name
    public class HotelService
    {
        [Key]
        [Column("ServiceId")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; }

        public string Description { get; set; }

        [Required]
        [MaxLength(50)]
        public string Category { get; set; } // Renamed from Type to match SQL column

        [MaxLength(255)]
        public string ImageUrl { get; set; }

    }
}

