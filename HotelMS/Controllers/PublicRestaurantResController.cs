using HotelMS.Data;
using HotelMS.Data.DTO;
using HotelMS.Data.Interfaces;
using HotelMS.Models;
using Microsoft.AspNetCore.Mvc;

namespace HotelMS.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PublicRestaurantResController : ControllerBase
    {
        private readonly DataContext _dbContext;
        private readonly IHostService _hostService;

        public PublicRestaurantResController(DataContext dbContext, IHostService hostService)
        {
            _dbContext = dbContext;
            _hostService = hostService;
        }

        [HttpPost("make")]
        public async Task<IActionResult> MakeReservation([FromBody] RestaurantReservationGuestDTO dto)
        {
            try
            {
                if (!string.IsNullOrWhiteSpace(dto.Email) &&
                    string.IsNullOrWhiteSpace(dto.FirstName) &&
                    string.IsNullOrWhiteSpace(dto.LastName) &&
                    string.IsNullOrWhiteSpace(dto.PhoneNumber))
                {
                    // Logged-in user by email only
                    var userResult = await _hostService.CreateReservationForUserByEmailAsync(new RestaurantReservationUserDTO
                    {
                        Email = dto.Email,
                        DateTime = dto.DateTime,
                       
                    });

                    return Ok(new { message = "Reservation created for user", result = userResult });
                }

                // Otherwise treat as public guest
                var guestResult = await _hostService.CreateReservationWithGuestAsync(dto);
                return Ok(new { message = "Reservation created for guest", result = guestResult });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = "Reservation failed", details = ex.Message });
            }
        }


    }
}
