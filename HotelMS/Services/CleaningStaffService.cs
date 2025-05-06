using HotelMS.Data;
using HotelMS.Data.Interfaces;
using HotelMS.Models;
using Microsoft.EntityFrameworkCore;

namespace HotelMS.Services
{
    public class CleaningStaffService
    {
        public class CleaningStaffService : ICleaningStaffService
        {
            private readonly DataContext _context;
            public CleaningStaffService(DataContext _context)
            {
                _context = context;
            }
            public async Task<CleaningStaff> GetCleaningStaff(int id)
            {
                try
                {
                    var result = _context.CleaningStaff.Find(id);
                    return result;
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                    throw new Exception("An error occurred.");
                }
            }







        }

    }
}
