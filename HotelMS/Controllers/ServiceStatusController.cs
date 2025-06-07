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
    public class ServiceStatusController : ControllerBase
    {
        private readonly IServiceStatusService _service;

        public ServiceStatusController(IServiceStatusService service)
        {
            _service = service;
        }

        [HttpPost("addServiceStatus")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AddServiceStatus([FromBody] ServiceStatusDTO request)
        {
            try
            {
                var result = await _service.AddServiceStatus(request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("getServiceStatus")]
        [Authorize(Roles = "Admin,ServiceManager,ServiceReceptionist")]
        public async Task<IActionResult> GetServiceStatus(int id)
        {
            try
            {
                var result = await _service.GetServiceStatus(id);
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

        [HttpGet("getAllServiceStatuses")]
        [Authorize(Roles = "Admin,ServiceManager,ServiceReceptionist")]
        public async Task<IActionResult> GetAllServiceStatuses()
        {
            try
            {
                var result = await _service.GetAllServiceStatus();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("deleteServiceStatus")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteServiceStatus(int id)
        {
            try
            {
                await _service.DeleteServiceStatus(id);
                return Ok("Deleted successfully");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("updateServiceStatus")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateServiceStatus(int id, [FromBody] ServiceStatusDTO request)
        {
            try
            {
                var result = await _service.UpdateServiceStatus(id, request);
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
