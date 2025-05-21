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

                string token = await _service.CreateToken(user);

                Response.Cookies.Append("jwt", token, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.Strict,
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
                if (tokens == null)
                    return Unauthorized(new { message = "Invalid credentials" });

                var split = tokens.Split("|||");
                var accessToken = split[0];
                var refreshToken = split[1];

                //  Detect if in development (http) or production (https)
                var isDevelopment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Development";

                // Set access token cookie
                Response.Cookies.Append("jwt", accessToken, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = !isDevelopment, //  Only secure in production
                    SameSite = SameSiteMode.Strict,
                    Expires = DateTime.UtcNow.AddHours(2)
                });

                //  Set refresh token cookie
                Response.Cookies.Append("refresh", refreshToken, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = !isDevelopment, // Only secure in production
                    SameSite = SameSiteMode.Strict,
                    Expires = DateTime.UtcNow.AddDays(7)
                });

                return Ok(new { isLoggedIn = true });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }


        [HttpPost("logout")]
        public IActionResult Logout()
        {
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
            var refreshToken = Request.Cookies["refresh"];
            if (string.IsNullOrEmpty(refreshToken))
                return Unauthorized(new { message = "No refresh token found." });

            var user = await _context.Users.FirstOrDefaultAsync(u => u.RefreshToken == refreshToken);

            if (user == null || user.RefreshTokenExpiry < DateTime.UtcNow)
                return Unauthorized(new { message = "Invalid or expired refresh token." });

            var newAccessToken = await _service.CreateToken(user);

            Response.Cookies.Append("jwt", newAccessToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = !(Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Development"),
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddHours(2)
            });

            return Ok(new { refreshed = true });
        }




    }
}