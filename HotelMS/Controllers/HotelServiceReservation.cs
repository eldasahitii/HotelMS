using HotelMS.Data.DTO;
using HotelMS.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace HotelMS.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HotelServiceReservationController : ControllerBase
    {
        private readonly IHotelServiceReservationService _reservationService;

        public HotelServiceReservationController(IHotelServiceReservationService reservationService)
        {
            _reservationService = reservationService;
        }

        [HttpGet("GetAllReservations")]
        [Authorize(Roles = "Admin,ServiceManager, ServiceRecepsionist")]
        public async Task<IActionResult> GetAllReservations()
        {
            var reservations = await _reservationService.GetAllReservationsAsync();
            return Ok(reservations);
        }

        [HttpGet("GetReservationById/{id}")]
        [Authorize(Roles = "Admin,ServiceRecepsionist")]
        public async Task<IActionResult> GetReservationById(int id)
        {
            var reservation = await _reservationService.GetReservationByIdAsync(id);
            if (reservation == null)
                return NotFound(new { message = "Reservation not found." });

            return Ok(reservation);
        }

        [HttpPost("CreateReservation")]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> CreateReservation([FromBody] HotelServiceReservationDTO reservationDto)
        {
            try
            {
                var newId = await _reservationService.CreateReservationAsync(reservationDto);
                return Ok(new { success = true, reservationId = newId });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { success = false, message = ex.Message });
            }
        }

        [HttpPut("UpdateReservation")]
        [Authorize(Roles = "Admin,ServiceRecepsionist")]
        public async Task<IActionResult> UpdateReservation([FromBody] HotelServiceReservationDTO reservationDto)
        {
            var success = await _reservationService.UpdateReservationAsync(reservationDto);
            if (!success)
                return BadRequest(new { message = "Failed to update reservation." });

            return Ok(new { message = "Reservation updated successfully." });
        }

        [HttpDelete("DeleteReservation/{id}")]
        [Authorize(Roles = "Admin,ServiceRecepsionist")]
        public async Task<IActionResult> DeleteReservation(int id)
        {
            var success = await _reservationService.DeleteReservationAsync(id);
            if (!success)
                return BadRequest(new { message = "Failed to delete reservation." });

            return Ok(new { message = "Reservation deleted successfully." });
        }

        
    }
}
