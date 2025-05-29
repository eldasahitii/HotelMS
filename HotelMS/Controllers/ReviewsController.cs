using HotelMS.Data;
using HotelMS.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using HotelMS.DTO; // or HotelMS.DTOs, depending on your folder's namespace


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
        public async Task<ActionResult<Review>> PostReview([FromBody] Review review) // ✅ Add [FromBody]
        {
            // ✅ This returns helpful validation errors instead of generic 400
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdClaim))
                return Unauthorized("User ID not found in token.");

            //  review.UserID = int.Parse(userIdClaim);
            if (!int.TryParse(userIdClaim, out int userId))
                return Unauthorized("Invalid user ID in token.");

            review.UserID = userId; // ✅ safe assignment


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

            //int userId = int.Parse(userIdClaim.Value);
            if (!int.TryParse(userIdClaim.Value, out int userId))
                return Unauthorized("Invalid user ID in token.");




            var review = await _context.Reviews.FindAsync(updatedReview.ReviewID);
            if (review == null)
            {
                return NotFound("Review not found.");
            }

            if (review.UserID != userId)
            {
                return Forbid(); // ❗Don't pass a string here
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








    }
}

