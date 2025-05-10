using HotelMS.Data.DTO;
using HotelMS.Data.Interfaces;
using HotelMS.Services;
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
        public async Task<IActionResult> GetAll()
        {
            var result = await _service.GetAllAssignments();
            return Ok(result);
        }

        [HttpPut("updateAssignment")]
        public async Task<IActionResult> Update(int id, [FromBody] CleaningAssignmentDTO request)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var result = await _service.UpdateAssignment(id, request);
            return result == null ? NotFound() : Ok(result);
        }

        [HttpDelete("deleteAssignment")]
        public async Task<IActionResult> Delete(int id)
        {
            await _service.DeleteAssignment(id);
            return Ok("Deleted successfully");
        }
        [HttpGet("getAssignmentsForStaff")]
        public async Task<IActionResult> GetAssignmentsForStaff(int staffId)
        {
            var result = await _service.GetAssignmentsForStaff(staffId);
            return Ok(result);
        }
        [HttpPut("startAssignment")]
        public async Task<IActionResult> StartAssignment(int id)
        {
            var success = await _service.StartAssignment(id);
            if (!success)
                return NotFound("Assignment not found.");

            return Ok("Cleaning started.");
        }

        [HttpPut("markAssignmentCompleted")]
        public async Task<IActionResult> MarkCompleted(int id)
        {
            var result = await _service.MarkAssignmentCompleted(id);
            return result ? Ok("Marked as completed.") : NotFound("Assignment not found.");
        }

        [HttpPut("cancelAssignment")]
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
    }
}
