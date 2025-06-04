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

        // Card Image methods
        public async Task<HotelServiceCards> AddCardImageAsync(int cardId, string imageUrl)
        {
            var card = await _context.HotelServiceCards.FindAsync(cardId);
            if (card == null) return null;

            card.CardImage = imageUrl;
            await _context.SaveChangesAsync();
            return card;
        }

        public async Task<string> GetCardImageAsync(int cardId)
        {
            var card = await _context.HotelServiceCards.FindAsync(cardId);
            return card?.CardImage;
        }

        public async Task<HotelServiceCards> UpdateCardImageAsync(int cardId, string imageUrl)
        {
            var card = await _context.HotelServiceCards.FindAsync(cardId);
            if (card == null) return null;

            card.CardImage = imageUrl;
            await _context.SaveChangesAsync();
            return card;
        }

        public async Task<bool> DeleteCardImageAsync(int cardId)
        {
            var card = await _context.HotelServiceCards.FindAsync(cardId);
            if (card == null) return false;

            card.CardImage = null!;
            await _context.SaveChangesAsync();
            return true;
        }

        // Card Title methods
        public async Task<HotelServiceCards> AddCardTitleAsync(int cardId, string title)
        {
            var card = await _context.HotelServiceCards.FindAsync(cardId);
            if (card == null) return null;

            card.CardTitle = title;
            await _context.SaveChangesAsync();
            return card;
        }

        public async Task<string> GetCardTitleAsync(int cardId)
        {
            var card = await _context.HotelServiceCards.FindAsync(cardId);
            return card?.CardTitle;
        }

        public async Task<HotelServiceCards> UpdateCardTitleAsync(int cardId, string title)
        {
            var card = await _context.HotelServiceCards.FindAsync(cardId);
            if (card == null) return null;

            card.CardTitle = title;
            await _context.SaveChangesAsync();
            return card;
        }

        public async Task<bool> DeleteCardTitleAsync(int cardId)
        {
            var card = await _context.HotelServiceCards.FindAsync(cardId);
            if (card == null) return false;

            card.CardTitle = null!;
            await _context.SaveChangesAsync();
            return true;
        }

        // Card Description methods
        public async Task<HotelServiceCards> AddCardDescriptionAsync(int cardId, string description)
        {
            var card = await _context.HotelServiceCards.FindAsync(cardId);
            if (card == null) return null;

            card.CardDescription = description;
            await _context.SaveChangesAsync();
            return card;
        }

        public async Task<string> GetCardDescriptionAsync(int cardId)
        {
            var card = await _context.HotelServiceCards.FindAsync(cardId);
            return card?.CardDescription;
        }

        public async Task<HotelServiceCards> UpdateCardDescriptionAsync(int cardId, string description)
        {
            var card = await _context.HotelServiceCards.FindAsync(cardId);
            if (card == null) return null;

            card.CardDescription = description;
            await _context.SaveChangesAsync();
            return card;
        }

        public async Task<bool> DeleteCardDescriptionAsync(int cardId)
        {
            var card = await _context.HotelServiceCards.FindAsync(cardId);
            if (card == null) return false;

            card.CardDescription = null!;
            await _context.SaveChangesAsync();
            return true;
        }

        // Card Link methods
        public async Task<HotelServiceCards> AddCardLinkAsync(int cardId, string link)
        {
            var card = await _context.HotelServiceCards.FindAsync(cardId);
            if (card == null) return null;

            card.CardLink = link;
            await _context.SaveChangesAsync();
            return card;
        }

        public async Task<string> GetCardLinkAsync(int cardId)
        {
            var card = await _context.HotelServiceCards.FindAsync(cardId);
            return card?.CardLink;
        }

        public async Task<HotelServiceCards> UpdateCardLinkAsync(int cardId, string link)
        {
            var card = await _context.HotelServiceCards.FindAsync(cardId);
            if (card == null) return null;

            card.CardLink = link;
            await _context.SaveChangesAsync();
            return card;
        }

        public async Task<bool> DeleteCardLinkAsync(int cardId)
        {
            var card = await _context.HotelServiceCards.FindAsync(cardId);
            if (card == null) return false;

            card.CardLink = null!;
            await _context.SaveChangesAsync();
            return true;
        }

        // Get all cards
        public async Task<IEnumerable<HotelServiceCards>> GetAllCardsAsync()
        {
            return await _context.HotelServiceCards.ToListAsync();
        }
    }
}
