using HotelMS.Data;
using HotelMS.Data.Interfaces;
using HotelMS.Models;

namespace HotelMS.Services
{
    public class RoomService:IRoomService
    {
        private readonly DataContext _dbContext;

        public RoomService(DataContext dbContext) { 
            _dbContext = dbContext;
        }

        public async Task<Room> GetRoom(int id)
        {
            try
            {
                var result = _dbContext.Rooms.Find(id);
                return result;
            }

        }
    }
}
