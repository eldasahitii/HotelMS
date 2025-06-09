//using HotelMS.Data.Interfaces;
//using HotelMS.Models;
//using Microsoft.AspNetCore.Mvc;

//namespace HotelMS.Controllers
//{
//    [ApiController]
//    [Route("api/[controller]")]
//    public class HotelServiceCardsController : ControllerBase
//    {
//        private readonly IHotelServiceCards _service;

//        public HotelServiceCardsController(IHotelServiceCards service)
//        {
//            _service = service;
//        }

//        // ========== Card Image ==========

//        [HttpGet("{id}/card-image")]
//        public async Task<ActionResult<string>> GetCardImage(int id)
//        {
//            var result = await _service.GetCardImageAsync(id);
//            if (result == null) return NotFound();
//            return Ok(result);
//        }

//        [HttpPost("{id}/card-image")]
//        public async Task<ActionResult<HotelServiceCards>> AddCardImage(int id, [FromBody] string imageUrl)
//        {
//            var result = await _service.AddCardImageAsync(id, imageUrl);
//            if (result == null) return NotFound();
//            return CreatedAtAction(nameof(GetCardImage), new { id = result.Id }, result);
//        }

//        [HttpPut("{id}/card-image")]
//        public async Task<ActionResult<HotelServiceCards>> UpdateCardImage(int id, [FromBody] string imageUrl)
//        {
//            var result = await _service.UpdateCardImageAsync(id, imageUrl);
//            if (result == null) return NotFound();
//            return Ok(result);
//        }

//        [HttpDelete("{id}/card-image")]
//        public async Task<IActionResult> DeleteCardImage(int id)
//        {
//            var success = await _service.DeleteCardImageAsync(id);
//            if (!success) return NotFound();
//            return NoContent();
//        }

//        // ========== Card Title ==========

//        [HttpGet("{id}/card-title")]
//        public async Task<ActionResult<string>> GetCardTitle(int id)
//        {
//            var result = await _service.GetCardTitleAsync(id);
//            if (result == null) return NotFound();
//            return Ok(result);
//        }

//        [HttpPost("{id}/card-title")]
//        public async Task<ActionResult<HotelServiceCards>> AddCardTitle(int id, [FromBody] string title)
//        {
//            var result = await _service.AddCardTitleAsync(id, title);
//            if (result == null) return NotFound();
//            return CreatedAtAction(nameof(GetCardTitle), new { id = result.Id }, result);
//        }

//        [HttpPut("{id}/card-title")]
//        public async Task<ActionResult<HotelServiceCards>> UpdateCardTitle(int id, [FromBody] string title)
//        {
//            var result = await _service.UpdateCardTitleAsync(id, title);
//            if (result == null) return NotFound();
//            return Ok(result);
//        }

//        [HttpDelete("{id}/card-title")]
//        public async Task<IActionResult> DeleteCardTitle(int id)
//        {
//            var success = await _service.DeleteCardTitleAsync(id);
//            if (!success) return NotFound();
//            return NoContent();
//        }

//        // ========== Card Description ==========

//        [HttpGet("{id}/card-description")]
//        public async Task<ActionResult<string>> GetCardDescription(int id)
//        {
//            var result = await _service.GetCardDescriptionAsync(id);
//            if (result == null) return NotFound();
//            return Ok(result);
//        }

//        [HttpPost("{id}/card-description")]
//        public async Task<ActionResult<HotelServiceCards>> AddCardDescription(int id, [FromBody] string description)
//        {
//            var result = await _service.AddCardDescriptionAsync(id, description);
//            if (result == null) return NotFound();
//            return CreatedAtAction(nameof(GetCardDescription), new { id = result.Id }, result);
//        }

//        [HttpPut("{id}/card-description")]
//        public async Task<ActionResult<HotelServiceCards>> UpdateCardDescription(int id, [FromBody] string description)
//        {
//            var result = await _service.UpdateCardDescriptionAsync(id, description);
//            if (result == null) return NotFound();
//            return Ok(result);
//        }

//        [HttpDelete("{id}/card-description")]
//        public async Task<IActionResult> DeleteCardDescription(int id)
//        {
//            var success = await _service.DeleteCardDescriptionAsync(id);
//            if (!success) return NotFound();
//            return NoContent();
//        }

//        // ========== Card Link ==========

//        [HttpGet("{id}/card-link")]
//        public async Task<ActionResult<string>> GetCardLink(int id)
//        {
//            var result = await _service.GetCardLinkAsync(id);
//            if (result == null) return NotFound();
//            return Ok(result);
//        }

//        [HttpPost("{id}/card-link")]
//        public async Task<ActionResult<HotelServiceCards>> AddCardLink(int id, [FromBody] string link)
//        {
//            var result = await _service.AddCardLinkAsync(id, link);
//            if (result == null) return NotFound();
//            return CreatedAtAction(nameof(GetCardLink), new { id = result.Id }, result);
//        }

//        [HttpPut("{id}/card-link")]
//        public async Task<ActionResult<HotelServiceCards>> UpdateCardLink(int id, [FromBody] string link)
//        {
//            var result = await _service.UpdateCardLinkAsync(id, link);
//            if (result == null) return NotFound();
//            return Ok(result);
//        }

//        [HttpDelete("{id}/card-link")]
//        public async Task<IActionResult> DeleteCardLink(int id)
//        {
//            var success = await _service.DeleteCardLinkAsync(id);
//            if (!success) return NotFound();
//            return NoContent();
//        }

//        // ========== Get All Cards ==========

//        [HttpGet("all")]
//        public async Task<ActionResult<IEnumerable<HotelServiceCards>>> GetAllCards()
//        {
//            var result = await _service.GetAllCardsAsync();
//            return Ok(result);
//        }
//    }
//}
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

        // ========== GET methods ==========

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

        // ========== POST: Add Card Data ==========

        [HttpPost("{id}/card-data")]
        public async Task<ActionResult<HotelServiceCards>> AddCardData(int id, [FromBody] HotelServiceCardsDTO data)
        {
            var result = await _service.AddCardDataAsync(id, data.CardImage, data.CardTitle, data.CardDescription, data.CardLink);
            if (result == null) return NotFound();
            return CreatedAtAction(nameof(GetAllCards), new { id = result.Id }, result);
        }

        // ========== PUT: Update Card Data ==========

        [HttpPut("{id}/card-data")]
        public async Task<ActionResult<HotelServiceCards>> UpdateCardData(int id, [FromBody] HotelServiceCardsDTO data)
        {
            var result = await _service.UpdateCardDataAsync(id, data.CardImage, data.CardTitle, data.CardDescription, data.CardLink);
            if (result == null) return NotFound();
            return Ok(result);
        }

        // ========== DELETE: Specific Card Fields ==========

        [HttpDelete("{id}/card-data")]
        public async Task<IActionResult> DeleteCardData(
            int id,
            [FromQuery] bool deleteImage = false,
            [FromQuery] bool deleteTitle = false,
            [FromQuery] bool deleteDescription = false,
            [FromQuery] bool deleteLink = false)
        {
            var success = await _service.DeleteCardDataAsync(id, deleteImage, deleteTitle, deleteDescription, deleteLink);
            if (!success) return NotFound();
            return NoContent();
        }
    }
}
