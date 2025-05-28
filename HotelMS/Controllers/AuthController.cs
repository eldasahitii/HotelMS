using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using Azure.Core;
using Azure;
using HotelMS.Data;
using HotelMS.Data.DTO;
using HotelMS.Data.Interfaces;
using HotelMS.Services;

//using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;
using Microsoft.AspNetCore.Authorization;


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
                    SameSite = SameSiteMode.None,//Required for cookies to be sent across different ports (React on 3000, API on 7117) or domains.
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
                    Expires = DateTime.UtcNow.AddHours(2)
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
                // Specific errors like: email doesn't exist / wrong password
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                // For unexpected internal errors
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
                {
                    return NotFound();
                }
                else
                {
                    return Ok(result);
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpGet("me")]
        [Authorize]
        public IActionResult Me()
        {
            try
            {
                var token = Request.Cookies["jwt"];
                if (string.IsNullOrEmpty(token)) return Unauthorized(new { message = "No token provided" });

                var handler = new JwtSecurityTokenHandler();
                var jwtToken = handler.ReadJwtToken(token);

                var userId = jwtToken.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
                var role = jwtToken.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role)?.Value;

                if (userId == null || role == null)
                    return Unauthorized(new { message = "Invalid token" });

                return Ok(new
                {
                    userId,
                    role
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to read user info", error = ex.Message });
            }
        }
        [HttpPost("refresh")]
        public async Task<IActionResult> RefreshToken()
        {
            var oldRefreshToken = Request.Cookies["refresh"];
            if (string.IsNullOrEmpty(oldRefreshToken))
                return Unauthorized(new { message = "No refresh token found." });

            var user = await _context.Users.FirstOrDefaultAsync(u => u.RefreshToken == oldRefreshToken);
            if (user == null || user.RefreshTokenExpiry < DateTime.UtcNow)
                return Unauthorized(new { message = "Invalid or expired refresh token." });

            //  ROTATE refresh token
            var newRefreshToken = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));
            user.RefreshToken = newRefreshToken;
            user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(7);
            await _context.SaveChangesAsync();

            var newAccessToken = await _service.CreateToken(user);

            //  Set new cookies
            Response.Cookies.Append("jwt", newAccessToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTime.UtcNow.AddMinutes(15)
            });

            Response.Cookies.Append("refresh", newRefreshToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTime.UtcNow.AddDays(7)
            });

            return Ok(new { refreshed = true });
        }



    }
}