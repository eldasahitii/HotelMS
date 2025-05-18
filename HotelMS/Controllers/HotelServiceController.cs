//using HotelMS.Data.DTO;
//using HotelMS.Data.Interfaces;
//using HotelMS.Models;
//using HotelMS.Services;
//using Microsoft.AspNetCore.Mvc;



//namespace HotelMS.Controllers
//{
//    [ApiController]
//    [Route("api/[controller]")]

//    public class HotelServiceController : ControllerBase
//    {
//        private readonly IHotelServiceService _service;

//        public HotelServiceController(IHotelServiceService service)
//        {
//            _service = service;
//        }

//        [HttpGet("type/{type}")]
//        public async Task<ActionResult<IEnumerable<HotelService>>> GetServicesByType (string type)
//        {
//            var services = await _service.GetServicesByTypeAsync(type);
//            return Ok(services);
//        }

//        [HttpGet("{id}")]
//        public async Task <ActionResult<HotelService>> GetService (int id)
//        {
//            var service = await _service.GetServiceByIdAsync(id);
//            if (service == null) return NotFound();
//            return Ok(service);
//        }

//        [HttpGet("{id}/schedules")]
//        public async Task<ActionResult<IEnumerable<HotelServiceSchedule>>> GetSchedules (int id)
//        {
//            var schedules = await _service.GetSchedulesByServiceIdAsync(id);
//            return Ok(schedules);
//        }

//        [HttpPost("reserve")]
//        public async Task <ActionResult<HotelServiceReservation>> ReserveService(HotelServiceReservation reservation)
//        {
//            if (!ModelState.IsValid) return BadRequest(ModelState);
//            var created = await _service.ReserveServiceAsync(reservation);
//            return CreatedAtAction(nameof(GetService), new { id = created.HotelServiceId }, created);
//        }

//        [HttpPut("{id}")]
//        public async Task<IActionResult> Update(int id, [FromBody] HotelService updated)
//        {
//            var result = await _service.UpdateServiceAsync(id, updated);
//            if (result == null) return NotFound();
//            return Ok(result);
//        }

//        [HttpDelete("{id}")]
//        public async Task<IActionResult> Delete(int id)
//        {
//            var success = await _service.DeleteServiceAsync(id);
//            if (!success) return NotFound();
//            return NoContent();
//        }



//    }
//}

using HotelMS.Data.DTO;
using HotelMS.Data.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace HotelMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HotelServiceController : ControllerBase
    {
        private readonly IHotelService _service;

        public HotelServiceController(IHotelService service)
        {
            _service = service;
        }

        [HttpPost("AddService")]
        [Authorize(Roles = "Admin,ServiceManager")]
        public async Task<IActionResult> AddService([FromBody] HotelServiceDTO request)
        {
            try
            {
                var result = await _service.AddService(request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("GetService")]
        [Authorize(Roles = "Admin,ServiceManager,ServiceReceptionist")]
        public async Task<IActionResult> GetService(int id)
        {
            try
            {
                var result = await _service.GetService(id);
                if (result == null)
                {
                    return NotFound();
                }
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("GetAllServices")]
        [Authorize(Roles = "Admin,ServiceManager,ServiceReceptionist")]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var result = await _service.GetAllServices();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("DeleteService")]
        [Authorize(Roles = "Admin,ServiceManager")]
        public async Task<IActionResult> DeleteService(int id)
        {
            try
            {
                await _service.DeleteService(id);
                return Ok("Service deleted successfully.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("UpdateService")]
        [Authorize(Roles = "Admin,ServiceManager")]
        public async Task<IActionResult> UpdateService(int id, [FromBody] HotelServiceDTO request)
        {
            try
            {
                var result = await _service.UpdateService(id, request);
                if (result == null)
                {
                    return NotFound("Service not found.");
                }
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}

