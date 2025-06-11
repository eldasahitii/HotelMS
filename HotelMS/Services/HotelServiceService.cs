using HotelMS.Data;
using HotelMS.Data.DTO;
using HotelMS.Data.Interfaces;
using HotelMS.Models;
using Microsoft.EntityFrameworkCore;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace HotelMS.Services
{
    public class HotelServiceService : IHotelServiceService
    {
        private readonly DataContext _context;

            public HotelServiceService(DataContext context)
        {
            _context = context;

        }

        
        public async Task<HotelService> AddHeroImageAsync(int serviceId, string imageUrl)
        {
            var service = await _context.HotelServices.FindAsync(serviceId);
            if (service == null) return null;

            service.HeroImage = imageUrl;
            await _context.SaveChangesAsync();
            return service;
        }

        public async Task<HotelService> UpdateHeroImageAsync(int serviceId, string imageUrl)
        {
            var service = await _context.HotelServices.FindAsync(serviceId);
            if (service == null) return null;

            service.HeroImage = imageUrl;
            await _context.SaveChangesAsync();
            return service;
        }

        public async Task<string> GetHeroImageAsync(int serviceId)
        {
            var service = await _context.HotelServices.FindAsync(serviceId);
            return service?.HeroImage;
        }

        
        public async Task<HotelService> AddHeroTitleAsync(int serviceId, string title)
        {
            var service = await _context.HotelServices.FindAsync(serviceId);
            if (service == null) return null;

            service.HeroTitle = title;
            await _context.SaveChangesAsync();
            return service;
        }

        public async Task<HotelService> UpdateHeroTitleAsync(int serviceId, string title)
        {
            var service = await _context.HotelServices.FindAsync(serviceId);
            if (service == null) return null;

            service.HeroTitle = title;
            await _context.SaveChangesAsync();
            return service;
        }

        public async Task<string> GetHeroTitleAsync(int serviceId)
        {
            var service = await _context.HotelServices.FindAsync(serviceId);
            return service?.HeroTitle;
        }

       
        public async Task<HotelService> AddHeroDescriptionAsync(int serviceId, string description)
        {
            var service = await _context.HotelServices.FindAsync(serviceId);
            if (service == null) return null;

            service.HeroDescription = description;
            await _context.SaveChangesAsync();
            return service;
        }

        public async Task<HotelService> UpdateHeroDescriptionAsync(int serviceId, string description)
        {
            var service = await _context.HotelServices.FindAsync(serviceId);
            if (service == null) return null;

            service.HeroDescription = description;
            await _context.SaveChangesAsync();
            return service;
        }

        public async Task<string> GetHeroDescriptionAsync(int serviceId)
        {
            var service = await _context.HotelServices.FindAsync(serviceId);
            return service?.HeroDescription;
        }

    }
}
