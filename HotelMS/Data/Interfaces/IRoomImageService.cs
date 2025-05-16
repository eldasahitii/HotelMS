using HotelMS.Models;

namespace HotelMS.Data.Interfaces
{
    public interface IRoomImageService
    {
        Task<IEnumerable<RoomImage>> GetImagesByRoomId(int roomId);
        Task<RoomImage> AddImage(RoomImage image);
        Task DeleteImage(int imageId);
    }
}
