//using HotelMS.Models;

//namespace HotelMS.Data.Interfaces
//{
//    public interface IHotelServiceCards
//    {
//        // Card Image methods
//        Task<HotelServiceCards> AddCardImageAsync(int cardId, string imageUrl);
//        Task<string> GetCardImageAsync(int cardId);
//        Task<HotelServiceCards> UpdateCardImageAsync(int cardId, string imageUrl);
//        Task<bool> DeleteCardImageAsync(int cardId);

//        // Card Title methods
//        Task<HotelServiceCards> AddCardTitleAsync(int cardId, string title);
//        Task<string> GetCardTitleAsync(int cardId);
//        Task<HotelServiceCards> UpdateCardTitleAsync(int cardId, string title);
//        Task<bool> DeleteCardTitleAsync(int cardId);

//        // Card Description methods
//        Task<HotelServiceCards> AddCardDescriptionAsync(int cardId, string description);
//        Task<string> GetCardDescriptionAsync(int cardId);
//        Task<HotelServiceCards> UpdateCardDescriptionAsync(int cardId, string description);
//        Task<bool> DeleteCardDescriptionAsync(int cardId);

//        // Card Link methods
//        Task<HotelServiceCards> AddCardLinkAsync(int cardId, string link);
//        Task<string> GetCardLinkAsync(int cardId);
//        Task<HotelServiceCards> UpdateCardLinkAsync(int cardId, string link);
//        Task<bool> DeleteCardLinkAsync(int cardId);

//        // Get all cards
//        Task<IEnumerable<HotelServiceCards>> GetAllCardsAsync();

//    }
//}
using HotelMS.Models;

namespace HotelMS.Data.Interfaces
{
    public interface IHotelServiceCards
    {
        // Get methods (unchanged)
        Task<string> GetCardImageAsync(int cardId);
        Task<string> GetCardTitleAsync(int cardId);
        Task<string> GetCardDescriptionAsync(int cardId);
        Task<string> GetCardLinkAsync(int cardId);
        Task<IEnumerable<HotelServiceCards>> GetAllCardsAsync();

        // Unified Add method
        //Task<HotelServiceCards> AddCardDataAsync(int cardId, string? imageUrl = null, string? title = null, string? description = null, string? link = null);
        Task<HotelServiceCards> CreateNewCardAsync(string? imageUrl, string? title, string? description, string? link);

        // Unified Update method
        Task<HotelServiceCards> UpdateCardDataAsync(int cardId, string? imageUrl = null, string? title = null, string? description = null, string? link = null);

        // Unified Delete method
        //Task<bool> DeleteCardDataAsync(int cardId, bool deleteImage = false, bool deleteTitle = false, bool deleteDescription = false, bool deleteLink = false);
        Task<bool> DeleteCardAsync(int cardId);

    }
}
