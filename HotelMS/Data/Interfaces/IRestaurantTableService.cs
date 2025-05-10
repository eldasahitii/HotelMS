using HotelMS.Data.DTO;
using HotelMS.Models;

namespace HotelMS.Data.Interfaces
{
    public interface IRestaurantTableService
    {
        Task<IEnumerable<RestaurantTable>> GetAllTables();

        Task<RestaurantTable> GetTable(int id);

        Task<RestaurantTable> AddTable(RestaurantTable table);

        Task<RestaurantTable> UpdateTable(int id, RestaurantTable request);

        Task DeleteTable(int id);
    }
}
