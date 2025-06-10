using HotelMS.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HotelMS.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "RestaurantManager,Admin")]
    public class MenuCategoryController : ControllerBase
    {
        private readonly DataContext _context;

        public MenuCategoryController(DataContext context)
        {
            _context = context;
        }

        [HttpGet("getAllCategories")]
        public async Task<IActionResult> GetAllCategories()
        {
            var categories = await _context.MenuCategories
                .Select(c => new
                {
                    c.MenuCategoryID,
                    c.Name
                })
                .ToListAsync();

            return Ok(categories);
        }
    }
}
