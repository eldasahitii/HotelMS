using HotelMS.Data;
using HotelMS.Data.DTO;
using HotelMS.Data.Interfaces;
using HotelMS.Models;
using HotelMS.Models.DTOs;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HotelMS.Services
{
    public class HotelServiceDetailService : IHotelServiceDetailService
    {
        private readonly DataContext _dbContext;

        public HotelServiceDetailService(DataContext dbContext)
        {
            _dbContext = dbContext;
        }

        // CREATE
        public async Task<HotelServiceDetailDTO> AddServiceDetailAsync(HotelServiceDetailDTO request)
        {
            var detail = new HotelServiceDetail
            {
                DetailImage = request.DetailImage,
                DetailTitle = request.DetailTitle,
                DetailDescription = request.DetailDescription,
                Price = request.Price
            };

            _dbContext.HotelServiceDetails.Add(detail);
            await _dbContext.SaveChangesAsync();

            return await GetServiceDetailAsync(detail.Id);
        }

        // READ ONE
        public async Task<HotelServiceDetailDTO> GetServiceDetailAsync(int id)
        {
            var detail = await _dbContext.HotelServiceDetails.FindAsync(id);
            if (detail == null) return null;

            return new HotelServiceDetailDTO
            {
                Id = detail.Id,
                DetailImage = detail.DetailImage,
                DetailTitle = detail.DetailTitle,
                DetailDescription = detail.DetailDescription,
                Price = detail.Price
            };
        }

        // READ ALL
        public async Task<IEnumerable<HotelServiceDetailDTO>> GetAllServiceDetailsAsync()
        {
            var details = await _dbContext.HotelServiceDetails.ToListAsync();

            return details.Select(detail => new HotelServiceDetailDTO
            {
                Id = detail.Id,
                DetailImage = detail.DetailImage,
                DetailTitle = detail.DetailTitle,
                DetailDescription = detail.DetailDescription,
                Price = detail.Price
            });
        }

        // UPDATE
        public async Task<HotelServiceDetailDTO> UpdateServiceDetailAsync(int id, HotelServiceDetailDTO request)
        {
            var detail = await _dbContext.HotelServiceDetails.FindAsync(id);
            if (detail == null) return null;

            detail.DetailImage = request.DetailImage;
            detail.DetailTitle = request.DetailTitle;
            detail.DetailDescription = request.DetailDescription;
            detail.Price = request.Price;

            await _dbContext.SaveChangesAsync();

            return await GetServiceDetailAsync(id);
        }

        // DELETE
        public async Task DeleteServiceDetailAsync(int id)
        {
            var detail = await _dbContext.HotelServiceDetails.FindAsync(id);
            if (detail != null)
            {
                _dbContext.HotelServiceDetails.Remove(detail);
                await _dbContext.SaveChangesAsync();
            }
        }

        // ✅ New Methods

        public async Task<string> GetServiceDetailImageAsync(int id)
        {
            var detail = await _dbContext.HotelServiceDetails.FindAsync(id);
            return detail?.DetailImage;
        }

        public async Task<string> GetServiceDetailTitleAsync(int id)
        {
            var detail = await _dbContext.HotelServiceDetails.FindAsync(id);
            return detail?.DetailTitle;
        }

        public async Task<string> GetServiceDetailDescriptionAsync(int id)
        {
            var detail = await _dbContext.HotelServiceDetails.FindAsync(id);
            return detail?.DetailDescription;
        }

        public async Task<string> GetServiceDetailPriceAsync(int id)
        {
            var detail = await _dbContext.HotelServiceDetails.FindAsync(id);
            return detail?.Price ?? string.Empty;
        }

        public async Task<IEnumerable<HotelServiceDetailDTO>> GetFeaturedServiceDetailsAsync()
        {
            var serviceIds = new List<int> { 1, 2, 3, 4 };
            var results = new List<HotelServiceDetailDTO>();

            foreach (var id in serviceIds)
            {
                var serviceDetail = await GetServiceDetailAsync(id);
                if (serviceDetail != null)
                    results.Add(serviceDetail);
            }
            return results;
        }



    }
}
