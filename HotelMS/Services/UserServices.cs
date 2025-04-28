using HotelMS.Data;
using HotelMS.DTO;
using HotelMS.Interfaces;
using HotelMS.Models;
using Microsoft.EntityFrameworkCore;
using static System.Runtime.InteropServices.JavaScript.JSType;

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
                throw new Exception("An error occurred.");
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
        public async Task <User> UpdateUser(int id, UserDTO request)
        {
            try
            {
                var user = _dbContext.Users.Find(id);
                if (user != null)
                {
                    user.Username = request.Username;
                    user.Email = request.Email;
                    user.Password = request.Password;
                    user.CreatedAt = request.CreatedAt;
                    user.Phone = request.Phone;
                    user.Address = request.Address;
                    user.profilePicture = request.profilePicture;

                    _dbContext.SaveChanges();
                }
                return user;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw new Exception("An error ocurred while attempting to save the user record.");
            }
        }
      
        public async Task DeleteUser(int id)
        {
            try
            {
                var result = _dbContext.Users.Find(id);
                if(result != null)
                {
                    _dbContext.Users.Remove(result);
                    _dbContext.SaveChanges();
                }
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw new Exception("An error ocurred while attempting to save the user record.");

            }
        }


    }
}
