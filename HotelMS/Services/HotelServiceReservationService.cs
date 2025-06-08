using HotelMS.Data;
using HotelMS.Data.DTO;
using HotelMS.Models;
using HotelMS.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HotelMS.Services
{
    public class HotelServiceReservationService : IHotelServiceReservationService
    {
        private readonly DataContext _context;

        public HotelServiceReservationService(DataContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<HotelServiceReservationDTO>> GetAllReservationsAsync()
        {
            var reservations = await _context.HotelServiceReservations
                .Include(r => r.HotelServiceDetail)
                .Include(r => r.ServiceRecepsionist)
                .ToListAsync();

            return reservations.Select(r => new HotelServiceReservationDTO
            {
                ReservationID = r.ReservationID,
                FirstName = r.FirstName,
                LastName = r.LastName,
                Email = r.Email,
                Phone = r.Phone,
                ReservationDate = r.ReservationDate,
                TimeSlot = r.TimeSlot,
                HotelServiceDetailID = r.HotelServiceDetailID,
                HotelServiceName = r.HotelServiceDetail?.DetailTitle,
                ReservationStatusID = r.ReservationStatusID,
                ReservationStatusName = r.ReservationStatusID.HasValue ? r.ReservationStatusID.Value.ToString() : null,
                CreatedAt = r.CreatedAt,
                ServiceRecepsionistId = r.ServiceRecepsionistId,
                ReceptionistFirstName = r.ServiceRecepsionist?.FirstName,
                ReceptionistLastName = r.ServiceRecepsionist?.LastName,
                ReceptionistEmail = r.ServiceRecepsionist?.Email
            });
        }

        public async Task<HotelServiceReservationDTO?> GetReservationByIdAsync(int reservationId)
        {
            var r = await _context.HotelServiceReservations
                .Include(h => h.HotelServiceDetail)
                .Include(h => h.ServiceRecepsionist)
                .FirstOrDefaultAsync(h => h.ReservationID == reservationId);

            if (r == null) return null;

            return new HotelServiceReservationDTO
            {
                ReservationID = r.ReservationID,
                FirstName = r.FirstName,
                LastName = r.LastName,
                Email = r.Email,
                Phone = r.Phone,
                ReservationDate = r.ReservationDate,
                TimeSlot = r.TimeSlot,
                HotelServiceDetailID = r.HotelServiceDetailID,
                HotelServiceName = r.HotelServiceDetail?.DetailTitle,
                ReservationStatusID = r.ReservationStatusID,
                ReservationStatusName = r.ReservationStatusID.HasValue ? r.ReservationStatusID.Value.ToString() : null,
                CreatedAt = r.CreatedAt,
                ServiceRecepsionistId = r.ServiceRecepsionistId,
                ReceptionistFirstName = r.ServiceRecepsionist?.FirstName,
                ReceptionistLastName = r.ServiceRecepsionist?.LastName,
                ReceptionistEmail = r.ServiceRecepsionist?.Email
            };
        }

        public async Task<int> CreateReservationAsync(HotelServiceReservationDTO dto)
        {
            var reservation = new HotelServiceReservation
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                Phone = dto.Phone,
                ReservationDate = dto.ReservationDate,
                TimeSlot = dto.TimeSlot,
                HotelServiceDetailID = dto.HotelServiceDetailID,
                ReservationStatusID = dto.ReservationStatusID,
                ServiceRecepsionistId = dto.ServiceRecepsionistId,
                CreatedAt = dto.CreatedAt
            };

            _context.HotelServiceReservations.Add(reservation);
            await _context.SaveChangesAsync();
            return reservation.ReservationID;
        }

        public async Task<bool> UpdateReservationAsync(HotelServiceReservationDTO dto)
        {
            var reservation = await _context.HotelServiceReservations.FindAsync(dto.ReservationID);
            if (reservation == null)
                return false;

            reservation.FirstName = dto.FirstName;
            reservation.LastName = dto.LastName;
            reservation.Email = dto.Email;
            reservation.Phone = dto.Phone;
            reservation.ReservationDate = dto.ReservationDate;
            reservation.TimeSlot = dto.TimeSlot;
            reservation.HotelServiceDetailID = dto.HotelServiceDetailID;
            reservation.ReservationStatusID = dto.ReservationStatusID;
            reservation.ServiceRecepsionistId = dto.ServiceRecepsionistId;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteReservationAsync(int reservationId)
        {
            var reservation = await _context.HotelServiceReservations.FindAsync(reservationId);
            if (reservation == null)
                return false;

            _context.HotelServiceReservations.Remove(reservation);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
