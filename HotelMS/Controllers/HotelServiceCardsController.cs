
using HotelMS.Data.DTO;
using HotelMS.Data.Interfaces;
using HotelMS.Models;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HotelMS.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HotelServiceCardsController : ControllerBase
    {
        private readonly IHotelServiceCards _service;

        public HotelServiceCardsController(IHotelServiceCards service)
        {
            _service = service;
        }

        [HttpGet("{id}/card-image")]
        public async Task<ActionResult<string>> GetCardImage(int id)
        {
            var result = await _service.GetCardImageAsync(id);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpGet("{id}/card-title")]
        public async Task<ActionResult<string>> GetCardTitle(int id)
        {
            var result = await _service.GetCardTitleAsync(id);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpGet("{id}/card-description")]
        public async Task<ActionResult<string>> GetCardDescription(int id)
        {
            var result = await _service.GetCardDescriptionAsync(id);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpGet("{id}/card-link")]
        public async Task<ActionResult<string>> GetCardLink(int id)
        {
            var result = await _service.GetCardLinkAsync(id);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<HotelServiceCards>>> GetAllCards()
        {
            var result = await _service.GetAllCardsAsync();
            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<HotelServiceCards>> CreateCard([FromBody] HotelServiceCardsDTO data)
        {
            var result = await _service.CreateNewCardAsync(data.CardImage, data.CardTitle, data.CardDescription, data.CardLink);

            return CreatedAtAction(nameof(GetAllCards), new { id = result.Id }, result);
        }


        [HttpPut("{id}/card-data")]
        public async Task<ActionResult<HotelServiceCards>> UpdateCardData(int id, [FromBody] HotelServiceCardsDTO data)
        {
            var result = await _service.UpdateCardDataAsync(id, data.CardImage, data.CardTitle, data.CardDescription, data.CardLink);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCard(int id)
        {
            var success = await _service.DeleteCardAsync(id);
            if (!success) return NotFound();
            return NoContent();
        }

    }
}
