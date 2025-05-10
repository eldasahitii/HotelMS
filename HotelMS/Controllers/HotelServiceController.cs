using HotelMS.Data.DTO;
using HotelMS.Data.Interfaces;
using HotelMS.Models;
using HotelMS.Services;
using Microsoft.AspNetCore.Mvc;


namespace HotelMS.Controllers
{
    [ApiController]
    [Route("api/[controller]")]

    public class HotelServiceController : ControllerBase
    {
        private readonly HotelServiceService _service;

        public HotelServiceController(HotelServiceService service)
        {
            _service = service;
        }

        [HttpGet("type/{type}")]
        public async Task<ActionResult<IEnumerable<HotelService>>> GetServicesByType (string type)
        {
            var services = await _service.GetServicesByTypeAsync(type);
            return Ok(services);
        }

        [HttpGet("{id}")]
        public async Task <ActionResult<HotelService>> GetService (int id)
        {
            var service = await _service.GetServiceByIdAsync(id);
            if (service == null) return NotFound();
            return Ok(service);
        }

        [HttpGet("{id}/schedules")]
        public async Task<ActionResult<IEnumerable<HotelServiceSchedule>>> GetSchedules (int id)
        {
            var schedules = await _service.GetSchedulesByServiceIdAsync(id);
            return Ok(schedules);
        }

        [HttpPost("reserve")]
        public async Task <ActionResult<HotelServiceReservation>> ReserveService(HotelServiceReservation reservation)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var created = await _service.ReserveServiceAsync(reservation);
            return CreatedAtAction(nameof(GetService), new { id = created.HotelServiceId }, created);
        }


    }
}


