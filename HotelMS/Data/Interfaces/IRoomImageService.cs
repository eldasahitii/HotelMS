using HotelMS.Data.DTO;
using HotelMS.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HotelMS.Data.Interfaces
{
    public interface IRoomImageService
    {
        Task<IEnumerable<RoomImage>> GetImagesByRoomTypeId(int roomId);
        Task<IEnumerable<RoomImage>> GetImagesByRoomTypeIdAndPreviewFlag(int roomTypeId, bool isPreview); 

        Task<RoomImage> AddImage(RoomImageDTO dto);
        Task DeleteImage(int imageId);
        Task<RoomImage> GetImageById(int imageId);
    }
}
