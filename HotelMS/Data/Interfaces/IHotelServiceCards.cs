using HotelMS.Models;

namespace HotelMS.Data.Interfaces
{
    public interface IHotelServiceCards
    {

        Task<string> GetCardImageAsync(int cardId);
        Task<string> GetCardTitleAsync(int cardId);
        Task<string> GetCardDescriptionAsync(int cardId);
        Task<string> GetCardLinkAsync(int cardId);
        Task<IEnumerable<HotelServiceCards>> GetAllCardsAsync();

        
        Task<HotelServiceCards> CreateNewCardAsync(string? imageUrl, string? title, string? description, string? link);

        
        Task<HotelServiceCards> UpdateCardDataAsync(int cardId, string? imageUrl = null, string? title = null, string? description = null, string? link = null);

       
        Task<bool> DeleteCardAsync(int cardId);

    }
}
