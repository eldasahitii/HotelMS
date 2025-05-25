using HotelMS.Data.DTO;
using HotelMS.Models;

namespace HotelMS.Data.Interfaces
{
    public interface IRoomReservationService
    {
        Task<string> MakeReservation(int userId, RoomReservationCreateDTO dto);
        Task<IEnumerable<UserReservationResponseDTO>> GetUserReservations(int userID);
        Task<IEnumerable<RoomReservationDTO>> GetAllReservations();
        Task<string> CancelReservation(int reservationID, int userID, bool isAdminOrStaff = false);
        Task<string> UpdateReservationStatus(int reservationID, int statusID);
        Task<string> MarkReservationCompleted(int reservationID,int userID);

    }
}
