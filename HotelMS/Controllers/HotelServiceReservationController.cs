using HotelMS.Data.DTO;
using HotelMS.Data.Interfaces;
using HotelMS.Models;
using HotelMS.Services;
using Microsoft.AspNetCore.Mvc;

namespace HotelMS.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HotelServiceReservationController : ControllerBase
    {
        private readonly IHotelServiceReservationService _reservationService;

        public HotelServiceReservationController (IHotelServiceReservationService reservationService )
        {
            _reservationService = reservationService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<HotelServiceReservation>>> GetAllReservations()
        {
            var reservations = await _reservationService.GetAllReservationsAsync();
            return Ok(reservations);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<HotelServiceReservation>> GetReservation(int id)
        {
            var reservation = await _reservationService.GetReservationByIdAsync(id);
            if (reservation == null)
                return NotFound();

            return Ok(reservation);
        }

        [HttpPost]
        public async Task<ActionResult<HotelServiceReservation>> CreateReservation(HotelServiceReservation reservation)
        {
            var created = await _reservationService.CreateReservationAsync(reservation);
            return CreatedAtAction(nameof(GetReservation), new { id = created.Id }, created);
        }

        //[HttpPost]
        //public async Task<ActionResult<HotelServiceReservation>> CreateReservation(HotelServiceReservationDTO dto)
        //{
        //    var reservation = new HotelServiceReservation
        //    {
        //        UserId = dto.UserId,
        //        HotelServiceId = dto.HotelServiceId,
        //        ScheduleId = dto.ScheduleId,
        //        ReservationTime = dto.ReservationTime,
        //        Status = dto.Status
        //    };

        //    var created = await _reservationService.CreateReservationAsync(reservation);
        //    return CreatedAtAction(nameof(GetReservation), new { id = created.Id }, created);
        //}



        [HttpPut("{id}")]
        public async Task<ActionResult<HotelServiceReservation>> UpdateReservation(int id, HotelServiceReservation updatedReservation)
        {
            var result = await _reservationService.UpdateReservationAsync(id, updatedReservation);
            if (result == null)
                return NotFound();

            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReservation(int id)
        {
            var success = await _reservationService.DeleteReservationAsync(id);
            if (!success)
                return NotFound();

            return NoContent();
        }


    }
}
