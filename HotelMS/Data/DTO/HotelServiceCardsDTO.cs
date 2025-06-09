using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace HotelMS.Data.DTO
{
    public class HotelServiceCardsDTO
    {
       
        public required string CardImage { get; set; }
       
        public required string CardTitle { get; set; }
        
        public required string CardDescription { get; set; }
        public required string CardLink { get; set; }
    }
}
