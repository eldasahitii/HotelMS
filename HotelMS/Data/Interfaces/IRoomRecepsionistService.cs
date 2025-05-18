using HotelMS.Data.DTO;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HotelMS.Data.Interfaces
{
    public interface IRoomRecepsionistService
    {
        Task<RoomRecepsionistDTO> AddRecepsionist(int userId, RoomRecepsionistDTO dto);
        Task<RoomRecepsionistDTO> GetRecepsionistById(int id);
        Task<IEnumerable<RoomRecepsionistDTO>> GetAllRecepsionists();
        Task<RoomRecepsionistDTO> UpdateRecepsionist(int id, RoomRecepsionistDTO dto);
        Task DeleteRecepsionist(int id);
    }
}
