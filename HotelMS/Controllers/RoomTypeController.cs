using HotelMS.Data.DTO;
using HotelMS.Data.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HotelMS.Controllers
{
    [Microsoft.AspNetCore.Mvc.Route("api/[Controller]")]
    [ApiController]
    public class RoomTypeController:ControllerBase
    {
        private readonly IRoomTypeService _service;
        public RoomTypeController(IRoomTypeService service)
        {
            _service = service;
        }
        [HttpPost("AddRoomType")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AddRoomType(RoomTypeDTO request)
        {
            try
            {
                var result = await _service.AddRoomType(request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("GetRoomType")]
        [Authorize(Roles = "Admin,RoomManager,RoomReceptionist")]
        public async Task<IActionResult> GetRoomType(int id)
        {
            try
            {
                var result = await _service.GetRoomType(id);
                if (result == null)
                {
                    return NotFound();
                }
                else
                {
                    return Ok(result);
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpGet("GetAllRoomTypes")]
        //[Authorize(Roles = "Admin,RoomManager,RoomReceptionist")]
        [Authorize]

        public async Task<IActionResult> GetAllRoomTypes()
        {
            try
            {
                var result = await _service.GetAllRoomTypes();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("DeleteRoomType")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteRoomType(int id)
        {
            try
            {
                await _service.DeleteRoomType(id);
                return Ok("Room type deleted successfully.");
            }
            catch (KeyNotFoundException)
            {
                return NotFound("Room type not found.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }



        [HttpPut("UpdateRoomType")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateRoomType(int id, [FromBody] RoomTypeDTO request)
        {
            try
            {
                var result = await _service.UpdateRoomType(id, request); 
                if (result == null)
                {
                    return NotFound();
                }
                else
                {
                    return Ok(result);
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

    }
}
