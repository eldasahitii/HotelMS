using HotelMS.Data.DTO;
using HotelMS.Data.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace HotelMS.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Customer")]
    public class RestaurantResUserController : ControllerBase
    {
        private readonly IHostService _service;

        public RestaurantResUserController(IHostService service)
        {
            _service = service;
        }

        [HttpGet("getUserReservations")]
        public async Task<IActionResult> GetUserReservations()
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var result = await _service.GetUserReservationsAsync(userId.Value);
            return Ok(result);
        }

        [HttpPut("updateUserReservation/{id}")]
        public async Task<IActionResult> UpdateReservation(int id, [FromBody] RestaurantReservationUpdateDTO dto)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var result = await _service.UpdateUserReservationAsync(id, userId.Value, dto.DateTime, dto.Status);
            if (!result) return NotFound("Reservation not found or not yours.");

            return Ok("Reservation updated.");
        }

        [HttpDelete("cancelUserReservation")]
        public async Task<IActionResult> CancelReservation(int id)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var result = await _service.CancelUserReservationAsync(id, userId.Value);
            if (!result) return NotFound("Reservation not found or not yours.");

            return Ok("Reservation cancelled.");
        }

        private int? GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            return userIdClaim != null ? int.Parse(userIdClaim.Value) : (int?)null;
        }
    }
}
