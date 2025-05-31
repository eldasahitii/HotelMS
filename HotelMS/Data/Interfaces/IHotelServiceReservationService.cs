using HotelMS.Data.DTO;
using HotelMS.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HotelMS.Data.Interfaces
{
    public interface IHotelServiceReservationService
    {
        Task<string> MakeReservation(int userID, HotelServiceReservationDTO request, List<string> roles);

        Task<IEnumerable<HotelServiceReservationDTO>> GetUserReservations(int userID);

        Task<IEnumerable<HotelServiceReservationDTO>> GetAllReservations();

        Task<string> CancelReservation(int reservationID, int userID, bool isAdminOrStaff = false);

        Task<string> UpdateReservation(int reservationID, HotelServiceReservationUpdateDTO request, int userID, List<string> roles);

        Task<string> UpdateReservationStatus(int reservationID, int statusID);

        Task<string> MarkReservationCompleted(int reservationID, int userID);
        Task<List<string>> GetTakenSlotsForDate(string date);

    }
}
