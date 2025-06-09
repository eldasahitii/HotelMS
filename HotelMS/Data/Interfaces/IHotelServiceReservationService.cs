using System.Collections.Generic;
using System.Threading.Tasks;
using HotelMS.Data.DTO;

namespace HotelMS.Services.Interfaces
{
    public interface IHotelServiceReservationService
    {
        Task<IEnumerable<HotelServiceReservationDTO>> GetAllReservationsAsync();
        Task<HotelServiceReservationDTO?> GetReservationByIdAsync(int reservationId);
        Task<int> CreateReservationAsync(HotelServiceReservationDTO reservationDto);
        Task<bool> UpdateReservationAsync(HotelServiceReservationDTO reservationDto);
        Task<bool> DeleteReservationAsync(int reservationId);
    }
}
