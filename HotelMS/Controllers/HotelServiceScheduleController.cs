using HotelMS.Data.DTO;
using HotelMS.Data.Interfaces;
using HotelMS.Models;
using HotelMS.Services;
using Microsoft.AspNetCore.Mvc;

namespace HotelMS.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HotelServiceScheduleController : ControllerBase
    {
        private readonly HotelServiceScheduleService (IHotelServiceScheduleService scheduleService)
        {
            _scheduleService
        }

    }
}
