using System.Security.Claims;
using HotelMS.Data.DTO;
using HotelMS.Data.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HotelMS.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RoomReservationController:ControllerBase
    {
        private readonly IRoomReservationService roomReservationService;

        public RoomReservationController(IRoomReservationService roomReservationService)
        {
            this.roomReservationService = roomReservationService;
        }

        [HttpPost("MakeReservation")]
        [Authorize]

        public async Task<IActionResult> MakeReservation([FromBody] RoomReservationDTO request)
        {
            int userID = GetUserIDFromClaims();
            var result = await roomReservationService.MakeReservation(userID, request);
            return Ok(result);
        }

        [HttpGet("GetUserReservations")]
        [Authorize]
        public async Task<IActionResult> GetUserReservations()
        {
            int userID = GetUserIDFromClaims();
            var reservations = await roomReservationService.GetUserReservations(userID);
            return Ok(reservations);
        }

        [HttpGet("GetAllReservations")]
        [Authorize(Roles = "Admin,Manager,Recepsionist")]

        public async Task<IActionResult> GetAllReservations()
        {
            var reservations = await roomReservationService.GetAllReservations();
            return Ok(reservations);
        }

        [HttpDelete("CancelReservationUser")]
        [Authorize]
        public async Task<IActionResult> CancelMyReservation(int id)
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "UserID")?.Value;

            if (userIdClaim == null)
            {
                return Unauthorized(new { message = "User is not authenticated" });
            }

            int userId = int.Parse(userIdClaim);

            var result = await roomReservationService.CancelReservation(id, userId, false);

            return Ok(result);
        }

        [HttpDelete("staffCancelReservation")]
        [Authorize(Roles = "Admin,Recepsionist")]
        public async Task<IActionResult> CancelReservationAsStaff(int id)
        {
            var result = await roomReservationService.CancelReservation(id, 0, true);

            return Ok(result);
        }

        private int GetUserIDFromClaims()
        {
            return int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
        }





    }
}
