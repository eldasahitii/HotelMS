using HotelMS.Data.DTO;
using HotelMS.Models;

namespace HotelMS.Data.Interfaces
{
    public interface IRoomImageService
    {
        Task<IEnumerable<RoomImage>> GetImagesByRoomTypeId(int roomId);
        Task<RoomImage> AddImage(RoomImageDTO dto);
        Task DeleteImage(int imageId);
        Task<RoomImage> GetImageById(int imageId);
    }
}
