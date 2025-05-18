using HotelMS.Data.DTO;
using HotelMS.Data.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HotelMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RestaurantReservationController : ControllerBase
    {
        private readonly IRestaurantReservationService _service;
        public RestaurantReservationController(IRestaurantReservationService service)
        {
            _service = service;
        }

        [HttpPost("addReservation")]
        public async Task<IActionResult> AddReservation(RestaurantReservationCreateDTO request)
        {
            try
            {
                var result = await _service.AddReservation(request);
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
                var result = await _service.GetReservation(id);
                if (result == null) return NotFound();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("getAllReservations")]
        public async Task<IActionResult> GetAllReservations()
        {
            try
            {
                var result = await _service.GetAllReservations();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("deleteReservation")]
        public async Task<IActionResult> DeleteReservation(int id)
        {
            try
            {
                await _service.DeleteReservation(id);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("updateReservation")]
        public async Task<IActionResult> UpdateReservation(int id, [FromBody] RestaurantReservationCreateDTO request)
        {
            try
            {
                var result = await _service.UpdateReservation(id, request);
                if (result == null) return NotFound();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
