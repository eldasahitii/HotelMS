using HotelMS.Data;
using HotelMS.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using HotelMS.DTO; 


namespace HotelMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewsController : ControllerBase
    {
        private readonly DataContext _context;

        public ReviewsController(DataContext context)
        {
            _context = context;
        }

     
        [HttpGet("GetAll")]
        public async Task<ActionResult<IEnumerable<Review>>> GetAllReviews(
     [FromQuery] int? categoryId,
     [FromQuery] int? minRating,
     [FromQuery] string? search)

        {
            var query = _context.Reviews
                .Include(r => r.User)
                .Include(r => r.Category)
                .Include(r => r.Images)
                .AsQueryable();

            if (categoryId.HasValue)
                query = query.Where(r => r.ReviewCategoryID == categoryId.Value);

            if (minRating.HasValue)
                query = query.Where(r => r.Rating >= minRating.Value);

            if (!string.IsNullOrEmpty(search))
                query = query.Where(r => r.Comment.Contains(search));

            var result = await query.ToListAsync();
            return Ok(result);
        }



     
        [HttpGet("{id}")]
        public async Task<ActionResult<Review>> GetReviewById(int id)
        {
            var review = await _context.Reviews.Include(r => r.User).FirstOrDefaultAsync(r => r.ReviewID == id);
            if (review == null)
            {
                return NotFound(); 
            }

            return Ok(review);
        }



      
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<Review>> PostReview([FromBody] ReviewWithImageDTO dto)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdClaim, out int userId))
                return Unauthorized("Invalid user ID in token.");

            var review = new Review
            {
                UserID = userId,
                Comment = dto.Comment,
                Rating = dto.Rating,
                ReviewCategoryID = dto.ReviewCategoryID,
                Date = DateTime.Now
            };

            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();

            if (!string.IsNullOrWhiteSpace(dto.Base64Image))
            {
                var imageBytes = Convert.FromBase64String(dto.Base64Image);
                var fileName = $"review_{review.ReviewID}_{Guid.NewGuid()}.jpg";
                var folderPath = Path.Combine("wwwroot", "reviewimages");
                Directory.CreateDirectory(folderPath);
                var filePath = Path.Combine(folderPath, fileName);
                await System.IO.File.WriteAllBytesAsync(filePath, imageBytes);

                _context.ReviewImages.Add(new ReviewImage
                {
                    ReviewID = review.ReviewID,
                    ImageUrl = $"/reviewimages/{fileName}"
                });
                await _context.SaveChangesAsync();
            }

            return CreatedAtAction(nameof(GetAllReviews), new { id = review.ReviewID }, review);
        }



     
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReview(int id)
        {
            var review = await _context.Reviews.FindAsync(id);
            if (review == null)
            {
                return NotFound(); 
            }

            _context.Reviews.Remove(review);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        [Authorize]
        [HttpPut("updatereview")]
        public async Task<IActionResult> UpdateReview(Review updatedReview)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized("User ID not found in token.");
            }

          
            if (!int.TryParse(userIdClaim.Value, out int userId))
                return Unauthorized("Invalid user ID in token.");




            var review = await _context.Reviews.FindAsync(updatedReview.ReviewID);
            if (review == null)
            {
                return NotFound("Review not found.");
            }

            if (review.UserID != userId)
            {
                return Forbid(); 
            }

            review.Comment = updatedReview.Comment;
            review.Rating = updatedReview.Rating;
            review.Date = DateTime.Now;

            await _context.SaveChangesAsync();
            return Ok(review);
        }


        [HttpPut("reply/{id}")]
        public async Task<IActionResult> AddManagerReply(int id, [FromBody] ManagerReplyDTO dto)

        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var roleClaim = User.FindFirst("http://schemas.microsoft.com/ws/2008/06/identity/claims/role")?.Value;
            var allowedRoles = new List<string> { "RoomManager", "CleaningManager", "RestaurantManager", "ServiceManager" };

            if (string.IsNullOrEmpty(roleClaim) || !allowedRoles.Contains(roleClaim))
                return Forbid("Only managers can reply to reviews.");




            var review = await _context.Reviews.FindAsync(id);
            if (review == null)
                return NotFound("Review not found.");

            review.ManagerReply = dto.ReplyText;

            review.ReplyDate = DateTime.Now;

            await _context.SaveChangesAsync();
            return Ok(review);
        }

     
        [HttpDelete("deleteimage/{imageId}")]
        public async Task<IActionResult> DeleteImage(int imageId)
        {
            var image = await _context.ReviewImages.FindAsync(imageId);
            if (image == null) return NotFound();

            _context.ReviewImages.Remove(image);
            await _context.SaveChangesAsync();
            return Ok();
        }









    }
}

