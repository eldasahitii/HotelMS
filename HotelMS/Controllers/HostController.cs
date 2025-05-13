using HotelMS.Data.DTO;
using HotelMS.Data.Interfaces;
using HotelMS.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HotelMS.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Host")]
    public class HostController : ControllerBase
    {
       
            private readonly IHostService _service;

            public HostController(IHostService service)
            {
                _service = service;
            }

            [HttpGet("getAllReservations")]
            public async Task<IActionResult> GetAllReservations()
            {
                try
                {
                    var result = await _service.GetAllReservationsAsync();
                    return Ok(result);
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.Message);
                }
            }

            [HttpGet("getReservation")]
            public async Task<IActionResult> GetReservation(int id)
            {
                try
                {
                    var result = await _service.GetReservationByIdAsync(id);
                    if (result == null)
                        return NotFound("Reservation not found.");
                    return Ok(result);
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.Message);
                }
            }

            [HttpPost("createReservation")]
            public async Task<IActionResult> CreateReservation([FromBody] RestaurantReservation request)
            {
                try
                {
                    var result = await _service.CreateReservationAsync(request);
                    return Ok(result);
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.Message);
                }
            }

            [HttpDelete("cancelReservation")]
            public async Task<IActionResult> CancelReservation(int id)
            {
                try
                {
                    var result = await _service.CancelReservationAsync(id);
                    if (!result)
                        return NotFound("Reservation not found.");
                    return Ok("Reservation cancelled.");
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.Message);
                }
            }

            [HttpPut("updateReservationStatus")]
            public async Task<IActionResult> UpdateReservationStatus(int id, [FromBody] string newStatus)
            {
                try
                {
                    var result = await _service.UpdateReservationAsync(id, newStatus);
                    if (!result)
                        return NotFound("Reservation not found.");
                    return Ok("Status updated.");
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.Message);
                }
            }
        }
}
