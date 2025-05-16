using HotelMS.Data.DTO;
using HotelMS.Data.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HotelMS.Controllers
{
    [Route("api/[Controller]")]
    [ApiController]
    public class ReservationStatusController : ControllerBase
    {
        private readonly IReservationStatusService _service;

        public ReservationStatusController(IReservationStatusService service)
        {
            _service = service;
        }

        [HttpPost("addReservationStatus")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AddReservationStatus(ReservationStatusDTO request)
        {
            try
            {
                var result = await _service.AddReservationStatus(request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("getReservationStatus")]
        [Authorize(Roles = "Admin,RoomManager,RoomReceptionist")]
        public async Task<IActionResult> GetReservationStatus(int id)
        {
            try
            {
                var result = await _service.GetReservationStatus(id);
                return result == null ? NotFound() : Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("getAllReservationStatuses")]
        [Authorize(Roles = "Admin,RoomManager,RoomReceptionist")]
        public async Task<IActionResult> GetAllReservationStatuses()
        {
            try
            {
                var result = await _service.GetAllReservationStatuses();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("deleteReservationStatus")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteReservationStatus(int id)
        {
            try
            {
                await _service.DeleteReservationStatus(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("updateReservationStatus")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateReservationStatus(int id, [FromBody] ReservationStatusDTO request)
        {
            try
            {
                var result = await _service.UpdateReservationStatus(id, request); 
                return result == null ? NotFound() : Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
