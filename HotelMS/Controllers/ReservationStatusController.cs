using HotelMS.Data.DTO;
using HotelMS.Data.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace HotelMS.Controllers
{
    [Microsoft.AspNetCore.Mvc.Route("api/[Controller]")]
    [ApiController]
    public class ReservationStatusController : ControllerBase
    {
        private readonly IReservationStatusService _service;

        public ReservationStatusController(IReservationStatusService service)
        {
            _service = service;
        }

        [HttpPost("addReservationStatus")]
        public async Task<IActionResult> AddReservationStatus(ReservationStatusDTO request)
        {
            try
            {
                var result = await _service.AddReservationStatus(request);
                return Ok(request);
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }
        [HttpGet("getReservationStatus")]
        public async Task<IActionResult> GetReservationStatus(int id)
        {
            try
            {
                var result = await _service.GetReservationStatus(id);
                if (result == null)
                {
                    return NotFound();
                }
                else
                {
                    return Ok(result);
                }
            }
            catch (Exception ex) { 
                return BadRequest(ex);
            }
        }

        [HttpGet("getAllReservationStatuses")]
        public async Task<IActionResult> GetAllReservationStatuses()
        {
            try
            {
                var result = await _service.GetAllReservationStatuses();
                return Ok(result);
            }
            catch (Exception ex) { 
                return BadRequest(ex.Message);
            }
        }
        [HttpDelete("deleteReservationStatus")]
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
        public async Task<IActionResult> UpdateReservationStatus(int id, [FromBody] ReservationStatusDTO request)
        {
            try
            {
                var result = _service.UpdateReservationStatus(id, request);
                if (result == null)
                {
                    return NotFound();
                }
                else
                {
                    return Ok(result);
                }
            }
            catch (Exception ex) {
                return BadRequest(ex.Message);
            }
        }
    }
}

