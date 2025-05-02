using HotelMS.Data;
using HotelMS.Data.DTO;
using HotelMS.Data.Interfaces;
using HotelMS.Models;
using Microsoft.AspNetCore.Mvc.TagHelpers;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.EntityFrameworkCore;


namespace HotelMS.Services
{
    public class UserService : IUserServices
    {
        private readonly DataContext _dbContext;


        public UserService(DataContext dbContext)
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

        public async Task<User> UpdateUser(int id, UserDTO request)
        {
            try
            {
                var user = _dbContext.Users.Find(id);

                if (user == null)
                {
                    return null;
                }

                if (user != null)
                {
                    user.FirstName = request.FirstName;
                    user.LastName = request.LastName;
                    user.Email = request.Email;
                    user.Phone = request.Phone;
                    user.Address = request.Address;


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
                if (result != null)
                {
                    _dbContext.Users.Remove(result);
                    _dbContext.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw new Exception("An error ocurred while attempting to save the user record.");

            }
        }

    }
}
