using HotelMS.Data.DTO;
using HotelMS.Models;

namespace HotelMS.Data.Interfaces
{
    public interface IRoomService
    {
        Task<Room> AddRoom(RoomDTO request);
        Task<Room> GetRoom(int id);
        Task<IEnumerable<Room>> GetAllRooms();
        Task DeleteRoom(int id);
        Task<Room> UpdateRoom(int id, RoomDTO request);

    }
}
