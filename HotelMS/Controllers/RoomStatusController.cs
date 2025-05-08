using HotelMS.Data.DTO;
using HotelMS.Data.Interfaces;
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
        public async Task<IActionResult> GetAllRoomStatus()
        {
            try
            {
                var result = await _service.GetAllRoomStatus();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("deleteRoomStatus")]

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

