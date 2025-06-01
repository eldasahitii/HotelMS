using HotelMS.Data.DTO;
using HotelMS.Data.Interfaces;
using HotelMS.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HotelMS.Controllers
{
    [Route("api/[controller]")]
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
        //[Authorize(Roles = "Admin,RoomManager,RoomRecepsionist")]
        public async Task<IActionResult> GetRoom(int id)
        {
            try
            {
                var result = await _service.GetRoom(id);
                if (result == null)
                    return NotFound();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("GetAllRooms")]
        //[Authorize(Roles = "Admin,RoomManager,RoomRecepsionist,CleaningManager")]
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


        [HttpDelete("DeleteRoom/{id}")]
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


        [HttpPut("UpdateRoom/{id}")]
        [Authorize(Roles = "Admin,RoomManager")]
        public async Task<IActionResult> UpdateRoom(int id, [FromBody] RoomDTO request)
        {
            try
            {
                if (request.RoomTypeID <= 0 || request.RoomStatusID <= 0)
                    return BadRequest("Invalid RoomTypeID or RoomStatusID.");

                var result = await _service.UpdateRoom(id, request);
                if (result == null)
                    return NotFound();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("GetRoomDetails/{id}")]
        [Authorize(Roles = "Admin,RoomManager,RoomRecepsionist")]
        public async Task<IActionResult> GetRoomDetails(int id)
        {
            try
            {
                var result = await _service.GetRoomDetails(id);
                if (result == null)
                    return NotFound();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("BulkCreateRooms")]
        [Authorize(Roles = "Admin,RoomManager")]
        public async Task<IActionResult> BulkCreateRooms([FromBody] BulkRoomCreateDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                await _service.BulkCreateRoomsAsync(dto);
                return Ok(new { Message = $"{dto.NumberOfRooms} rooms created successfully." });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("GetRoomAvailability")]
        public async Task<ActionResult<IEnumerable<RoomAvailabilityDTO>>> GetRoomAvailability()
        {
            var availability = await _service.GetRoomAvailability();
            return Ok(availability);
        }
    }
}
