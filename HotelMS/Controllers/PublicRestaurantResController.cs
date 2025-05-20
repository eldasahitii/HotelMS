using HotelMS.Data;
using HotelMS.Data.DTO;
using HotelMS.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HotelMS.Controllers
{

    [ApiController]
    [Route("api/[controller]")]

    public class PublicRestaurantResController : ControllerBase
    {
        private readonly DataContext _dbContext;

        public PublicRestaurantResController(DataContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpPost("make")]
        public async Task<IActionResult> MakePublicReservation([FromBody] RestaurantReservationGuestDTO dto)
        {
            try
            {
                var guest = await _dbContext.RestaurantGuests
                    .FirstOrDefaultAsync(g => g.Email == dto.Email);

                if (guest == null)
                {
                    guest = new RestaurantGuest
                    {
                        FirstName = dto.FirstName,
                        LastName = dto.LastName,
                        Email = dto.Email,
                        PhoneNumber = dto.PhoneNumber
                    };

                    _dbContext.RestaurantGuests.Add(guest);
                    await _dbContext.SaveChangesAsync();
                }

                var availableTable = await _dbContext.RestaurantTables
                    .FirstOrDefaultAsync(t => !_dbContext.RestaurantReservations.Any(r => r.RestaurantTableID == t.RestaurantTableID && r.date_time == dto.DateTime));

                if(availableTable == null)
                {
                    return BadRequest("No available tables for the selected time.");
                }

                var reservation = new RestaurantReservation
                {
                    GuestID = guest.GuestID,
                    RestaurantTableID = availableTable.RestaurantTableID,
                    date_time = dto.DateTime,
                    status = "Booked"
                };

                _dbContext.RestaurantReservations.Add(reservation);
                await _dbContext.SaveChangesAsync();

                return Ok("Reservation successfully created!");
            } catch (Exception ex)
            {
                return BadRequest("Something went wrong: " + ex.Message);
            }
        }

    }
}
