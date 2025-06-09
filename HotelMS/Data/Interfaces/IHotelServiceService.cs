using HotelMS.Models;
using HotelMS.Data.DTO;


namespace HotelMS.Data.Interfaces
{
    public interface IHotelServiceService
    {
        // Hero Image methods
        Task<HotelService> AddHeroImageAsync(int serviceId, string imageUrl);
        Task<HotelService> UpdateHeroImageAsync(int serviceId, string imageUrl);
        Task<string> GetHeroImageAsync(int serviceId);

        // Hero Title methods
        Task<HotelService> AddHeroTitleAsync(int serviceId, string title);
        Task<HotelService> UpdateHeroTitleAsync(int serviceId, string title);
        Task<string> GetHeroTitleAsync(int serviceId);

        // Hero Description methods
        Task<HotelService> AddHeroDescriptionAsync(int serviceId, string description);
        Task<HotelService> UpdateHeroDescriptionAsync(int serviceId, string description);
        Task<string> GetHeroDescriptionAsync(int serviceId);
    }
}
