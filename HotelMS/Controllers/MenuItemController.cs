using HotelMS.Data.DTO;
using HotelMS.Data.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HotelMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MenuItemController : ControllerBase
    {
        private readonly IMenuService _service;
        public MenuItemController(IMenuService service)
        {
            _service = service;
        }

        [HttpPost("addMenuItem")]
        public async Task<IActionResult> AddMenuItem(MenuItemCreateDTO request)
        {
            try
            {
                var item = await _service.AddMenuItem(request);
                return Ok(item);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("getMenuItem")]
        public async Task<IActionResult> GetMenuItem(int id)
        {
            try
            {
                var item = await _service.GetMenuItem(id);
                return Ok(item);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("getAllMenuItems")]
        public async Task<IActionResult> GetAllMenuItems()
        {
            try
            {
                var result = await _service.GetAllMenuItems();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("updateMenuItem")]
        public async Task<IActionResult> UpdateMenuItem(int id, [FromBody] MenuItemCreateDTO request)
        {
            try
            {
                var result = await _service.UpdateMenuItem(id, request);
                if (result == null) return NotFound();
                return Ok(result);
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


    }
}
