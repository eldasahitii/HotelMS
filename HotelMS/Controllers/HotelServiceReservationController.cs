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
        private readonly IHotelServiceReservationService hotelServiceReservationService;

        public HotelServiceReservationController(IHotelServiceReservationService hotelServiceReservationService)
        {
            this.hotelServiceReservationService = hotelServiceReservationService;
        }

        [HttpPost("MakeReservation")]
        [Authorize(Roles = "Admin,HotelServiceRecepsionist,Customer")]
        public async Task<IActionResult> MakeReservation([FromBody] HotelServiceReservationDTO request)
        {
            int userID = GetUserIDFromClaims();
            var roles = User.FindAll(ClaimTypes.Role).Select(c => c.Value).ToList();

            var result = await hotelServiceReservationService.MakeReservation(userID, request, roles);

            return Ok(result);
        }

        [HttpPut("UpdateReservation/{reservationID}")]
        [Authorize(Roles = "Admin,HotelServiceRecepsionist")]
        public async Task<IActionResult> UpdateReservation(int reservationID, [FromBody] HotelServiceReservationUpdateDTO request)
        {
            int userID = GetUserIDFromClaims();
            var roles = User.FindAll(ClaimTypes.Role).Select(c => c.Value).ToList();

            var result = await hotelServiceReservationService.UpdateReservation(reservationID, request, userID, roles);

            if (result == "Reservation updated successfully")
                return Ok(new { message = result });

            return BadRequest(new { error = result });
        }

        [HttpGet("GetUserReservations")]
        [Authorize(Roles = "Admin,HotelServiceManager,HotelServiceRecepsionist,Customer")]
        public async Task<IActionResult> GetUserReservations()
        {
            int userID = GetUserIDFromClaims();
            var reservations = await hotelServiceReservationService.GetUserReservations(userID);
            return Ok(reservations);
        }

        [HttpGet("GetAllReservations")]
        [Authorize(Roles = "Admin,HotelServiceManager,HotelServiceRecepsionist")]
        public async Task<IActionResult> GetAllReservations()
        {
            var reservations = await hotelServiceReservationService.GetAllReservations();
            return Ok(reservations);
        }

        [HttpDelete("CancelReservationUser")]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> CancelMyReservation(int id)
        {
            int userId = GetUserIDFromClaims();
            var result = await hotelServiceReservationService.CancelReservation(id, userId, false);
            return Ok(result);
        }

        [HttpDelete("staffCancelReservation")]
        [Authorize(Roles = "Admin,HotelServiceRecepsionist")]
        public async Task<IActionResult> CancelReservationAsStaff(int id)
        {
            var result = await hotelServiceReservationService.CancelReservation(id, 0, true);

            if (result != "Reservation cancelled successfully")
            {
                return BadRequest(new { message = result });
            }

            return Ok(new { message = result });
        }

        [HttpPost("MarkReservationCompleted")]
        [Authorize(Roles = "Admin,HotelServiceRecepsionist")]
        public async Task<IActionResult> MarkReservationCompleted([FromBody] MarkReservationCompletedDTO request)
        {
            int userID = GetUserIDFromClaims();

            var result = await hotelServiceReservationService.MarkReservationCompleted(request.ReservationID, userID);

            if (result.StartsWith("You are not authorized"))
                return Unauthorized(result);

            if (result.StartsWith("Reservation not found"))
                return NotFound(result);

            return Ok(result);
        }

        private int GetUserIDFromClaims()
        {
            return int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
        }
    }
}
