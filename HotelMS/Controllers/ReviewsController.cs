using HotelMS.Data;
using HotelMS.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

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

        // GET: api/reviews
        // GET: api/reviews/GetAll
        [HttpGet("GetAll")]
        public async Task<ActionResult<IEnumerable<Review>>> GetAllReviews()
        {
            return await _context.Reviews
                .Include(r => r.User)
                .Include(r => r.Category) //  Include the ReviewCategory
                .ToListAsync();
        }


        // GET: api/reviews/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Review>> GetReviewById(int id)
        {
            var review = await _context.Reviews.Include(r => r.User).FirstOrDefaultAsync(r => r.ReviewID == id);
            if (review == null)
            {
                return NotFound(); // 404 if not found
            }

            return Ok(review);
        }



        // POST: api/reviews
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<Review>> PostReview(Review review)

        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdClaim))
                return Unauthorized("User ID not found in token.");

            review.UserID = int.Parse(userIdClaim);


            review.Date = DateTime.Now;

            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAllReviews), new { id = review.ReviewID }, review);

        }

        // DELETE: api/reviews/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReview(int id)
        {
            var review = await _context.Reviews.FindAsync(id);
            if (review == null)
            {
                return NotFound(); // 404
            }

            _context.Reviews.Remove(review);
            await _context.SaveChangesAsync();

            return NoContent(); // 204
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

            int userId = int.Parse(userIdClaim.Value);

            var review = await _context.Reviews.FindAsync(updatedReview.ReviewID);
            if (review == null)
            {
                return NotFound("Review not found.");
            }

            if (review.UserID != userId)
            {
                return Forbid("Only the creator of the review can edit it.");
            }

            review.Comment = updatedReview.Comment;
            review.Rating = updatedReview.Rating;
            review.Date = DateTime.Now;

            await _context.SaveChangesAsync();
            return Ok(review);
        }







    }
}

