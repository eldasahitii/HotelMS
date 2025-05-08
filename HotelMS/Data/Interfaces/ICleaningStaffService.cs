using HotelMS.Data.DTO;
using HotelMS.Models;

namespace HotelMS.Data.Interfaces
{
    public interface ICleaningStaffService
    {
        Task<CleaningStaff> AddCleaningStaff(CleaningStaffDTO request);
        Task<CleaningStaffDTO> GetCleaningStaff(int id);
        Task<IEnumerable<CleaningStaffDTO>> GetAllCleaningStaff();
        Task DeleteCleaningStaff(int id);
        Task<CleaningStaff> UpdateCleaningStaff(int id, CleaningStaffDTO request);

        Task<IEnumerable<CleaningStaffDTO>> GetByShift(string shift);
        Task<IEnumerable<CleaningStaffDTO>> GetAllActive();
        Task<bool> ChangeShift(int id, string newShift);

    }
}
