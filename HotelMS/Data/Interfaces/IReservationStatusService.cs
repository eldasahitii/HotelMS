using HotelMS.Data.DTO;
using HotelMS.Models;

namespace HotelMS.Data.Interfaces
{
    public interface IReservationStatusService
    {
        Task<ReservationStatus> AddReservationStatus(ReservationStatusDTO request);
        Task<ReservationStatus> GetReservationStatus(int id);
        Task<IEnumerable<ReservationStatus>> GetAllReservationStatuses();
        Task DeleteReservationStatus(int id);
        Task<ReservationStatus> UpdateReservationStatus(int id,ReservationStatusDTO request);
    }
}
