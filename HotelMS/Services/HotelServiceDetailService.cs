using HotelMS.Data;
using HotelMS.Data.DTO;
using HotelMS.Data.Interfaces;
using HotelMS.Models;
using Microsoft.EntityFrameworkCore;

namespace HotelMS.Services
{
    public class HotelServiceDetailService : IHotelServiceDetailService
    {
        private readonly DataContext _dbContext;

        public HotelServiceDetailService(DataContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<HotelServiceDetail> AddHotelServiceDetail(HotelServiceDetailDTO request)
        {
            try
            {
                var detail = new HotelServiceDetail
                {
                    ServiceId = request.ServiceId,
                    Title = request.Title,
                    Description = request.Description,
                    ImageUrl = request.ImageUrl,
                    Price = request.Price
                };

                _dbContext.HotelServiceDetails.Add(detail);
                await _dbContext.SaveChangesAsync();

                return detail;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw new Exception("An error occurred while attempting to save the service detail.");
            }
        }

        public async Task<HotelServiceDetail> GetHotelServiceDetail(int id)
        {
            try
            {
                var result = await _dbContext.HotelServiceDetails.FindAsync(id);
                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw new Exception("An error occurred while retrieving the service detail.");
            }
        }

        public async Task<IEnumerable<HotelServiceDetail>> GetAllHotelServiceDetails()
        {
            try
            {
                return await _dbContext.HotelServiceDetails.ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw new Exception("An error occurred while retrieving all service details.");
            }
        }

        public async Task<HotelServiceDetail> UpdateHotelServiceDetail(int id, HotelServiceDetailDTO request)
        {
            try
            {
                var detail = await _dbContext.HotelServiceDetails.FindAsync(id);
                if (detail == null)
                {
                    return null;
                }

                detail.ServiceId = request.ServiceId;
                detail.Title = request.Title;
                detail.Description = request.Description;
                detail.ImageUrl = request.ImageUrl;
                detail.Price = request.Price;

                _dbContext.HotelServiceDetails.Update(detail);
                await _dbContext.SaveChangesAsync();

                return detail;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw new Exception("An error occurred while updating the service detail.");
            }
        }

        public async Task DeleteHotelServiceDetail(int id)
        {
            try
            {
                var detail = await _dbContext.HotelServiceDetails.FindAsync(id);
                if (detail != null)
                {
                    _dbContext.HotelServiceDetails.Remove(detail);
                    await _dbContext.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw new Exception("An error occurred while deleting the service detail.");
            }
        }
    }
}
