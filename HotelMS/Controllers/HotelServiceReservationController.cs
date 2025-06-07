using System.Security.Claims;
using HotelMS.Data.DTO;
using HotelMS.Data.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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

        [HttpPost("MakeReservation")]
        [Authorize(Roles = "Admin,ServiceRecepsionist,Customer")]
        public async Task<IActionResult> MakeReservation([FromBody] HotelServiceReservationCreateDTO request)
        {
            int userID = GetUserIDFromClaims();
            var roles = User.FindAll(ClaimTypes.Role).Select(c => c.Value).ToList();

            var (success, message) = await _reservationService.MakeReservation(userID, request, roles);

            if (!success)
                return BadRequest(new { success = false, message });

            return Ok(new { success = true, message });
        }

        [HttpPut("UpdateReservation/{reservationID}")]
        [Authorize(Roles = "Admin,ServiceRecepsionist,Customer")]
        public async Task<IActionResult> UpdateReservation(int reservationID, [FromBody] HotelServiceReservationUpdateDTO request)
        {
            int userID = GetUserIDFromClaims();
            var roles = User.FindAll(ClaimTypes.Role).Select(c => c.Value).ToList();

            var result = await _reservationService.UpdateReservation(reservationID, request, userID, roles);

            if (result == "Reservation updated successfully")
                return Ok(new { message = result });

            return BadRequest(new { error = result });
        }

        [HttpGet("GetUserReservations")]
        [Authorize(Roles = "Admin,ServiceRecepsionist,Customer")]
        public async Task<IActionResult> GetUserReservations()
        {
            int userID = GetUserIDFromClaims();
            var reservations = await _reservationService.GetUserReservations(userID);
            return Ok(reservations);
        }

        [HttpGet("GetAllReservations")]
        [Authorize(Roles = "Admin,ServiceRecepsionist")]
        public async Task<IActionResult> GetAllReservations()
        {
            var reservations = await _reservationService.GetAllReservations();
            return Ok(reservations);
        }

        [HttpDelete("CancelReservationUser")]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> CancelMyReservation(int id)
        {
            int userId = GetUserIDFromClaims();

            var result = await _reservationService.CancelReservation(id, userId, false);

            return Ok(new { message = result });
        }

        [HttpDelete("StaffCancelReservation")]
        [Authorize(Roles = "Admin,ServiceRecepsionist")]
        public async Task<IActionResult> CancelReservationAsStaff(int id)
        {
            var result = await _reservationService.CancelReservation(id, 0, true);

            if (result != "Reservation cancelled successfully")
                return BadRequest(new { message = result });

            return Ok(new { message = result });
        }

        [HttpPost("MarkReservationCompleted")]
        [Authorize(Roles = "Admin,ServiceRecepsionist")]
        public async Task<IActionResult> MarkReservationCompleted([FromBody] MarkReservationCompletedDTO request)
        {
            int userID = GetUserIDFromClaims();

            var result = await _reservationService.MarkReservationCompleted(request.ReservationID, userID);

            if (result == "Reservation not found")
                return NotFound(new { error = result });

            if (result == "User or role not found" || result.StartsWith("Unauthorized"))
                return Unauthorized(new { error = result });

            if (result == "Cannot complete reservation before the scheduled date")
                return BadRequest(new { error = result });

            if (result == "Completed status not found")
                return StatusCode(500, new { error = result });

            if (result == "Reservation marked as completed")
                return Ok(new { message = result });

            return BadRequest(new { error = result });
        }

        [HttpPut("UpdateStatus/{reservationID}")]
        [Authorize(Roles = "Admin,ServiceRecepsionist")]
        public async Task<IActionResult> UpdateStatus(int reservationID, [FromQuery] int statusID)
        {
            var result = await _reservationService.UpdateReservationStatus(reservationID, statusID);

            if (result == "Reservation not found" || result == "Invalid status ID")
                return BadRequest(new { message = result });

            return Ok(new { message = result });
        }

        private int GetUserIDFromClaims()
        {
            return int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
        }
    }
}
