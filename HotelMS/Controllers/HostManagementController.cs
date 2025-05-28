using HotelMS.Data.DTO;
using HotelMS.Data.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HotelMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "RestaurantManager")]

    public class HostManagementController : ControllerBase
    {
        private readonly IHostManagementService _service;

        public HostManagementController(IHostManagementService service)
        {
            _service = service;
        }

        [HttpPost("addHost")]
        public async Task<IActionResult> AddHost([FromBody] HostDTO request)
        {
            try
            {
                var result = await _service.CreateHostAsync(request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("assignHostRole")]
        public async Task<IActionResult> AssignHostRole([FromBody] AssignHostDTO dto)
        {
            try
            {
                var result = await _service.AssignHostRoleByEmailAsync(dto.Email);
                if (result == "User not found." || result == "RestaurantHost role not found.")
                    return NotFound(result);
                if (result == "User is already a host.")
                    return BadRequest(result);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }



        [HttpGet("getHost")]
        public async Task<IActionResult> GetHost(int id)
        {
            try
            {
                var result = await _service.GetHostByIdAsync(id);
                if (result == null)
                    return NotFound("Host not found");
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpPut("updateHost")]
        public async Task<IActionResult> UpdateHost(int id, [FromBody] HostDTO hostDto)
        {
            try
            {
                var user = await _service.UpdateHostAsync(id, hostDto);
                if (user == null)
                    return NotFound("Host not found or invalid role.");
                return Ok(user);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("getAllHosts")]
        public async Task<IActionResult> GetAllHosts()
        {
            try
            {
                var result = await _service.GetAllHostsAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("deleteHost/{id}")]
        public async Task<IActionResult> DeleteHost(int id)
        {
            try
            {
                var success = await _service.DeleteHostAsync(id);
                if (!success)
                    return NotFound("Host not found");
                return Ok("Host deleted successfully.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


    }
}
