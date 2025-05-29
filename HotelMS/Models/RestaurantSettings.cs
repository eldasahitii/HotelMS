using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;


namespace HotelMS.Models
{
    public class RestaurantSettings
    {

        [Key]
        public int Id { get; set; }

        public string WelcomeTitle { get; set; }

        public string WelcomeMessage { get; set; }

        public string WelcomeImageUrl { get; set; }


        public string AboutTitle { get; set; }

        public string AboutMessage { get; set; }
        
        public string AboutImageUrl1 { get; set; }

        public string AboutImageUrl2 { get; set; }

    }
}
