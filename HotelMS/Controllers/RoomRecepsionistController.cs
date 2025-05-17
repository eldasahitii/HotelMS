using HotelMS.Data.DTO;
using HotelMS.Data.Interfaces;
using HotelMS.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace HotelMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoomRecepsionistController : ControllerBase
    {
        private readonly IRoomRecepsionistService _service;

        public RoomRecepsionistController(IRoomRecepsionistService service)
        {
            _service = service;
        }

        [HttpPost("addRoomRecepsionist/{assignedByUserId}")]
        public async Task<IActionResult> AddRoomRecepsionist(int assignedByUserId, [FromBody] RoomRecepsionistDTO dto)
        {
            try
            {
                var result = await _service.AddRecepsionist(assignedByUserId, dto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                var message = ex.Message;
                var inner = ex.InnerException;
                while (inner != null)
                {
                    message += " --> " + inner.Message;
                    inner = inner.InnerException;
                }
                return BadRequest(message);
            }
        }


        [HttpGet("getRoomRecepsionist")]
        [Authorize(Roles = "Admin,RoomManager")]
        public async Task<IActionResult> GetRoomRecepsionist(int id)
        {
            try
            {
                var result = await _service.GetRecepsionistById(id);
                if (result == null)
                    return NotFound();

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("getAllRoomRecepsionists")]
        [Authorize(Roles = "Admin,RoomManager")]
        public async Task<IActionResult> GetAllRoomRecepsionists()
        {
            try
            {
                var result = await _service.GetAllRecepsionists();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("updateRoomRecepsionist/{id}")]
        [Authorize(Roles = "Admin,RoomManager")]
        public async Task<IActionResult> UpdateRoomRecepsionist(int id, [FromBody] RoomRecepsionistDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var existing = await _service.GetRecepsionistById(id);
                if (existing == null)
                    return NotFound();

                // Only Shift is updateable, so you can ignore other fields sent by client
                var updated = await _service.UpdateRecepsionist(id, dto);
                return Ok(updated);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("deleteRoomRecepsionist/{id}")]
        [Authorize(Roles = "Admin,RoomManager")]
        public async Task<IActionResult> DeleteRoomRecepsionist(int id)
        {
            try
            {
                await _service.DeleteRecepsionist(id);
                return Ok("Deleted successfully");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
