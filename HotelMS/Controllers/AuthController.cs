using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using HotelMS.Data;
using HotelMS.Data.DTO;
using HotelMS.Data.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HotelMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _service;
        private readonly DataContext _context;

        public AuthController(IAuthService service, DataContext context)
        {
            _service = service;
            _context = context;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserRegistrationDTO request)
        {
            try
            {
                var user = await _service.Register(request);
                if (user == null)
                    return BadRequest(new { message = "User registration failed" });

                var token = await _service.CreateToken(user);

                Response.Cookies.Append("jwt", token, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.None,
                    Expires = DateTime.UtcNow.AddHours(2)
                });

                return Ok(new { isLoggedIn = true });
            }
            catch (Exception ex)
            {
                Console.WriteLine("[Register Controller Error]: " + ex.ToString());
                return StatusCode(500, new { message = "Registration failed: " + ex.Message });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(UserLoginDTO request)
        {
            try
            {
                var tokens = await _service.Login(request);
                var split = tokens.Split("|||");
                var accessToken = split[0];
                var refreshToken = split[1];

                Response.Cookies.Append("jwt", accessToken, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.None,
                    Expires = DateTime.UtcNow.AddMinutes(30)
                });

                Response.Cookies.Append("refresh", refreshToken, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.None,
                    Expires = DateTime.UtcNow.AddDays(7)
                });

                return Ok(new { isLoggedIn = true });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception)
            {
                return StatusCode(500, new { message = "An internal server error occurred." });
            }
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            var refreshToken = Request.Cookies["refresh"];
            if (!string.IsNullOrEmpty(refreshToken))
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.RefreshToken == refreshToken);
                if (user != null)
                {
                    user.RefreshToken = null;
                    user.RefreshTokenExpiry = null;
                    await _context.SaveChangesAsync();
                }
            }

            Response.Cookies.Delete("jwt");
            Response.Cookies.Delete("refresh");

            return Ok(new { message = "Logged out successfully." });
        }

        [HttpPost("changePassword")]
        public async Task<IActionResult> ChangePassword(int UserID, ChangePasswordDTO request)
        {
            try
            {
                var result = await _service.ChangePassword(UserID, request);
                if (result == null)
                    return NotFound();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> Me()
        {
            try
            {
                var jwt = Request.Cookies["jwt"];
                if (string.IsNullOrEmpty(jwt))
                    return Unauthorized(new { message = "JWT not found" });

                var handler = new JwtSecurityTokenHandler();
                var token = handler.ReadJwtToken(jwt);

                var userId = token.Claims.First(c => c.Type == ClaimTypes.NameIdentifier).Value;
                var email = token.Claims.First(c => c.Type == ClaimTypes.Email).Value;
                var role = token.Claims.First(c => c.Type == ClaimTypes.Role).Value;

                var user = await _context.Users.FindAsync(int.Parse(userId));
                var fullName = $"{user.FirstName} {user.LastName}";

                return Ok(new
                {
                    userID = userId,
                    email,
                    role,
                    userName = fullName
                });
            }
            catch
            {
                return Unauthorized(new { message = "Invalid token or user not found" });
            }
        }
        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh()
        {
            var oldRefreshToken = Request.Cookies["refresh"];
            if (string.IsNullOrEmpty(oldRefreshToken))
                return Unauthorized(new { message = "Refresh token not found" });

            var (newAccessToken, newRefreshToken) = await _service.RotateRefreshToken(oldRefreshToken);
            if (newAccessToken == null || newRefreshToken == null)
                return Unauthorized(new { message = "Refresh token is invalid or expired" });

            Response.Cookies.Append("jwt", newAccessToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTime.UtcNow.AddMinutes(30)
            });

            Response.Cookies.Append("refresh", newRefreshToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTime.UtcNow.AddDays(7)
            });

            return Ok(new { message = "Token refreshed successfully" });
        }

    }
}
