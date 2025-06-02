using HotelMS.Data.DTO;
using HotelMS.Data.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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

        [HttpPost("add")]
        [Authorize(Roles = "Admin, ServiceManager")]
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

        [HttpGet("get")]
        [Authorize(Roles = "Admin,ServiceManager")]
        public async Task<IActionResult> GetService([FromQuery] int id)
        {
            try
            {
                var result = await _service.GetService(id);
                if (result == null) return NotFound();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("getAll")]
        [Authorize(Roles = "Admin,ServiceManager")]
        public async Task<IActionResult> GetAllServices()
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

        //[HttpDelete("delete")]
        //[Authorize(Roles = "Admin, ServiceManager")]
        //public async Task<IActionResult> DeleteService([FromQuery] int id)
        //{
        //    try
        //    {
        //        await _service.DeleteService(id);
        //        return Ok(new { message = "Service deleted successfully." });
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(ex.Message);
        //    }
        //}
        [HttpDelete("delete")]
        [Authorize(Roles = "Admin, ServiceManager")]
        public async Task<IActionResult> DeleteService([FromQuery] int id)
        {
            try
            {
                var existing = await _service.GetService(id);
                if (existing == null)
                    return NotFound(new { message = "Service not found." });

                await _service.DeleteService(id);
                return Ok(new { message = "Service deleted successfully." });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("update")]
        [Authorize(Roles = "Admin, ServiceManager")]
        public async Task<IActionResult> UpdateService(int id, [FromBody] HotelServiceDTO request)
        {
            try
            {
                var result = await _service.UpdateService(id, request);
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
    }
}