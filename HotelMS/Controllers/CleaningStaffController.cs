using HotelMS.Data;
using Microsoft.AspNetCore.Mvc;

namespace HotelMS.Controllers
{
    [ApiController]
    [Route("api/[controller]")]

    public class CleaningStaffController : ControllerBase
    {
        private readonly DataContext _context;
        public CleaningStaffController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult>
    }
    }
