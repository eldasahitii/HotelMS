using HotelMS.Data.DTO;
using HotelMS.Models;

namespace HotelMS.Data.Interfaces
{
    public interface IHostService
    {

        Task<List<RestaurantReservationDTO>> GetAllReservationsAsync();

        Task<RestaurantReservation> GetReservationByIdAsync(int id);

        //Task<RestaurantReservationDTO> CreateReservationAsync(RestaurantReservationCreateDTO dto);

        Task<RestaurantReservationDTO> CreateReservationWithGuestAsync(RestaurantReservationGuestDTO dto);

        Task<RestaurantReservationDTO> CreateReservationForUserByEmailAsync(RestaurantReservationUserDTO dto);

        Task<bool> CancelReservationAsync(int reservationId);

        Task<bool> UpdateReservationAsync(int reservationId, string newStatus);

        Task<List<RestaurantReservationDTO>> GetUserReservationsAsync(int userId);
        Task<bool> UpdateUserReservationAsync(int id, int userId, DateTime dateTime, string status);
        Task<bool> CancelUserReservationAsync(int id, int userId);

    }
}
