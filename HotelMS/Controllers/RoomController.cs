using HotelMS.Data.DTO;
using HotelMS.Data.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Mvc;

namespace HotelMS.Controllers
{
    [Microsoft.AspNetCore.Mvc.Route("api/[Controller]")]
    [ApiController]
    public class RoomController : ControllerBase
    {
        private readonly IRoomService _service;
        public RoomController(IRoomService service)
        {
            _service = service;
        }

        [HttpPost("AddRoom")]
        [Authorize(Roles = "Admin,RoomManager")]
        public async Task<IActionResult> AddRoom(RoomDTO request)
        {
            try
            {
                var result = await _service.AddRoom(request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("GetRoom")]
        [Authorize(Roles = "Admin,RoomManager,RoomRecepsionist")]
        public async Task<IActionResult> GetRoom(int id)
        {
            try
            {
                var result = await _service.GetRoom(id);
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

        [HttpGet("GetAllRooms")]
        [Authorize(Roles = "Admin,RoomManager,RoomRecepsionist")]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var result = await _service.GetAllRooms();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("DeleteRoom")]
        [Authorize(Roles = "Admin,RoomManager")]
        public async Task<IActionResult> DeleteRoom(int id)
        {
            try
            {
                await _service.DeleteRoom(id);
                return Ok(new { message = $"Room with ID {id} deleted successfully." });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpPut("UpdateRoom")]
        [Authorize(Roles = "Admin,RoomManager")]
        public async Task<IActionResult> UpdateRoom(int id, [FromBody] RoomDTO request)
        {
            try
            {
                if (request.RoomTypeID <= 0 || request.RoomStatusID <= 0)
                {
                    return BadRequest("Invalid RoomTypeID or RoomStatusID.");
                }

                var result = await _service.UpdateRoom(id, request);
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
