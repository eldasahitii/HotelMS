////using HotelMS.Data.DTO;
////using HotelMS.Data.Interfaces;
////using HotelMS.Models;
////using HotelMS.Services;
////using Microsoft.AspNetCore.Mvc;

////namespace HotelMS.Controllers
////{
////    [ApiController]
////    [Route("api/[controller]")]
////    public class HotelServiceScheduleController : ControllerBase
////    {
////        private readonly IHotelServiceScheduleService _scheduleService;

////        public HotelServiceScheduleController (IHotelServiceScheduleService scheduleService)
////        {
////            _scheduleService = scheduleService;
////        }


////        [HttpGet]
////        public async Task<ActionResult<IEnumerable<HotelServiceSchedule>>> GetAll()
////        {
////            var schedules = await _scheduleService.GetAllSchedulesAsync();
////            return Ok(schedules);
////        }

////        [HttpGet("{id}")]
////        public async Task<ActionResult<HotelServiceSchedule>> GetById(int id)
////        {
////            var schedule = await _scheduleService.GetScheduleByIdAsync(id);
////            if (schedule == null) return NotFound();
////            return Ok(schedule);
////        }

////        [HttpPost]
////        public async Task<ActionResult<HotelServiceSchedule>> Create([FromBody] HotelServiceSchedule schedule)
////        {
////            //var Schedule = new HotelServiceSchedule
////            //{
////            //    StartTime = schedule.StartTime,
////            //    EndTime = schedule.EndTime,
////            //    IsAvailable = schedule.IsAvailable
////            //};

////            var createdSchedule = await _scheduleService.CreateScheduleAsync(schedule);
////            return CreatedAtAction(nameof(GetById), new { id = createdSchedule.Id }, createdSchedule);
////        }

////        [HttpDelete("{id}")]
////        public async Task<IActionResult> Delete(int id)
////        {
////            var deleted = await _scheduleService.DeleteScheduleAsync(id);
////            if (!deleted) return NotFound();
////            return NoContent();
////        }


////    }
////}

//using System.Collections.Generic;
//using System.Threading.Tasks;
//using HotelMS.Models.DTOs;
//using HotelMS.Services;
//using Microsoft.AspNetCore.Mvc;

//namespace HotelMS.Controllers
//{
//    [ApiController]
//    [Route("api/[controller]")]
//    public class HotelServiceScheduleController : ControllerBase
//    {
//        private readonly IHotelServiceScheduleService _service;

//        public HotelServiceScheduleController(IHotelServiceScheduleService service)
//        {
//            _service = service;
//        }

//        [HttpGet]
//        public async Task<IEnumerable<HotelServiceScheduleDTO>> GetAll()
//        {
//            return await _service.GetAllAsync();
//        }

//        [HttpGet("{id}")]
//        public async Task<ActionResult<HotelServiceScheduleDTO>> GetById(int id)
//        {
//            var schedule = await _service.GetByIdAsync(id);
//            if (schedule == null) return NotFound();
//            return Ok(schedule);
//        }

//        [HttpPost]
//        public async Task<ActionResult<HotelServiceScheduleDTO>> Create(HotelServiceScheduleCreateUpdateDTO DTO)
//        {
//            //if (DTO.EndTime <= DTO.StartTime)
//            //{
//            //    return BadRequest("End time must be after start time.");
//            //}
//            var created = await _service.CreateAsync(DTO);
//            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
//        }

//        [HttpPut("{id}")]
//        public async Task<IActionResult> Update(int id, HotelServiceScheduleCreateUpdateDTO DTO)
//        {
//            var updated = await _service.UpdateAsync(id, DTO);
//            if (!updated) return NotFound();
//            return NoContent();
//        }

//        [HttpDelete("{id}")]
//        public async Task<IActionResult> Delete(int id)
//        {
//            var deleted = await _service.DeleteAsync(id);
//            if (!deleted) return NotFound();
//            return NoContent();
//        }
//    }
//}

