using HotelMS.Data.DTO;
using HotelMS.Models;

namespace HotelMS.Data.Interfaces
{
    public interface IMenuService
    {
        Task<MenuItem> AddMenuItem(MenuItemCreateDTO request);

        Task<MenuItem> GetMenuItem(int id);

        Task<IEnumerable<MenuItemDTO>> GetAllMenuItems();

        Task<MenuItem> UpdateMenuItem(int id, MenuItemCreateDTO request);

        Task DeleteMenuItem(int id);
    }
}
