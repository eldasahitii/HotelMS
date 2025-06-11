
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using Newtonsoft.Json;

namespace HotelMS.Models
{
    public class HotelServiceDetail
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        
        public required string DetailImage { get; set; }
        
        public required string DetailTitle { get; set; }
        
        public required string DetailDescription { get; set; }

        public required string Price { get; set; } = "€25 per person";
    }
}
