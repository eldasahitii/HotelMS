using HotelMS.Data.DTO;
using HotelMS.Data.Interfaces;
using HotelMS.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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

        [HttpPost("addUser")]
        public async Task<IActionResult> AddUser(UserRegistrationDTO request)
        {
            try
            {
                var result = await _adminService.AddUserWithRole(request);
                if (result.Contains("successfully"))
                    return Ok(new { message = result });

                return BadRequest(new { message = result });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        //[HttpGet("GetManagers")]

        //public async Task<IActionResult> GetManagers()
        //{
        //    try
        //    {
        //        var managers = await _adminService.GetManagers();
        //        return Ok(managers);
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(ex.Message);
        //    }
        //}

        //[HttpGet("GetManagerById")]

        //public async Task<IActionResult> GetManagerByID(int id)
        //{
        //    try
        //    {
        //        var manager = await _adminService.GetManagerByID(id);
        //        if (manager == null)
        //        {
        //            return NotFound(new { message = "Manager not found" });
        //        }
        //        else
        //        {
        //            return Ok(manager);
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(ex.Message);
        //    }
        //}
        //[HttpPut("UpdateManager")]
        //public async Task<IActionResult> UpdateManager(int id, UserDTO request)
        //{
        //    try
        //    {
        //        var updated = await _adminService.UpdateManager(id, request);
        //        if (updated == null)
        //        {
        //            return NotFound(new { message = "Manager not found" });
        //        }
        //        return Ok(updated);
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(ex.Message);
        //    }
        //}

        //[HttpDelete("DeleteManager")]

        //public async Task<IActionResult> DeleteManager(int id)
        //{
        //    try
        //    {
        //        var result = await _adminService.DeleteManager(id);
        //        if (result == "Manager deleted successfully")
        //        {
        //            return Ok(result);
        //        }
        //        else
        //        {
        //            return NotFound(result);
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(ex.Message);
        //    }
        [HttpGet("getUsersByRole")]
        public async Task<IActionResult> GetUsersByRole(string roleType)
        {
            var users = await _adminService.GetUsersByRole(roleType);
            return Ok(users);
        }
        [HttpGet("getUserByRole")]
        public async Task<IActionResult> GetUserByRole(string roleType, int id)
        {
            var user = await _adminService.GetUserByIdAndRole(id, roleType);
            return user == null
                ? NotFound(new { message = $"{roleType} not found" })
                : Ok(user);
        }
        [HttpPut("updateUserByRole")]
        public async Task<IActionResult> UpdateUserByRole(string roleType, int id, UserDTO request)
        {
            var updated = await _adminService.UpdateUserByRole(id, roleType, request);
            return updated == null
                ? NotFound(new { message = $"{roleType} not found" })
                : Ok(updated);
        }

        
        [HttpDelete("deleteUserByRole")]
        public async Task<IActionResult> DeleteUserByRole(string roleType, int id)
        {
            var result = await _adminService.DeleteUserByRole(id, roleType);
            return result.Contains("not found")
                ? NotFound(new { message = result })
                : Ok(new { message = result });
        }
    }
}
