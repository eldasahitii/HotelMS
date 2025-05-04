using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using HotelMS.Data.DTO;
using HotelMS.Data.Interfaces;

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


        [HttpGet]


        public async Task<IActionResult> GetUser(int id)
        {
            try
            {
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


        public async Task<IActionResult> GetAll()
        {
            try
            {
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