using HotelMS.Data.DTO;
using HotelMS.Data.Interfaces;
using HotelMS.Models;
using HotelMS.Services;
using Microsoft.AspNetCore.Mvc;



namespace HotelMS.Controllers
{
    [ApiController]
    [Route("api/[controller]")]

    public class HotelServiceController : ControllerBase
    {
        private readonly IHotelServiceService _service;

        public HotelServiceController(IHotelServiceService service)
        {
            _service = service;
        }

        
        [HttpGet("{id}/hero-image")]
        public async Task<ActionResult<string>> GetHeroImage(int id)
        {
            var result = await _service.GetHeroImageAsync(id);
            if (result == null) return NotFound();
            return Ok(result);
        }

        
        [HttpPost("{id}/hero-image")]
        public async Task<ActionResult<HotelService>> AddHeroImage(int id, [FromBody] string imageUrl)
        {
            var result = await _service.AddHeroImageAsync(id, imageUrl);
            if (result == null) return NotFound();
            return CreatedAtAction(nameof(GetHeroImage), new { id = result.Id }, result);
        }

        
        [HttpPut("{id}/hero-image")]
        public async Task<ActionResult<HotelService>> UpdateHeroImage(int id, [FromBody] string imageUrl)
        {
            var result = await _service.UpdateHeroImageAsync(id, imageUrl);
            if (result == null) return NotFound();
            return Ok(result);
        }

        
        [HttpGet("{id}/hero-title")]
        public async Task<ActionResult<string>> GetHeroTitle(int id)
        {
            var result = await _service.GetHeroTitleAsync(id);
            if (result == null) return NotFound();
            return Ok(result);
        }

        
        [HttpPost("{id}/hero-title")]
        public async Task<ActionResult<HotelService>> AddHeroTitle(int id, [FromBody] string title)
        {
            var result = await _service.AddHeroTitleAsync(id, title);
            if (result == null) return NotFound();
            return CreatedAtAction(nameof(GetHeroTitle), new { id = result.Id }, result);
        }

       
        [HttpPut("{id}/hero-title")]
        public async Task<ActionResult<HotelService>> UpdateHeroTitle(int id, [FromBody] string title)
        {
            var result = await _service.UpdateHeroTitleAsync(id, title);
            if (result == null) return NotFound();
            return Ok(result);
        }

        
        [HttpGet("{id}/hero-description")]
        public async Task<ActionResult<string>> GetHeroDescription(int id)
        {
            var result = await _service.GetHeroDescriptionAsync(id);
            if (result == null) return NotFound();
            return Ok(result);
        }

      
        [HttpPost("{id}/hero-description")]
        public async Task<ActionResult<HotelService>> AddHeroDescription(int id, [FromBody] string description)
        {
            var result = await _service.AddHeroDescriptionAsync(id, description);
            if (result == null) return NotFound();
            return CreatedAtAction(nameof(GetHeroDescription), new { id = result.Id }, result);
        }

        
        [HttpPut("{id}/hero-description")]
        public async Task<ActionResult<HotelService>> UpdateHeroDescription(int id, [FromBody] string description)
        {
            var result = await _service.UpdateHeroDescriptionAsync(id, description);
            if (result == null) return NotFound();
            return Ok(result);
        }
    }
}


