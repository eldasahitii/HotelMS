using HotelMS.Data.DTO;

namespace HotelMS.Data.Interfaces
{
    public interface ICleaningStaffService
    {
        Task<CleaningStaffDTO?> GetCleaningStaff(int id);
        Task<IEnumerable<CleaningStaffDTO>> GetAllCleaningStaff();
        Task<CleaningStaffDTO?> UpdateCleaningStaff(int id, CleaningStaffDTO dto);
        Task DeleteCleaningStaff(int id);
    }
}
