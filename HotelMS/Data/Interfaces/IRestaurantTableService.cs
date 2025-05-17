using HotelMS.Data.DTO;
using HotelMS.Models;

namespace HotelMS.Data.Interfaces
{
    public interface IRestaurantTableService
    {
        Task<IEnumerable<RestaurantTableDTO>> GetAllTables();

        Task<RestaurantTable> GetTable(int id);

        Task<RestaurantTableDTO> AddTable(RestaurantTableDTO dto);

        Task<RestaurantTableDTO> UpdateTable(int id, RestaurantTableDTO dto);

        Task DeleteTable(int id);
    }
}
