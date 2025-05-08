using HotelMS.Data.DTO;
using HotelMS.Data.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace HotelMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CleaningStaffController : ControllerBase
    {
        private readonly ICleaningStaffService _service;

        public CleaningStaffController(ICleaningStaffService service)
        {
            _service = service;
        }

        [HttpPost("addCleaningStaff")]
        public async Task<IActionResult> AddCleaningStaff([FromBody] CleaningStaffDTO request)
        {
            try
            {
                var result = await _service.AddCleaningStaff(request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("getCleaningStaff")]
        public async Task<IActionResult> GetCleaningStaff(int id)
        {
            try
            {
                var result = await _service.GetCleaningStaff(id);
                if (result == null)
                    return NotFound();

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("getAllCleaningStaff")]
        public async Task<IActionResult> GetAllCleaningStaff()
        {
            try
            {
                var result = await _service.GetAllCleaningStaff();
                return Ok(result); 
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpPut("updateCleaningStaff")]
        public async Task<IActionResult> UpdateCleaningStaff(int id, [FromBody] CleaningStaffDTO request)
        {
            try
            {
                var result = await _service.UpdateCleaningStaff(id, request);
                if (result == null)
                    return NotFound("Cleaning staff not found.");

                return Ok(result); 
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("deleteCleaningStaff")]
        public async Task<IActionResult> DeleteCleaningStaff(int id)
        {
            try
            {
                await _service.DeleteCleaningStaff(id);
               
                return Ok("Deleted successfully");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }
   
    } 
}