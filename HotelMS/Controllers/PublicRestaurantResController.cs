using HotelMS.Data;
using HotelMS.Data.DTO;
using HotelMS.Data.Interfaces;
using HotelMS.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
                var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);

                if (userIdClaim != null)
                {
                    
                    var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == dto.Email.ToLower());
                    if (user == null)
                        return BadRequest("No user found with this email.");

                    var result = await _hostService.CreateReservationForUserByEmailAsync(new RestaurantReservationUserDTO
                    {
                        Email = dto.Email,
                        DateTime = dto.DateTime,
                        Status = "Occupied",
                       
                    });

                    return Ok(new { message = "Reservation created for logged-in user", result });
                }
                else
                {
                   
                    var result = await _hostService.CreateReservationWithGuestAsync(dto);
                    return Ok(new { message = "Reservation created for guest", result });
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = "Reservation failed", details = ex.Message });
            }
        }



    }
}
