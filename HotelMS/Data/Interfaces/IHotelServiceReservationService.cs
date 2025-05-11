using HotelMS.Models;
using HotelMS.Data.DTO;

namespace HotelMS.Data.Interfaces
{
    public interface IHotelServiceReservationService
    {
        Task<IEnumerable<HotelServiceReservation>> GetAllReservationAsync();
        Task<HotelServiceReservation> GetReservationById(int id);
        Task<HotelServiceReservation> CreateReservationByIdAsync(HotelServiceReservation reservation);
        Task<HotelServiceReservation> UpdateReservationAsync(int id, HotelServiceReservation updatedReservation);
        Task<bool> DeleteReservationAsync(int id);
    }
}
