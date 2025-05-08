using HotelMS.Data;
using HotelMS.Data.DTO;
using HotelMS.Data.Interfaces;
using HotelMS.Models;
using Microsoft.EntityFrameworkCore;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace HotelMS.Services
{
    public class RoomService : IRoomService
    {
        private readonly DataContext _dbContext;

        public RoomService(DataContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task<Room> AddRoom(RoomDTO request)
        {
            try
            {
                Room room = new Room
                {
                    Name = request.Name,
                    Capacity = request.Capacity,
                    Size = request.Size,
                    Description = request.Description,
                    Price = request.Price,
                    ImageUrl = request.ImageUrl
                };

                _dbContext.Rooms.Add(room);
                await _dbContext.SaveChangesAsync();

                return room;
            } catch (Exception ex) { 
                Console.WriteLine(ex.Message);
                throw new Exception("An error occurred while attempting to save the product record."); 
            }
        }
        public async Task<Room> GetRoom(int id)
        {
            try
            {
                var result = _dbContext.Rooms.Find(id);
                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw new Exception("An error occured.");

            }
        }

        public async Task<IEnumerable<Room>> GetAll()
        {
            try
            {
                var result = await _dbContext.Rooms.ToListAsync();
                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw new Exception("An error occured");
            }
        }

        public async Task<Room> UpdateRoom(int id, RoomDTO request)
        {
            try
            {
                var room = _dbContext.Rooms.Find(id);

                if (room == null)
                {
                    return null;
                }

                if (room != null)
                {
                    room.Name = request.Name;
                    room.Capacity = request.Capacity;
                    room.Size = request.Size;
                    room.Description = request.Description;
                    room.Price = request.Price;
                    room.ImageUrl = request.ImageUrl;

                    _dbContext.SaveChanges();
                }
                return room;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw new Exception("An error occured while attmeting to save room");
            }

        }

        public async Task DeleteRoom(int id)
        {
            try
            {
                var result = _dbContext.Rooms.Find(id);
                if (result != null)
                {
                    _dbContext.Rooms.Remove(result);
                    _dbContext.SaveChanges();
                }
            }
            catch (Exception ex) {
                Console.WriteLine(ex.Message);
                throw new Exception("An error occured while attempting to delete room");


            }
        }
    }
}
