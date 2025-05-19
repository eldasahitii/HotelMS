using HotelMS.Data.DTO;
using HotelMS.Data.Interfaces;
using HotelMS.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HotelMS.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RoomImageController : ControllerBase
    {
        private readonly IRoomImageService _roomImageService;

        public RoomImageController(IRoomImageService roomImageService)
        {
            _roomImageService = roomImageService;
        }

        [HttpGet("GetImagesByRoom")]
        //[Authorize(Roles = "Admin,RoomManager,RoomRecepsionist")]
        [Authorize]

        public async Task<IActionResult> GetImagesByRoom(int roomId)
        {
            var images = await _roomImageService.GetImagesByRoomId(roomId);
            return Ok(images);
        }

        [HttpPost("AddImage")]
        [Authorize(Roles ="Admin,RoomManager")]
        public async Task<IActionResult> AddImage([FromBody] RoomImageDTO image)
        {
            var result = await _roomImageService.AddImage(image);
            return Ok(result);
        }

        [HttpDelete("DeleteImage")]
        [Authorize(Roles = "Admin,RoomManager")]
        public async Task<IActionResult> DeleteImage(int imageId)
        {
            await _roomImageService.DeleteImage(imageId);
            return NoContent();
        }
    }
}
