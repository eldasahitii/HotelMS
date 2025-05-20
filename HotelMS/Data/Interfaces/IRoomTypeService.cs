using HotelMS.Data.DTO;
using HotelMS.Models;

namespace HotelMS.Data.Interfaces
{
    public interface IRoomTypeService
    {
        Task<RoomTypeDTO> AddRoomType(RoomTypeDTO request);
        Task<RoomTypeDTO> GetRoomType(int id);
        Task<IEnumerable<RoomTypeDTO>> GetAllRoomTypes();
        Task<RoomTypeDTO> UpdateRoomType(int id, RoomTypeDTO request);
        Task DeleteRoomType(int id);

    }
}
