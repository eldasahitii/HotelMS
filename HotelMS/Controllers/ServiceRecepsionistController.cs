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
    public class ServiceRecepsionistController : ControllerBase
    {
        private readonly IServiceRecepsionistService _service;

        public ServiceRecepsionistController(IServiceRecepsionistService service)
        {
            _service = service;
        }

        [HttpPost("addServiceRecepsionist/{assignedByUserId}")]
        public async Task<IActionResult> AddServiceRecepsionist(int assignedByUserId, [FromBody] ServiceRecepsionistDTO dto)
        {
            try
            {
                var result = await _service.AddRecepsionist(assignedByUserId, dto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                var message = ex.Message;
                var inner = ex.InnerException;
                while (inner != null)
                {
                    message += " --> " + inner.Message;
                    inner = inner.InnerException;
                }
                return BadRequest(message);
            }
        }

        [HttpGet("getServiceRecepsionist/{id}")]
        [Authorize(Roles = "Admin,ServiceManager")]
        public async Task<IActionResult> GetServiceRecepsionist([FromRoute] int id)
        {
            try
            {
                var result = await _service.GetRecepsionistById(id);
                if (result == null)
                    return NotFound();

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("getAllServiceRecepsionists")]
        [Authorize(Roles = "Admin,ServiceManager")]
        public async Task<IActionResult> GetAllServiceRecepsionists()
        {
            try
            {
                var result = await _service.GetAllRecepsionists();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("updateServiceRecepsionist/{id}")]
        [Authorize(Roles = "Admin,ServiceManager")]
        public async Task<IActionResult> UpdateServiceRecepsionist(int id, [FromBody] ServiceRecepsionistDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var existing = await _service.GetRecepsionistById(id);
                if (existing == null)
                    return NotFound();

                var updated = await _service.UpdateRecepsionist(id, dto);
                return Ok(updated);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("deleteServiceRecepsionist/{id}")]
        [Authorize(Roles = "Admin,ServiceManager")]
        public async Task<IActionResult> DeleteServiceRecepsionist([FromRoute] int id)
        {
            try
            {
                await _service.DeleteRecepsionist(id);
                return Ok("Deleted successfully");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
