using HotelMS.Data.DTO;
using HotelMS.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HotelMS.Data.Interfaces
{
    public interface IRoomService
    {
        Task<RoomDTO> AddRoom(RoomDTO request);
        Task<RoomDTO> GetRoom(int id);
        Task<IEnumerable<RoomDTO>> GetAllRooms();
        Task DeleteRoom(int id);
        Task<RoomDTO> UpdateRoom(int id, RoomDTO request);
        Task<RoomDetailsDTO> GetRoomDetails(int id);
        Task BulkCreateRoomsAsync(BulkRoomCreateDTO dto);
        //Task<List<Room>> GetRoomAvailability(DateTime checkIn, DateTime checkOut);
    }
}
