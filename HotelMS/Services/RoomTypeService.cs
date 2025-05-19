using HotelMS.Data;
using HotelMS.Data.DTO;
using HotelMS.Data.Interfaces;
using HotelMS.Models;
using Microsoft.EntityFrameworkCore;

namespace HotelMS.Services
{
    public class RoomTypeService : IRoomTypeService
    {
        private readonly DataContext _dbContext;

        public RoomTypeService(DataContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<RoomTypeDTO> AddRoomType(RoomTypeDTO request)
        {
            try
            {
                var roomType = new RoomType
                {
                    Name = request.Name,
                    Capacity = request.Capacity,
                    Size = request.Size,
                    Description = request.Description,
                    Price = request.Price
                };

                _dbContext.RoomTypes.Add(roomType);
                await _dbContext.SaveChangesAsync();



                return await GetRoomType(roomType.RoomTypeID);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw new Exception("An error occurred while attempting to save the room type.");
            }
        }

        public async Task<RoomTypeDTO> GetRoomType(int id)
        {
            try
            {
                var roomType = await _dbContext.RoomTypes
                    .Include(rt => rt.RoomImages) 
                    .FirstOrDefaultAsync(rt => rt.RoomTypeID == id);

                if (roomType == null) return null;

                return new RoomTypeDTO
                {
                    Name = roomType.Name,
                    Capacity = roomType.Capacity,
                    Size = roomType.Size,
                    Description = roomType.Description,
                    Price = roomType.Price,
                    Images = roomType.RoomImages?.Select(img => img.ImageUrl).ToList() ?? new List<string>()
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw new Exception("An error occurred while fetching the room type.");
            }
        }

        public async Task<IEnumerable<RoomTypeDTO>> GetAllRoomTypes()
        {
            try
            {
                var roomTypes = await _dbContext.RoomTypes
                    .Include(rt => rt.RoomImages) 
                    .ToListAsync();

                return roomTypes.Select(roomType => new RoomTypeDTO
                {
                    Name = roomType.Name,
                    Capacity = roomType.Capacity,
                    Size = roomType.Size,
                    Description = roomType.Description,
                    Price = roomType.Price,
                    Images = roomType.RoomImages?.Select(img => img.ImageUrl).ToList() ?? new List<string>()
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw new Exception("An error occurred while fetching room types.");
            }
        }

        public async Task<RoomTypeDTO> UpdateRoomType(int id, RoomTypeDTO request)
        {
            try
            {
                var roomType = await _dbContext.RoomTypes.FindAsync(id);
                if (roomType == null)
                {
                    return null;
                }

                roomType.Name = request.Name;
                roomType.Capacity = request.Capacity;
                roomType.Size = request.Size;
                roomType.Description = request.Description;
                roomType.Price = request.Price;

                await _dbContext.SaveChangesAsync();

                return await GetRoomType(id);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw new Exception("An error occurred while attempting to update the room type.");
            }
        }

        public async Task DeleteRoomType(int id)
        {
            try
            {
                var roomType = await _dbContext.RoomTypes.FindAsync(id);
                if (roomType == null)
                {
                    throw new KeyNotFoundException("Room type not found.");
                }

                _dbContext.RoomTypes.Remove(roomType);
                await _dbContext.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw new Exception("An error occurred while attempting to delete the room type.");
            }
        }


    }
}
