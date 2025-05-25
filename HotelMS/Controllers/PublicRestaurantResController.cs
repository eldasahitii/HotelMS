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
        public async Task<IActionResult> MakePublicReservation([FromBody] RestaurantReservationGuestDTO dto)
        {
            try
            {
                var result = await _hostService.CreateReservationWithGuestAsync(dto);
                return Ok("Reservation successfully created!");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
