//using HotelMS.Models;
//using HotelMS.Data.DTO;

//namespace HotelMS.Data.Interfaces
//{
//    public interface IHotelServiceReservationService
//    {
//        Task<IEnumerable<HotelServiceReservation>> GetAllReservationsAsync();
//        Task<HotelServiceReservation> GetReservationByIdAsync(int id);
//        Task<HotelServiceReservation> CreateReservationAsync(HotelServiceReservation reservation);
//        Task<HotelServiceReservation> UpdateReservationAsync(int id, HotelServiceReservation updatedReservation);
//        Task<bool> DeleteReservationAsync(int id);
//    }
//}
using HotelMS.Data.DTO;
using HotelMS.Models;

namespace HotelMS.Data.Interfaces
{
    public interface IHotelServiceReservationService
    {
        Task<string> MakeReservation(int userID, HotelServiceReservationDTO request);
        Task<IEnumerable<HotelServiceReservationDTO>> GetUserReservations(int userID);
        Task<IEnumerable<HotelServiceReservationDTO>> GetAllReservations();
        Task<string> CancelReservation(int reservationID, int userID, bool isAdminOrStaff = false);
        Task<string> UpdateReservationStatus(int reservationID, string newStatus);
        Task<string> MarkReservationCompleted(int reservationID, int userID);
    }
}
