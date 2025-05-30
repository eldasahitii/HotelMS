using HotelMS.Data;
using HotelMS.Data.DTO;
using HotelMS.Data.Interfaces;
using HotelMS.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;



namespace HotelMS.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RestaurantSettingsController : ControllerBase
    {
        private readonly DataContext _context;

        public RestaurantSettingsController(DataContext context)
        {
            _context = context;
        }

        [HttpGet("get")]
        public async Task<IActionResult> GetSettings()
        {
            var settings = await _context.RestaurantSettings.FirstOrDefaultAsync();
            if (settings == null)
                return NotFound("Settings not found.");
            return Ok(settings);
        }

        [HttpPut("update")]
        public async Task<IActionResult> UpdateSettings([FromBody] RestaurantSettings updated)
        {
            var existing = await _context.RestaurantSettings.FirstOrDefaultAsync();
            if (existing == null)
            {
                _context.RestaurantSettings.Add(updated);
            }
            else
            {
                existing.WelcomeTitle = updated.WelcomeTitle;
                existing.WelcomeMessage = updated.WelcomeMessage;
                existing.AboutTitle = updated.AboutTitle;
                existing.AboutMessage = updated.AboutMessage;
                existing.WelcomeImageUrl = updated.WelcomeImageUrl;
                existing.AboutImageUrl1 = updated.AboutImageUrl1;
                existing.AboutImageUrl2 = updated.AboutImageUrl2;

            }

            await _context.SaveChangesAsync();
            return Ok(existing);
        }
    }
}
