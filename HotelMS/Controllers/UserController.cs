using HotelMS.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using HotelMS.DTO;

namespace HotelMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserServices _service;
        public UserController(IUserServices service)
        {
            _service = service;
        }


        //AUTHENTICATION


        [HttpGet]
        //[HttpPost("register")]


        //public async Task<IActionResult> Register(UserRegistrationDTO request)
        public async Task<IActionResult> GetUser(int id)
        {
            try
            {
                //var user = await _service.Register(request);
                //return Ok(user);
                var result = await _service.GetUser(id);
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

        [HttpGet("getAll")]
        //[HttpPost("login")]

        
        //public async Task<IActionResult> Login(UserLoginDTO request)
        public async Task<IActionResult> GetAll()
        {
            try
            {
                //var  = await _service.Login(request);
                //if(token == null)
                //{
                //    return Unauthorized();
                //}
                //return Ok(new { token, isLoggedIn = true });
                var result = await _service.GetAll();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("deleteUser")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var result = _service.DeleteUser(id);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpPut("updateUser")]
        public async Task<IActionResult> Update(int id, [FromBody] UserDTO request)
        {
            try
            {
                var result = _service.UpdateUser(id, request);
                if (result == null)
                    return NotFound();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

    }
}
