using HotelMS.Models;
using HotelMS.Data.DTO;

namespace HotelMS.Data.Interfaces
{
    public interface IHotelServiceReservationService
    {
        Task<IEnumerable<HotelServiceReservation>> GetAllReservationsAsync();
        Task<HotelServiceReservation> GetReservationById(int id);
        Task<HotelServiceReservation> CreateReservationAsync(HotelServiceReservation reservation);
        Task<HotelServiceReservation> UpdateReservationAsync(int id, HotelServiceReservation updatedReservation);
        Task<bool> DeleteReservationAsync(int id);
    }
}
