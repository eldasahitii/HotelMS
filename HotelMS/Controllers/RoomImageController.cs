using HotelMS.Data.DTO;
using HotelMS.Data.Interfaces;
using HotelMS.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using System.Threading.Tasks;

namespace HotelMS.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RoomImageController : ControllerBase
    {
        private readonly IRoomImageService _roomImageService;
        private readonly IWebHostEnvironment _environment;

        public RoomImageController(IRoomImageService roomImageService, IWebHostEnvironment environment)
        {
            _roomImageService = roomImageService;
            _environment = environment;
        }

        [HttpGet("GetImagesByRoom")]
        [Authorize]
        public async Task<IActionResult> GetImagesByRoom(int roomId)
        {
            var images = await _roomImageService.GetImagesByRoomTypeId(roomId);
            return Ok(images);
        }


        [HttpPost("AddRoomImage")]
        [Authorize(Roles = "Admin,RoomManager")]
        public async Task<IActionResult> AddImage([FromForm] RoomImageUploadDTO model)
        {
            var roomTypeId = model.RoomTypeID;
            var image = model.Image;

            if (image == null || image.Length == 0)
                return BadRequest("No image uploaded.");

            var uploadsFolder = Path.Combine(_environment.WebRootPath, "images", "roomtypes");
            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            var uniqueFileName = $"{Guid.NewGuid()}{Path.GetExtension(image.FileName)}";
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await image.CopyToAsync(stream);
            }

            var imageUrl = $"/images/roomtypes/{uniqueFileName}";

            var dto = new RoomImageDTO
            {
                RoomTypeID = roomTypeId,
                ImageUrl = imageUrl,
                IsPreview = model.IsPreview 
            };

            var savedImage = await _roomImageService.AddImage(dto);

            return Ok(new { ImageUrl = imageUrl, savedImage });
        }



        [HttpDelete("DeleteImage")]
        [Authorize(Roles = "Admin,RoomManager")]
        public async Task<IActionResult> DeleteImage(int imageId)
        {
            // First get the image record (to know the file path)
            var image = await _roomImageService.GetImageById(imageId);
            if (image == null)
                return NotFound();

            // Build the physical path
            var filePath = Path.Combine(_environment.WebRootPath, image.ImageUrl.TrimStart('/').Replace("/", Path.DirectorySeparatorChar.ToString()));

            // Delete file if exists
            if (System.IO.File.Exists(filePath))
            {
                System.IO.File.Delete(filePath);
            }

            // Delete DB record
            await _roomImageService.DeleteImage(imageId);

            return NoContent();
        }

        [HttpGet("GetImagesByRoomTypeId/{roomTypeId}")]
        public async Task<ActionResult<IEnumerable<RoomImage>>> GetImagesByRoomTypeId(
       int roomTypeId,
       [FromQuery] bool isPreview = false)
        {
            var images = await _roomImageService.GetImagesByRoomTypeIdAndPreviewFlag(roomTypeId, isPreview);

            if (images == null)
                return NotFound();

            return Ok(images);
        }

    }
}
