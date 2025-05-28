using System.Security.Claims;
using HotelMS.Data.DTO;
using HotelMS.Data.Interfaces;
using HotelMS.Models;
using HotelMS.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;


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
        [Authorize(Roles = "Admin,RoomRecepsionist,Customer")]
        public async Task<IActionResult> MakeReservation([FromBody] RoomReservationDTO request)
        {
            int userID = GetUserIDFromClaims();
            var roles = User.FindAll(ClaimTypes.Role).Select(c => c.Value).ToList();

            var result = await roomReservationService.MakeReservation(userID, request, roles);

            return Ok(result);
        }
        [HttpPut("UpdateReservation/{reservationID}")]
        [Authorize(Roles ="Admin,RoomRecepsionist")] 
        public async Task<IActionResult> UpdateReservation(int reservationID, [FromBody] RoomReservationUpdateDTO request)
        {
 
            int userID = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var roles = new List<string>();
            foreach (var claim in User.FindAll(ClaimTypes.Role))
            {
                roles.Add(claim.Value);
            }

            var result = await roomReservationService.UpdateReservation(reservationID, request, userID, roles);

            if (result == "Reservation updated successfully")
                return Ok(new { message = result });

            return BadRequest(new { error = result });
        }



        [HttpGet("GetUserReservations")]
        [Authorize(Roles = "Admin,RoomManager,RoomRecepsionist,Customer")]
        public async Task<IActionResult> GetUserReservations()
        {
            int userID = GetUserIDFromClaims();
            var reservations = await roomReservationService.GetUserReservations(userID);
            return Ok(reservations);
        }

        [HttpGet("GetAllReservations")]
        [Authorize(Roles = "Admin,RoomManager,RoomRecepsionist")]

        public async Task<IActionResult> GetAllReservations()
        {
            var reservations = await roomReservationService.GetAllReservations();
            return Ok(reservations);
        }

        [HttpDelete("CancelReservationUser")]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> CancelMyReservation(int id)
        {
            int userId = GetUserIDFromClaims();

            var result = await roomReservationService.CancelReservation(id, userId, false);

            return Ok(result);
        }



        [HttpDelete("staffCancelReservation")]
        [Authorize(Roles = "Admin,RoomRecepsionist")]
        public async Task<IActionResult> CancelReservationAsStaff(int id)
        {
            var result = await roomReservationService.CancelReservation(id, 0, true);

            if (result != "Reservation cancelled successfully")
            {
                return BadRequest(new { message = result });
            }

            return Ok(new { message = result });
        }


        [HttpPost("MarkReservationCompleted")]
        [Authorize(Roles = "Admin,RoomRecepsionist")] 
        public async Task<IActionResult> MarkReservationCompleted([FromBody] MarkReservationCompletedDTO request)
        {
            int userID = GetUserIDFromClaims();

            var result = await roomReservationService.MarkReservationCompleted(request.ReservationID, userID);

            if (result.StartsWith("You are not authorized"))
            {
                return Unauthorized(result);  
            }

            if (result.StartsWith("Reservation not found"))
            {
                return NotFound(result); 
            }

            return Ok(result);  
        }

        private int GetUserIDFromClaims()
        {
            return int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
        }





    }
}
