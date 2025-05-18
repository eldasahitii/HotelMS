using HotelMS.Data;
using HotelMS.Data.DTO;
using HotelMS.Data.Interfaces;
using HotelMS.Models;
using Microsoft.EntityFrameworkCore;

namespace HotelMS.Services
{
    public class ReservationStatusService:IReservationStatusService
    {
        private readonly DataContext _dbContext;

        public ReservationStatusService(DataContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<ReservationStatus> AddReservationStatus(ReservationStatusDTO request)
        {
            try
            {
                ReservationStatus reservationStatus = new ReservationStatus
                {
                    ReservationStatusName = request.ReservationStatusName
                };
                _dbContext.ReservationStatuses.Add(reservationStatus);
                await _dbContext.SaveChangesAsync();
                return reservationStatus;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                throw new Exception("An error occurred while attempting to save the room status record.");
            }
        }
        public async Task<ReservationStatus> GetReservationStatus(int id)
        {
            try
            {
                var result = _dbContext.ReservationStatuses.Find(id);
                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw new Exception("An error occured");
            }
        }
        public async Task<IEnumerable<ReservationStatus>> GetAllReservationStatuses()
        {
            try
            {
                var result = await _dbContext.ReservationStatuses.ToListAsync();
                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw new Exception("An error occured");
            }
        }
        public async Task DeleteReservationStatus(int id)
        {
            try
            {
                var result = _dbContext.ReservationStatuses.Find(id);
                if (result != null)
                {
                    _dbContext.ReservationStatuses.Remove(result);
                    await _dbContext.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw new Exception("An error occured while attempting to delete room status");
            }
        }
        public async Task<ReservationStatus> UpdateReservationStatus(int id, ReservationStatusDTO request)
        {
            try
            {
                var reservationStatus = _dbContext.ReservationStatuses.Find(id);
                if (reservationStatus == null)
                {
                    return null;
                }
                if (reservationStatus != null)
                {
                    reservationStatus.ReservationStatusName = request.ReservationStatusName;
                    _dbContext.SaveChanges();
                }
                return reservationStatus;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw new Exception("An error occured while attmeting to save room");
            }
        }
        
    }
}
