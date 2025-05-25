using HotelMS.Data;
using HotelMS.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HotelMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewImagesController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly IWebHostEnvironment _environment;

        public ReviewImagesController(DataContext context, IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }

        // POST: api/reviewimages/upload
        [HttpPost("upload")]
        public async Task<IActionResult> UploadImage([FromForm] int reviewID, [FromForm] IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
            var filePath = Path.Combine(_environment.WebRootPath, "uploads", fileName);

            // Ensure uploads folder exists
            Directory.CreateDirectory(Path.GetDirectoryName(filePath));

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var image = new ReviewImage
            {
                ReviewID = reviewID,
                ImageUrl = "/uploads/" + fileName
            };

            _context.ReviewImages.Add(image);
            await _context.SaveChangesAsync();

            return Ok(image);
        }

        // GET: api/reviewimages/byreview/5
        [HttpGet("byreview/{reviewID}")]
        public async Task<IActionResult> GetImagesByReview(int reviewID)
        {
            var images = await _context.ReviewImages
                .Where(i => i.ReviewID == reviewID)
                .ToListAsync();

            return Ok(images);
        }
    }
}
