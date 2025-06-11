using HotelMS.Data.DTO;
using HotelMS.Data.Interfaces;
using HotelMS.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HotelMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
  
    public class CleaningAssignmentController : ControllerBase
    {
        private readonly ICleaningAssignmentService _service;

        public CleaningAssignmentController(ICleaningAssignmentService service)
        {
            _service = service;
        }

        [HttpPost("addAssignment")]
        [Authorize(Roles = "Admin,CleaningManager")]
        public async Task<IActionResult> AddAssignment([FromBody] CleaningAssignmentDTO request)
        {
            try
            {
                var result = await _service.AddAssignment(request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Assignment creation failed: " + ex.Message);
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("getAllAssignments")]
        [Authorize(Roles = "Admin,CleaningManager,CleaningStaff")]
        public async Task<IActionResult> GetAll()
        {
            var result = await _service.GetAllAssignments();
            return Ok(result);
        }

        [HttpPut("updateAssignment")]
        [Authorize(Roles = "Admin,CleaningManager")]
        public async Task<IActionResult> Update(int id, [FromBody] CleaningAssignmentDTO request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            bool result = await _service.UpdateAssignment(id, request);

            if (!result)
                return NotFound($"Assignment with ID {id} not found.");

            return Ok("Assignment updated successfully.");
        }


        [HttpDelete("deleteAssignment")]
        [Authorize(Roles = "Admin,CleaningManager")]
        public async Task<IActionResult> Delete(int id)
        {
            await _service.DeleteAssignment(id);
            return Ok("Deleted successfully");
        }
     
        [HttpPut("startAssignment")]
        [Authorize(Roles = "CleaningStaff")]
        public async Task<IActionResult> StartAssignment([FromQuery] int id)
        {
            var success = await _service.StartAssignment(id);
            if (!success)
                return NotFound("Assignment not found.");

            return Ok("Cleaning started.");
        }

        [HttpPut("markAssignmentCompleted")]
        [Authorize(Roles = "CleaningStaff")]
        public async Task<IActionResult> MarkCompleted([FromQuery] int id)
        {
            var result = await _service.MarkAssignmentCompleted(id);
            return result ? Ok("Marked as completed.") : NotFound("Assignment not found.");
        }

        [HttpPut("cancelAssignment")]
        [Authorize(Roles = "Admin,CleaningManager")]
        public async Task<IActionResult> CancelAssignment(int id)
        {
            try
            {
                var success = await _service.CancelAssignment(id);
                if (!success)
                    return NotFound("Assignment not found.");

                return Ok("Assignment cancelled.");
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpGet("getAssignmentsByStaffName")]
        [Authorize(Roles = "Admin,CleaningManager,CleaningStaff")]
        public async Task<IActionResult> GetAssignmentsByStaffName([FromQuery] string name)
        {
            var result = await _service.GetAssignmentsByStaffName(name);
            return Ok(result);
        }

    }
}
