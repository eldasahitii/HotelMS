using HotelMS.Data.DTO;
using HotelMS.Data.Interfaces;
using HotelMS.Data;
using HotelMS.Models;
using Microsoft.EntityFrameworkCore;

public class RoomService : IRoomService
{
    private readonly DataContext _dbContext;

    public RoomService(DataContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<RoomDTO> AddRoom(RoomDTO request)
    {
        var room = new Room
        {
            Title = request.Title,
            RoomTypeID = request.RoomTypeID,
            RoomStatusID = request.RoomStatusID,
            CreatedAt = DateTime.Now
        };

        _dbContext.Rooms.Add(room);
        await _dbContext.SaveChangesAsync();

        return await GetRoom(room.RoomID);
    }

    public async Task<RoomDTO> GetRoom(int id)
    {
        var room = await _dbContext.Rooms
            .Include(r => r.RoomType)
                .ThenInclude(rt => rt.RoomImages)
            .Include(r => r.RoomStatus)
            .FirstOrDefaultAsync(r => r.RoomID == id);

        if (room == null) return null;

        return new RoomDTO
        {
            Title = room.Title,
            RoomTypeID = room.RoomTypeID,
            RoomStatusID = room.RoomStatusID,

        };
    }

    public async Task<IEnumerable<RoomDTO>> GetAllRooms()
    {
        var rooms = await _dbContext.Rooms
            .Include(r => r.RoomType)
                .ThenInclude(rt => rt.RoomImages)
            .Include(r => r.RoomStatus)
            .ToListAsync();

        return rooms.Select(room => new RoomDTO
        {
            Title = room.Title,
            RoomTypeID = room.RoomTypeID,
            RoomStatusID = room.RoomStatusID,

        });
    }

    public async Task<RoomDTO> UpdateRoom(int id, RoomDTO request)
    {
        var room = await _dbContext.Rooms.FindAsync(id);
        if (room == null) return null;

        room.Title = request.Title;
        room.RoomTypeID = request.RoomTypeID;
        room.RoomStatusID = request.RoomStatusID;

        await _dbContext.SaveChangesAsync();

        return await GetRoom(id);
    }

    public async Task DeleteRoom(int id)
    {
        var room = await _dbContext.Rooms.FindAsync(id);
        if (room != null)
        {
            _dbContext.Rooms.Remove(room);
            await _dbContext.SaveChangesAsync();
        }
    }
}
