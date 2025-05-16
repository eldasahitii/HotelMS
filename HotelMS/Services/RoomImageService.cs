using HotelMS.Data;
using HotelMS.Data.Interfaces;
using HotelMS.Models;
using Microsoft.EntityFrameworkCore;

namespace HotelMS.Services
{
    public class RoomImageService : IRoomImageService
    {
        private readonly DataContext _context;

        public RoomImageService(DataContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<RoomImage>> GetImagesByRoomId(int roomId)
        {
            return await _context.RoomImages
                .Where(img => img.RoomID == roomId)
                .ToListAsync();
        }

        public async Task<RoomImage> AddImage(RoomImage image)
        {
            _context.RoomImages.Add(image);
            await _context.SaveChangesAsync();
            return image;
        }

        public async Task DeleteImage(int imageId)
        {
            var image = await _context.RoomImages.FindAsync(imageId);
            if (image != null)
            {
                _context.RoomImages.Remove(image);
                await _context.SaveChangesAsync();
            }
        }
    }
}
