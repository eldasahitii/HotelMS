using HotelMS.Data.DTO;
using HotelMS.Models;

namespace HotelMS.Data.Interfaces
{
    public interface IRoomTypeService
    {
        Task<RoomType> AddRoomType(RoomTypeDTO request);
        Task<RoomType> GetRoomType(int id);
        Task<IEnumerable<RoomType>> GetAllRoomTypes();
        Task DeleteRoomType(int id);
        Task <RoomType>UpdateRoomType(int id,RoomTypeDTO request);

    }
}
