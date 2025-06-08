using System.Collections.Generic;
using System.Threading.Tasks;
using HotelMS.Data.DTO;
using HotelMS.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HotelMS.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ServiceReservationStatusController : ControllerBase
    {
        private readonly IServiceReservationStatusService _statusService;

        public ServiceReservationStatusController(IServiceReservationStatusService statusService)
        {
            _statusService = statusService;
        }

        [HttpGet]
        [Authorize(Roles = "Admin, ServiceRecepsionist")]
        public async Task<ActionResult<IEnumerable<ServiceReservationStatusDTO>>> GetAll()
        {
            var statuses = await _statusService.GetAllStatusesAsync();
            return Ok(statuses);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin, ServiceRecepsionist")]
        public async Task<ActionResult<ServiceReservationStatusDTO>> GetById(int id)
        {
            var status = await _statusService.GetStatusByIdAsync(id);
            if (status == null)
                return NotFound();
            return Ok(status);
        }

        [HttpPost]
        [Authorize(Roles = "Admin, ServiceRecepsionist")]
        public async Task<ActionResult<int>> Create([FromBody] ServiceReservationStatusDTO dto)
        {
            if (dto == null)
                return BadRequest();

            var newId = await _statusService.CreateStatusAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = newId }, newId);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin, ServiceRecepsionist")]
        public async Task<ActionResult> Update(int id, [FromBody] ServiceReservationStatusDTO dto)
        {
            if (dto == null || dto.Id != id)
                return BadRequest();

            var updated = await _statusService.UpdateStatusAsync(dto);
            if (!updated)
                return NotFound();

            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin, ServiceRecepsionist")]
        public async Task<ActionResult> Delete(int id)
        {
            var deleted = await _statusService.DeleteStatusAsync(id);
            if (!deleted)
                return NotFound();

            return NoContent();
        }
    }
}
