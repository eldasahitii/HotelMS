using HotelMS.Data.DTO;
using HotelMS.Data.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HotelMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HotelServiceDetailController : ControllerBase
    {
        private readonly IHotelServiceDetailService _service;

        public HotelServiceDetailController(IHotelServiceDetailService service)
        {
            _service = service;
        }

        [HttpPost("AddHotelServiceDetail")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AddHotelServiceDetail([FromBody] HotelServiceDetailDTO request)
        {
            try
            {
                var result = await _service.AddHotelServiceDetail(request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("GetHotelServiceDetail")]
        [Authorize(Roles = "Admin,ServiceManager,Receptionist")]
        public async Task<IActionResult> GetHotelServiceDetail(int id)
        {
            try
            {
                var result = await _service.GetHotelServiceDetail(id);
                if (result == null)
                    return NotFound();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("GetAllHotelServiceDetails")]
        [Authorize(Roles = "Admin,ServiceManager,Receptionist")]
        public async Task<IActionResult> GetAllHotelServiceDetails()
        {
            try
            {
                var result = await _service.GetAllHotelServiceDetails();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("DeleteHotelServiceDetail")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteHotelServiceDetail(int id)
        {
            try
            {
                await _service.DeleteHotelServiceDetail(id);
                return Ok("Deleted successfully.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("UpdateHotelServiceDetail")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateHotelServiceDetail(int id, [FromBody] HotelServiceDetailDTO request)
        {
            try
            {
                var result = await _service.UpdateHotelServiceDetail(id, request);
                if (result == null)
                    return NotFound();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
