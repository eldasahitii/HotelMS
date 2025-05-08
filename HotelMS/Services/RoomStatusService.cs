using HotelMS.Data.DTO;
using HotelMS.Data;
using HotelMS.Models;
using HotelMS.Data.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace HotelMS.Services
{
    public class RoomStatusService:IRoomStatusService
    {
        private readonly DataContext _dbContext;

        public RoomStatusService(DataContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task<RoomStatus> AddRoomStatus(RoomStatusDTO request)
        {
            try
            {
                RoomStatus roomStatus = new RoomStatus
                {
                    RoomStatusName = request.RoomStatusName
                };

                _dbContext.RoomStatuses.Add(roomStatus);
                await _dbContext.SaveChangesAsync();

                return roomStatus;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw new Exception("An error occurred while attempting to save the room status record.");
            }
        }
        public async Task<RoomStatus> GetRoomStatus(int id)
        {
            try
            {
                var result = _dbContext.RoomStatuses.Find(id);
                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw new Exception("Ann error occured.");

            }
        }

        public async Task<IEnumerable<RoomStatus>> GetAllRoomStatus()
        {
            try
            {
                var result = await _dbContext.RoomStatuses.ToListAsync();
                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw new Exception("An error occured");
            }
        }

        public async Task<RoomStatus> UpdateRoomStatus(int id, RoomStatusDTO request)
        {
            try
            {
                var roomStatus = _dbContext.RoomStatuses.Find(id);

                if (roomStatus == null)
                {
                    return null;
                }

                if (roomStatus != null)
                {
                    roomStatus.RoomStatusName = request.RoomStatusName;

                    _dbContext.SaveChanges();
                }
                return roomStatus;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw new Exception("An error occured while attmeting to save room");
            }

        }

        public async Task DeleteRoomStatus(int id)
        {
            try
            {
                var result = _dbContext.RoomStatuses.Find(id);
                if (result != null)
                {
                    _dbContext.RoomStatuses.Remove(result);
                    _dbContext.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw new Exception("An error occured while attempting to delete room status");


            }
        }
    }
}

