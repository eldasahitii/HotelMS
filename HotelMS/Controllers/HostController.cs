using HotelMS.Data;
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
    [Authorize(Roles = "RestaurantHost, RestaurantManager")]
    public class HostController : ControllerBase
    {
       
            private readonly IHostService _service;
            private readonly DataContext _context;

        public HostController(IHostService service, DataContext context)
            {
                _service = service;
                _context = context;
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

        [HttpGet("getAllGuests")]
        public async Task<IActionResult> GetAllGuests()
        {
            try
            {
                var guests = await _context.RestaurantGuests.ToListAsync();
                return Ok(guests);
            }
            catch (Exception ex)
            {
                return BadRequest("Failed to load guests: " + (ex.InnerException?.Message ?? ex.Message));
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
        public async Task<IActionResult> CreateReservation([FromBody] RestaurantReservationCreateDTO request)
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

        [HttpPost("createReservationWithGuest")]
        public async Task<IActionResult> CreateReservationWithGuest([FromBody] RestaurantReservationGuestDTO dto)
        {
            try
            {
                var result = await _service.CreateReservationWithGuestAsync(dto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpPost("createReservationByEmail")]
        [Authorize(Roles = "RestaurantHost")]
        public async Task<IActionResult> CreateReservationByEmail([FromBody] RestaurantReservationUserDTO dto)
        {
            try
            {
                var result = await _service.CreateReservationForUserByEmailAsync(dto);
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
