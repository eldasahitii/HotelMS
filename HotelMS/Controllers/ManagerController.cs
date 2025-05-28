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
    public class ManagerController : ControllerBase
    {
        private readonly IManagerService _service;

        public ManagerController(IManagerService service)
        {
            _service = service;
        }

        [HttpPost("AddManager")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AddManager([FromBody] ManagerDTO request)
        {
            try
            {
                var result = await _service.CreateManager(request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("GetManagerById")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetManagerById(int id)
        {
            try
            {
                var result = await _service.GetManagerById(id);
                if (result == null)
                    return NotFound();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("GetAllManagers")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllManagers()
        {
            try
            {
                var result = await _service.GetAllManagers();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("UpdateManager/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateManager(int id, [FromBody] ManagerDTO request)
        {
            try
            {
                var result = await _service.UpdateManager(id, request);
                if (result == null)
                    return NotFound();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("DeleteManager/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteManager(int id)
        {
            try
            {
                var result = await _service.DeleteManager(id);
                if (result == null)
                    return NotFound();
                return Ok(new { message = $"Manager with ID {id} deleted successfully." });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("GetManagerTypes")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetManagerTypes()
        {
            try
            {
                var result = await _service.GetManagerTypes();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
