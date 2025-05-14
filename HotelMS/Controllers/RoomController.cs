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
                var result = await _service.GetAll();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("DeleteRoom")]
        [Authorize(Roles = "Admin,RoomManager")]

        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var result = _service.DeleteRoom(id);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("UpdateRoom")]
        [Authorize(Roles = "Admin,RoomManager")]
        public async Task<IActionResult> Update(int id, [FromBody] RoomDTO request)
        {
            try
            {
                var result = _service.UpdateRoom(id, request);
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
