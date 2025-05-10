using HotelMS.Data.DTO;
using HotelMS.Data.Interfaces;
using HotelMS.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HotelMS.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class RestaurantTableController : ControllerBase
    {
        private readonly IRestaurantTableService _service;
        public RestaurantTableController(IRestaurantTableService service)
        {
            _service = service;
        }

        [HttpPost("addTable")]
        public async Task<IActionResult> AddTable(RestaurantTable table)
        {
            try
            {
                var result = await _service.AddTable(table);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("getTable")]
        public async Task<IActionResult> GetTable(int id)
        {
            try
            {
                var result = await _service.GetTable(id);
                if (result == null) return NotFound();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("getAllTables")]
        public async Task<IActionResult> GetAllTables()
        {
            try
            {
                var result = await _service.GetAllTables();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("deleteTable")]
        public async Task<IActionResult> DeleteTable(int id)
        {
            try
            {
                await _service.DeleteTable(id);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("updateTable")]
        public async Task<IActionResult> UpdateTable(int id, [FromBody] RestaurantTable table)
        {
            try
            {
                var result = await _service.UpdateTable(id, table);
                if (result == null) return NotFound();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

    }
}
