
using HotelMS.Data;
using HotelMS.Data.Interfaces;
using HotelMS.Models;
using Microsoft.EntityFrameworkCore;

namespace HotelMS.Services
{
    public class HotelServiceCardsService : IHotelServiceCards
    {
        private readonly DataContext _context;

        public HotelServiceCardsService(DataContext context)
        {
            _context = context;
        }

        public async Task<string> GetCardImageAsync(int cardId)
        {
            var card = await _context.HotelServiceCards.FindAsync(cardId);
            return card?.CardImage;
        }

        public async Task<string> GetCardTitleAsync(int cardId)
        {
            var card = await _context.HotelServiceCards.FindAsync(cardId);
            return card?.CardTitle;
        }

        public async Task<string> GetCardDescriptionAsync(int cardId)
        {
            var card = await _context.HotelServiceCards.FindAsync(cardId);
            return card?.CardDescription;
        }

        public async Task<string> GetCardLinkAsync(int cardId)
        {
            var card = await _context.HotelServiceCards.FindAsync(cardId);
            return card?.CardLink;
        }

        public async Task<IEnumerable<HotelServiceCards>> GetAllCardsAsync()
        {
            return await _context.HotelServiceCards.ToListAsync();
        }

        //public async Task<HotelServiceCards> AddCardDataAsync(int cardId, string? imageUrl = null, string? title = null, string? description = null, string? link = null)
        //{
        //    var card = await _context.HotelServiceCards.FindAsync(cardId);
        //    if (card == null) return null;

        //    if (!string.IsNullOrEmpty(imageUrl)) card.CardImage = imageUrl;
        //    if (!string.IsNullOrEmpty(title)) card.CardTitle = title;
        //    if (!string.IsNullOrEmpty(description)) card.CardDescription = description;
        //    if (!string.IsNullOrEmpty(link)) card.CardLink = link;

        //    await _context.SaveChangesAsync();
        //    return card;
        //}
        public async Task<HotelServiceCards> CreateNewCardAsync(string? imageUrl, string? title, string? description, string? link)
        {
            var newCard = new HotelServiceCards
            {
                CardImage = imageUrl,
                CardTitle = title,
                CardDescription = description,
                CardLink = link
            };

            _context.HotelServiceCards.Add(newCard); // assumes you injected your DbContext
            await _context.SaveChangesAsync();

            return newCard;
        }

        public async Task<HotelServiceCards> UpdateCardDataAsync(int cardId, string? imageUrl = null, string? title = null, string? description = null, string? link = null)
        {
            var card = await _context.HotelServiceCards.FindAsync(cardId);
            if (card == null) return null;

            if (imageUrl != null) card.CardImage = imageUrl;
            if (title != null) card.CardTitle = title;
            if (description != null) card.CardDescription = description;
            if (link != null) card.CardLink = link;

            await _context.SaveChangesAsync();
            return card;
        }

        //public async Task<bool> DeleteCardDataAsync(int cardId, bool deleteImage = false, bool deleteTitle = false, bool deleteDescription = false, bool deleteLink = false)
        //{
        //    var card = await _context.HotelServiceCards.FindAsync(cardId);
        //    if (card == null) return false;

        //    if (deleteImage) card.CardImage = null!;
        //    if (deleteTitle) card.CardTitle = null!;
        //    if (deleteDescription) card.CardDescription = null!;
        //    if (deleteLink) card.CardLink = null!;

        //    await _context.SaveChangesAsync();
        //    return true;
        //}
        public async Task<bool> DeleteCardAsync(int cardId)
        {
            var card = await _context.HotelServiceCards.FindAsync(cardId);
            if (card == null) return false;

            _context.HotelServiceCards.Remove(card);
            await _context.SaveChangesAsync();
            return true;
        }

    }
}
