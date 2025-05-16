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
                    RoomStatusID = request.RoomStatusID,
                    RoomTypeID = request.RoomTypeID
                };

                _dbContext.Rooms.Add(room);
                await _dbContext.SaveChangesAsync();

                // Add Room Images if any
                if (request.Images != null && request.Images.Any())
                {
                    foreach (var imageUrl in request.Images)
                    {
                        var roomImage = new RoomImage
                        {
                            ImageUrl = imageUrl,
                            RoomID = room.RoomID
                        };
                        _dbContext.RoomImages.Add(roomImage);
                    }
                    await _dbContext.SaveChangesAsync();
                }

                return room;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An error occurred: {ex.Message}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"Inner Exception: {ex.InnerException.Message}");
                }
                throw new Exception("An error occurred while attempting to save the room.");
            }
        }

        public async Task<Room> GetRoom(int id)
        {
            try
            {
                var room = await _dbContext.Rooms
                    .Include(r => r.RoomType)
                    .Include(r => r.RoomStatus)
                    .Include(r => r.RoomImages)
                    .FirstOrDefaultAsync(r => r.RoomID == id);

                return room;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw new Exception("An error occurred.");
            }
        }

        public async Task<IEnumerable<Room>> GetAllRooms()
        {
            try
            {
                var rooms = await _dbContext.Rooms
                    .Include(r => r.RoomType)
                    .Include(r => r.RoomStatus)
                    .Include(r => r.RoomImages)
                    .ToListAsync();

                return rooms;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw new Exception("An error occurred");
            }
        }

        public async Task<Room> UpdateRoom(int id, RoomDTO request)
        {
            var room = await _dbContext.Rooms.FindAsync(id);
            if (room == null) return null;

            room.Name = request.Name;
            room.Capacity = request.Capacity;
            room.Size = request.Size;
            room.Description = request.Description;
            room.Price = request.Price;
            room.RoomTypeID = request.RoomTypeID;
            room.RoomStatusID = request.RoomStatusID;

            await _dbContext.SaveChangesAsync();

            return room;
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
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw new Exception("An error occurred while attempting to delete room");
            }
        }
    }
}
