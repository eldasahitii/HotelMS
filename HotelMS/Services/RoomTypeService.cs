using HotelMS.Data;
using HotelMS.Data.DTO;
using HotelMS.Data.Interfaces;
using HotelMS.Models;
using Microsoft.EntityFrameworkCore;

namespace HotelMS.Services
{
    public class RoomTypeService:IRoomTypeService
    {
        private readonly DataContext _dbContext;

        public RoomTypeService(DataContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<RoomType> AddRoomType(RoomTypeDTO request)
        {
            try
            {
                RoomType roomType = new RoomType
                {
                    Name = request.Name
                };
                _dbContext.RoomTypes.Add(roomType);
                await _dbContext.SaveChangesAsync();

                return roomType;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw new Exception("An error occurred while attempting to save the product record.");
            }
        }
        public async Task <RoomType> GetRoomType(int id)
        {
            try
            {
                var result = _dbContext.RoomTypes.Find(id);
                return result;
            }
            catch (Exception ex) { 
                Console.WriteLine(ex.Message);
                throw new Exception("An error occured");
            }
        }
        public async Task<IEnumerable<RoomType>> GetAllRoomTypes()
        {
            try
            {
                var result = await _dbContext.RoomTypes.ToListAsync();
                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw new Exception("An error occured");
            }
        }

        public async Task<RoomType> UpdateRoomType(int id, RoomTypeDTO request)
        {
            try
            {
                var roomType = _dbContext.RoomTypes.Find(id);
                if (roomType == null)
                {
                    return null;
                }
                if (roomType != null)
                {
                    roomType.Name = request.Name;

                    _dbContext.SaveChanges();
                }
                return roomType;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw new Exception("An error occured while attmeting to save room type");

            }
        }

        public async Task DeleteRoomType(int id)
        {
            try
            {
                var result = _dbContext.RoomTypes.Find(id);
                if (result != null)
                {
                    _dbContext.RoomTypes.Remove(result);
                    _dbContext.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw new Exception("An error occured while attempting to delete room");
            }
        }
    }
}
