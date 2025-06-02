using HotelMS.Models;

internal class Service : HotelServiceDetail
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public decimal Price { get; set; }
    public string PriceDescription { get; set; }
}