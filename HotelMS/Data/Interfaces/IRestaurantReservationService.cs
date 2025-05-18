using HotelMS.Data.DTO;
using HotelMS.Models;

namespace HotelMS.Data.Interfaces
{
    public interface IRestaurantReservationService
    {
        Task<IEnumerable<RestaurantReservation>> GetAllReservations();

        Task<RestaurantReservation> GetReservation(int id);

        Task<RestaurantReservation> AddReservation(RestaurantReservationCreateDTO dto);

        Task<RestaurantReservation> UpdateReservation(int id, RestaurantReservationCreateDTO dto);

        Task DeleteReservation(int id);
    }
}
