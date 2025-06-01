using HotelMS.Data;
using HotelMS.Data.DTO;
using HotelMS.Data.Interfaces;
using HotelMS.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HotelMS.Services
{
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
                RoomTypeID = request.RoomTypeID,
                RoomStatusID = request.RoomStatusID,
                CreatedAt = DateTime.Now,
                RoomNumber = request.RoomNumber 
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
                RoomID = room.RoomID,
                RoomTypeID = room.RoomTypeID,
                RoomStatusID = room.RoomStatusID,
                RoomNumber = room.RoomNumber
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
                RoomID = room.RoomID,
                RoomTypeID = room.RoomTypeID,
                RoomStatusID = room.RoomStatusID,
                RoomNumber = room.RoomNumber
            });
        }

        public async Task<RoomDTO> UpdateRoom(int id, RoomDTO request)
        {
            var room = await _dbContext.Rooms.FindAsync(id);
            if (room == null) return null;

            room.RoomTypeID = request.RoomTypeID;
            room.RoomStatusID = request.RoomStatusID;
            room.RoomNumber = request.RoomNumber;

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

        public async Task<RoomDetailsDTO> GetRoomDetails(int roomId)
        {
            var room = await _dbContext.Rooms
                .Include(r => r.RoomType)
                    .ThenInclude(rt => rt.RoomImages)
                .Include(r => r.RoomStatus)
                .FirstOrDefaultAsync(r => r.RoomID == roomId);

            if (room == null) return null;

            return new RoomDetailsDTO
            {
                RoomID = room.RoomID,
                RoomNumber = room.RoomNumber,
                CreatedAt = room.CreatedAt,
                RoomStatusID = room.RoomStatusID,
                RoomStatusName = room.RoomStatus.RoomStatusName,
                RoomType = new RoomTypeDTO
                {
                    Name = room.RoomType.Name,
                    Capacity = room.RoomType.Capacity,
                    Size = room.RoomType.Size,
                    Description = room.RoomType.Description,
                    Price = room.RoomType.Price,
                    Images = room.RoomType.RoomImages
                .Where(img => !img.IsPreview)
                .Select(img => new RoomImageDTO
                {
                    RoomTypeID = img.RoomTypeID,
                    ImageUrl = img.ImageUrl,
                    IsPreview = img.IsPreview
                })
                .ToList()
                }

            };
        }
        public async Task BulkCreateRoomsAsync(BulkRoomCreateDTO dto)
        {
            var rooms = new List<Room>();

            for (int i = 0; i < dto.NumberOfRooms; i++)
            {
                var roomNumber = $"{dto.Prefix} {dto.StartingRoomNumber + i}";

                var room = new Room
                {
                    RoomNumber = roomNumber,
                    RoomTypeID = dto.RoomTypeID,
                    RoomStatusID = dto.RoomStatusID
                };

                rooms.Add(room);
            }

            _dbContext.Rooms.AddRange(rooms);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<IEnumerable<RoomAvailabilityDTO>> GetRoomAvailability()
        {
            var availabilityData = await _dbContext.Rooms
                .GroupBy(r => r.RoomTypeID)
                .Select(g => new RoomAvailabilityDTO
                {
                    RoomTypeID = g.Key,
                    TotalRooms = g.Count(),
                    AvailableRooms = g.Count(r => r.RoomStatusID == 1) 
                })
                .ToListAsync();

            return availabilityData;
        }




    }
}
