using HotelMS.Data;
using HotelMS.Data.DTO;
using HotelMS.Data.Interfaces;
using HotelMS.Services;

//using Microsoft.AspNetCore.Components;
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

        //[HttpPost("register")]
        //public async Task<IActionResult> Register(UserRegistrationDTO request)
        //{
        //    try
        //    {
        //        var user = await _service.Register(request);
        //        if (user == null)
        //            return BadRequest(new { message = "User registration failed" });

        //        var token = await _service.CreateToken(user);
        //        return Ok(new { token, isLoggedIn = true });
        //    }
        //    catch (Exception ex)
        //    {
        //        Console.WriteLine(" Registration controller error: " + ex.Message);
        //        return StatusCode(500, new { message = "Registration failed: " + ex.Message });
        //    }
        //}
        [HttpPost("register")]
        public async Task<IActionResult> Register(UserRegistrationDTO request)
        {
            try
            {
                var user = await _service.Register(request);
                if (user == null)
                    return BadRequest(new { message = "User registration failed" });

                string token;
                try
                {
                    token = await _service.CreateToken(user);
                } 
                catch (Exception ex)
                {
                    Console.WriteLine("[Token Creation Failed]: " + ex.ToString());
                    return StatusCode(500, new { message = "Token generation failed" });
                }

                return Ok(new { token, isLoggedIn = true });
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
                var token = await _service.Login(request);
                if (token == null)
                {
                    return Unauthorized();
                }
                return Ok(new { token, isLoggedIn = true });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
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



    }
}