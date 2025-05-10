using HotelMS.Data;
using HotelMS.Data.DTO;
using HotelMS.Data.Interfaces;
using HotelMS.Models;
using Microsoft.EntityFrameworkCore;

namespace HotelMS.Services
{
    public class RestaurantTableService : IRestaurantTableService
    {
        private readonly DataContext _dbContext;

        public RestaurantTableService(DataContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<IEnumerable<RestaurantTable>> GetAllTables()
        {
            try
            {
                return await _dbContext.RestaurantTables.ToListAsync();
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw new Exception("Error retrieving tables.");
            }
        }
        public async Task<RestaurantTable> GetTable(int id)
        {
            try
            {
                return await _dbContext.RestaurantTables.FindAsync(id);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw new Exception("Error retrieving table.");
            }
        }
        public async Task<RestaurantTable> AddTable(RestaurantTable table)
        {
            try
            {
                _dbContext.RestaurantTables.Add(table);
                await _dbContext.SaveChangesAsync();
                return table;
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw new Exception("Error adding table.");
            }
        }

        public async Task<RestaurantTable> UpdateTable(int id, RestaurantTable request)
        {
            try
            {
                var table = await _dbContext.RestaurantTables.FindAsync(id);
                if (table == null) return null;

                table.TableNumber = request.TableNumber;
                table.Status = request.Status;

                await _dbContext.SaveChangesAsync();
                return table;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw new Exception("Error updating table");
            }

        }
        public async Task DeleteTable(int id)
        {
            try
            {
                var table = await _dbContext.RestaurantTables.FindAsync(id);
                if (table != null)
                {
                    _dbContext.RestaurantTables.Remove(table);
                    await _dbContext.SaveChangesAsync();
                }
                
            
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw new Exception("Error deleting table.");
            }
        }

    }
}
