using HotelMS.Models;

namespace HotelMS.Data.Interfaces
{
    public interface IHotelServiceCards
    {
        // Card Image methods
        Task<HotelServiceCards> AddCardImageAsync(int cardId, string imageUrl);
        Task<string> GetCardImageAsync(int cardId);
        Task<HotelServiceCards> UpdateCardImageAsync(int cardId, string imageUrl);
        Task<bool> DeleteCardImageAsync(int cardId);

        // Card Title methods
        Task<HotelServiceCards> AddCardTitleAsync(int cardId, string title);
        Task<string> GetCardTitleAsync(int cardId);
        Task<HotelServiceCards> UpdateCardTitleAsync(int cardId, string title);
        Task<bool> DeleteCardTitleAsync(int cardId);

        // Card Description methods
        Task<HotelServiceCards> AddCardDescriptionAsync(int cardId, string description);
        Task<string> GetCardDescriptionAsync(int cardId);
        Task<HotelServiceCards> UpdateCardDescriptionAsync(int cardId, string description);
        Task<bool> DeleteCardDescriptionAsync(int cardId);

        // Card Link methods
        Task<HotelServiceCards> AddCardLinkAsync(int cardId, string link);
        Task<string> GetCardLinkAsync(int cardId);
        Task<HotelServiceCards> UpdateCardLinkAsync(int cardId, string link);
        Task<bool> DeleteCardLinkAsync(int cardId);

        // Get all cards
        Task<IEnumerable<HotelServiceCards>> GetAllCardsAsync();

    }
}
