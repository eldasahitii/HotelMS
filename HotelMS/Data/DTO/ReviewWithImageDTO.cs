public class ReviewWithImageDTO
{
    public string Comment { get; set; } = string.Empty;
    public int Rating { get; set; }
    public int ReviewCategoryID { get; set; }
    public string? Base64Image { get; set; } 
}

