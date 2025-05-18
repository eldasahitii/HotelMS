using HotelMS.Data;
using HotelMS.Data.DTO;
using HotelMS.Data.Interfaces;
using HotelMS.Models;
using Microsoft.EntityFrameworkCore;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace HotelMS.Services
{
    public class HotelServiceReservationService : IHotelServiceReservationService
    {
        private readonly DataContext _context;

        public HotelServiceReservationService (DataContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<HotelServiceReservation>> GetAllReservationsAsync()
        {
            return await _context.HotelServiceReservations
                .Include(r => r.Service)
                .Include(r => r.Schedule)
                .Include(r => r.User)
                .ToListAsync();
        }

        public async Task<HotelServiceReservation> GetReservationByIdAsync (int id)
        {
            return await _context.HotelServiceReservations
                .Include(r => r.Service)
                .Include(r => r.Schedule)
                .Include(r => r.User)
                .FirstOrDefaultAsync (r => r.Id == id);
        }

        public async Task <HotelServiceReservation> CreateReservationAsync(HotelServiceReservation reservation)
        {
            _context.HotelServiceReservations.Add(reservation);
            await _context.SaveChangesAsync();
            return reservation;
        }

        public async Task<HotelServiceReservation> UpdateReservationAsync(int id, HotelServiceReservation updatedReservation)
        {
            var existing = await _context.HotelServiceReservations.FindAsync(id);
            if (existing == null)
                return null;

            // Update fields (add only fields you want to allow editing)
            //existing.ScheduleId = updatedReservation.ScheduleId;
            //existing.ServiceId = updatedReservation.ServiceId;
            //existing.UserId = updatedReservation.UserId;
            //existing.ReservationDate = updatedReservation.ReservationDate;
            // Add more fields as necessary

            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteReservationAsync(int id)
        {
            var reservation = await _context.HotelServiceReservations.FindAsync(id);
            if (reservation == null)
                return false;

            _context.HotelServiceReservations.Remove(reservation);
            await _context.SaveChangesAsync();
            return true;
        }

    }
}
