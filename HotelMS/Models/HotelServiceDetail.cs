//using System.ComponentModel.DataAnnotations;
//using System.ComponentModel.DataAnnotations.Schema;
//using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
//using Newtonsoft.Json;


//namespace HotelMS.Models
//{
//    public class HotelServiceSchedule
//    {
//        [Key]
//        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
//        public int Id { get; set; }

//        [Required]
//        public int HotelServiceId { get; set; }

//        [ForeignKey("HotelServiceId")]
//        [JsonIgnore]
//        [ValidateNever]
//        public HotelService Service { get; set; }

//        public DateTime StartTime { get; set; }
//        public DateTime EndTime { get; set; }
//        public bool IsAvailable { get; set; }

//    }
//}

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

        [Required]
        public int HotelServiceId { get; set; }

        [ForeignKey("HotelServiceId")]
        [JsonIgnore] // for Newtonsoft.Json
        [ValidateNever] // for ASP.NET Core model validation
        public HotelService Service { get; set; }

        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public bool IsAvailable { get; set; }
    }
}
