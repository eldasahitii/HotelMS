using HotelMS.Data.DTO;
using HotelMS.Models;

namespace HotelMS.Data.Interfaces
{
    public interface IHostService
    {

        Task<List<RestaurantReservation>> GetAllReservationsAsync();

        Task<RestaurantReservation> GetReservationByIdAsync(int id);

        Task<RestaurantReservationDTO> CreateReservationAsync(RestaurantReservationCreateDTO dto);

        Task<bool> CancelReservationAsync(int reservationId);

        Task<bool> UpdateReservationAsync(int reservationId, string newStatus);
    }
}
