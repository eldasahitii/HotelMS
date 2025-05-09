using HotelMS.Data.DTO;
using HotelMS.Data.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HotelMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminController:ControllerBase
    {
        private readonly IAdminService _adminService;

        public AdminController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        [HttpPost("AddManager")]
        public async Task<IActionResult> AddManager(UserRegistrationDTO request)
        {
            try
            {
                var result = await _adminService.AddManager(request);
                if (result == "Manager added successfully")
                {
                    return Ok(new { message = result });
                }
                else
                {
                    return BadRequest(new { message = result });
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("GetManagers")]

        public async Task<IActionResult> GetManagers()
        {
            try
            {
                var managers = await _adminService.GetManagers();
                return Ok(managers);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("GetManagerById")]

        public async Task<IActionResult> GetManagerByID(int id)
        {
            try
            {
                var manager = await _adminService.GetManagerByID(id);
                if (manager == null)
                {
                    return NotFound(new { message = "Manager not found" });
                }
                else
                {
                    return Ok(manager);
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpPut("UpdateManager")]
        public async Task<IActionResult> UpdateManager(int id, UserDTO request)
        {
            try
            {
                var updated = await _adminService.UpdateManager(id, request);
                if (updated == null)
                {
                    return NotFound(new { message = "Manager not found" });
                }
                return Ok(updated);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("DeleteManager")]

        public async Task<IActionResult> DeleteManager(int id)
        {
            try
            {
                var result = await _adminService.DeleteManager(id);
                if (result == "Manager deleted successfully")
                {
                    return Ok(result);
                }
                else
                {
                    return NotFound(result);
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
