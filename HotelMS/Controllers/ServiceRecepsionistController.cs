using System.Collections.Generic;
using System.Threading.Tasks;
using HotelMS.Data.DTO;
using HotelMS.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace HotelMS.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ServiceRecepsionistController : ControllerBase
    {
        private readonly IServiceRecepsionistService _recepsionistService;

        public ServiceRecepsionistController(IServiceRecepsionistService recepsionistService)
        {
            _recepsionistService = recepsionistService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ServiceRecepsionistDTO>>> GetAll()
        {
            var recepsionists = await _recepsionistService.GetAllRecepsionistsAsync();
            return Ok(recepsionists);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ServiceRecepsionistDTO>> GetById(int id)
        {
            var recepsionist = await _recepsionistService.GetRecepsionistByIdAsync(id);
            if (recepsionist == null)
                return NotFound();
            return Ok(recepsionist);
        }

        [HttpPost]
        public async Task<ActionResult<int>> Create([FromBody] ServiceRecepsionistDTO dto)
        {
            if (dto == null)
                return BadRequest();

            var newId = await _recepsionistService.CreateRecepsionistAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = newId }, newId);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Update(int id, [FromBody] ServiceRecepsionistDTO dto)
        {
            if (dto == null || dto.Id != id)
                return BadRequest();

            var updated = await _recepsionistService.UpdateRecepsionistAsync(dto);
            if (!updated)
                return NotFound();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var deleted = await _recepsionistService.DeleteRecepsionistAsync(id);
            if (!deleted)
                return NotFound();

            return NoContent();
        }
    }
}
