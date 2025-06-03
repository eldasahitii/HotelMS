using HotelMS.Models;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using System.Collections.Generic;


namespace HotelMS.Models
{
    public class Review
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ReviewID { get; set; }

        [Required]
        public int UserID { get; set; }

        [ForeignKey("UserID")]
        public User? User { get; set; }

        [Required]
        public int ReviewCategoryID { get; set; } // New

        [ForeignKey("ReviewCategoryID")]
        public ReviewCategory? Category { get; set; } // Make this optional


        [Range(1, 5)]
        public int Rating { get; set; }

        [Required]
        public string Comment { get; set; }

        public DateTime Date { get; set; } = DateTime.Now;

        public string? ManagerReply { get; set; }
        public DateTime? ReplyDate { get; set; }

        public ICollection<ReviewImage>? Images { get; set; }










    }
}
