using System.Linq.Expressions;
using HotelMS.Data;
using HotelMS.Data.DTO;
using HotelMS.Data.Interfaces;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace HotelMS.Controllers
{
    [ApiController]
    [Route("api/[controller]")]

    public class CleaningStaffController : ControllerBase
    {
        private readonly ICleaningStaffService _service;
        public CleaningStaffController(ICleaningStaffService service)
        {
            _service = service;
        }

        [HttpGet("getCleaningStaff")]
        public async Task<IActionResult> GetCleaningStaff(int id)
        {
            try
            {
                var result = await _service.GetCleaningStaff(id);
                if (result == null) return NotFound();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("getAll")]


        public async Task<IActionResult> GetAll()
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
        public async Task<IActionResult> Update(int id, [FromBody] CleaningStaffDTO dto)
        {
            try
            {
                var result = await _service.UpdateCleaningStaff(id, dto);
                if (result == null) return NotFound();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("deleteCleaningStaff")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var result = _service.DeleteCleaningStaff(id);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}