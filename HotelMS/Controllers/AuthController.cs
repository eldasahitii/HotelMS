using HotelMS.Data.DTO;
using HotelMS.Data.Interfaces;
//using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Mvc;


namespace HotelMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _service;

        public AuthController(IAuthService service)
        {
            _service = service;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserRegistrationDTO request)
        {
            try
            {
                var user = await _service.Register(request);
                return Ok(user);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
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
        public async Task<IActionResult> ChangePassword(int UserID,ChangePasswordDTO request)
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
