using HotelMS.Data.DTO;
using HotelMS.Data.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HotelMS.Controllers
{
    [Microsoft.AspNetCore.Mvc.Route("api/[Controller]")]
    [ApiController]
    public class RoomStatusController:ControllerBase
    {
        private readonly IRoomStatusService _service;
        public RoomStatusController(IRoomStatusService service)
        {
            _service = service;
        }

        [HttpPost("addRoomStatus")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AddRoomStatus(RoomStatusDTO request)
        {
            try
            {
                var product = await _service.AddRoomStatus(request);
                return Ok(product);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("getRoomStatus")]
        [Authorize(Roles = "Admin,RoomManager,RoomReceptionist,CleaningManager")]
        public async Task<IActionResult> GetRoomStatus(int id)
        {
            try
            {
                var result = await _service.GetRoomStatus(id);
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

        [HttpGet("getAllRoomsStatuses")]
        [Authorize(Roles = "Admin,RoomManager,RoomRecepsionist,CleaningManager")]
        public async Task<IActionResult> GetAllRoomStatus([FromQuery] string role)
        {
            try
            {
                var result = await _service.GetAllRoomStatus(role);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("deleteRoomStatus")]
        [Authorize(Roles = "Admin")]

        public async Task<IActionResult> DeleteRoomStatus(int id)
        {
            try
            {
                var result = _service.DeleteRoomStatus(id);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("updateRoomStatus")]
        [Authorize(Roles = "Admin")]

        public async Task<IActionResult> UpdateRoomStatus(int id, [FromBody] RoomStatusDTO request)
        {
            try
            {
                var result = _service.UpdateRoomStatus(id, request);
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

