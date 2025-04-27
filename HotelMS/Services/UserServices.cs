using HotelMS.Data;
using HotelMS.DTO;
using HotelMS.Interfaces;
using HotelMS.Models;
using Microsoft.EntityFrameworkCore;

namespace HotelMS.Services
{
    public class UserServices : IUserServices
    {
        private readonly DataContext _dbContext;

        public UserServices(DataContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<User> GetUser(int id)
        {
            try
            {
                var result = _dbContext.Users.Find(id);
                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw new Exception("An error occurred");
            }
        }

        public async Task<IEnumerable<User>> GetAll()
        {
            try
            {
                var result = await _dbContext.Users.ToListAsync();
                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw new Exception("An error occured");
            }

        }

        //public Task<User> UpdateUser(int id, UserDTO request)
        //{
        //    throw new NotImplementedException();
        //}

        //public Task DeleteUser(int id)
        //{
        //    throw new NotImplementedException();
        //}
    }
}
