using HotelMS.Data;
using HotelMS.Data.DTO;
using HotelMS.Data.Interfaces;
using HotelMS.Models;
using Microsoft.EntityFrameworkCore;

namespace HotelMS.Services
{
    public class MenuService : IMenuService
    {
        private readonly DataContext _dbContext;

        public MenuService(DataContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<MenuItem> AddMenuItem(MenuItemCreateDTO request)
        {
            try
            {
                MenuItem item = new MenuItem
                {
                    Name = request.Name,
                    Description = request.Description,
                    Price = request.Price,
                    image_url = request.image_url,
                    is_available = request.is_available,
                    MenuCategoryID = request.MenuCategoryID
                };
                _dbContext.MenuItems.Add(item);
                await _dbContext.SaveChangesAsync();

                return item;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw new Exception("Error adding menu item");
            }

        }
        public async Task<MenuItem> GetMenuItem(int id)
        {
            try
            {
                var result = await _dbContext.MenuItems.FindAsync(id);
                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw new Exception("Error retrieving menu item.");
            }
        }

        public async Task<IEnumerable<MenuItemDTO>> GetAllMenuItems()
        {
            try
            {
                return await _dbContext.MenuItems
                    .Include(mi => mi.MenuCategory)
                    .Select(mi => new MenuItemDTO
                    {
                        MenuItemID = mi.MenuItemID,
                        Name = mi.Name,
                        Description = mi.Description,
                        Price = mi.Price, // Frontend can choose to ignore this
                        image_url = mi.image_url,
                        is_available = mi.is_available,
                        CategoryName = mi.MenuCategory.Name
                    })
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw new Exception("Error retrieving menu items.");
            }
        }


        //public async Task<IEnumerable<MenuItem>> GetAllMenuItems()
        //{
        //    try
        //    {
        //        return await _dbContext.MenuItems.ToListAsync();
        //    }
        //    catch(Exception ex)
        //    {
        //        Console.WriteLine(ex.Message);
        //        throw new Exception("Error retrieving menu items.");
        //    }
        //}

        public async Task<MenuItem> UpdateMenuItem(int id, MenuItemCreateDTO request)
        {
            try
            {
                var item = await _dbContext.MenuItems.FindAsync(id);

                if (item == null) return null;

                item.Name = request.Name;
                item.Description = request.Description;
                item.Price = request.Price;
                item.image_url = request.image_url;
                item.is_available = request.is_available;
                item.MenuCategoryID = request.MenuCategoryID;

                await _dbContext.SaveChangesAsync();
                return item;

            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw new Exception("Error updating menu item");
            }
        }

        public async Task DeleteMenuItem(int id)
        {
            try
            {
                var item = await _dbContext.MenuItems.FindAsync(id);
                if (item != null)
                {
                    _dbContext.MenuItems.Remove(item);
                    await _dbContext.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw new Exception("Error deleting menu item");
            }
        }
      
    }
}
