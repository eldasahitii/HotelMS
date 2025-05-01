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

        public async Task <User> UpdateUser(int id, UserDTO request)
        {
            try
            {
              var user = _dbContext.Users.Find(id);

                if (user == null) {
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
          catch(Exception ex)
          {
            Console.WriteLine(ex.Message);
            throw new Exception("An error ocurred while attempting to save the user record.");

          } 
       } 
       
    }
 }


// #region Register
//public async Task<UserDTO> Register(UserRegistrationDTO request)
//public async Task<User> GetUser(int id)
//{
//    try
//    {
//        CreatePasswordHash(request.Password, out byte[] hash, out byte[] salt);

//        User user = new User
//        {
//            FirstName = request.FirstName,
//            LastName = request.LastName,
//            Email = request.Email,
//            UserName = request.UserName,
//            PasswordHash = hash,
//            PasswordSalt = salt,
//            CreatedAr = DateTime.Now
//        };

//        _dbContext.Users.Add(user);
//        await _dbContext.SaveChangesAsync();

//        return new UserDTO
//        {
//            Id = user.Id,
//            FirstName = user.FirstName,
//            LastName = user.LastName,
//            Email = user.Email,
//            UserName = user.UserName
//        };
//    }
//    catch(Exception ex)
//    {
//        Console.WriteLine(ex.Message);
//        throw new Exception("An error occurred while attempting to save the user record");

//    }
//}
//#endregion

//#region Login
//public async Task<string> Login(UserLoginDTO request)
//{
//    var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Email == requestEmail);

//    if (user == null)
//    {
//        Console.WriteLine($"No user found with email {request.Email}");
//        return null;
//    }
//    if(!VerifyPasswordHash(request.Password, user.PasswordHash, user.PasswordSalt))
//    {
//        Console.WriteLine($"Invalid password for user {request.Email}");
//        return = null;
//    }

//    Console.WriteLine("User{request.Email} loggen in successfully");

//    return CreateToken(user);

//}
//#endregion

//#region ChangePassword
//public async Task<UserDTO> ChangePassword(int id, ChangePasswordDTO request)
//{
//    try
//    {
//        CreatePasswordHash(request.NewPassword, out byte[] hash, out byte[] salt);

//        var user = await _dbContext.Users.FindAsync(id);
//        if(user !=null)
//        {
//            if (!VerifyPasswordHash(request.OldPassword, user.PasswordHash, user.PasswordSalt))
//                return null;

//            user.PasswordHash = hash;
//            user.PasswordSalt = salt;

//            await _dbContext.SaveChangesAsync();
//        }

//        return new UserDTO
//        {
//            Id: user.Id,
//            FirstName = user.FirstName,
//            LastName = user.LastName,
//            Email = user.Email,
//            UserName = user.UserName
//        };
//    }
//    catch(Exception ex)
//    {
//        Console.WriteLine(ex.Message);
//        throw new Exception("An error occourred while attempting to save the user record.");

//    }
//}
//#endregion

//#region CreateToken
//private string CreateToken(User user)
//{
//    List<Claim> claims = new List<Claim>
//    {
//        new.Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
//        new Claim(ClaimTypes.Email, user.Email),
//        new Claim(ClaimTypes.Name,user.UserName)
//    };

//    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
//        _configuration.GetSection("AppSettings:JwtSecretKey").Value));

//    var cred = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

//    var token = new JwtSecurityToken(
//        claims: claims,
//        expires: DateTime.Now.AddDays(7),
//        signingCredentials: cred);

//    var jwt = new JwtSecurityToken().WriteToken(token);

//    return jwt;

//}
//#endregion

//#region CreatePasswordHash
//private void CreatePasswordHash(string password, out byte[]hash, out byte[]hash)
//{
//    using (var hmac = new HMACSHA512())
//    {
//        salt = hmac.Key;
//        hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
//    }
//}
//#endregion


//#region VerifyPasswordHash
//private bool VerifyPasswordHash(string password, byte[]hash, byte[]salt )
//{
//    using (var hmc = new HMACSHA512(salt))
//    {
//        var computeHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
//        return computeHash.Sequence(hash);
//    }
//}
//#endregion

//#region Register
//public async Task<User> Register(UserRegistrationDTO request)
//{
//    CreatePasswordHash(request.Password, out byte[] hash, out byte[] salt);

//    User user = new User
//    {
//        FirstName = request.FirstName,
//        LastName = request.LastName,
//        Email = request.Email,
//        UserName = request.UserName,
//        PasswordHash = hash,
//        PasswordSalt = salt,
//        CreatedAt = DateTime.Now
//    };

//    _dbContext.Users.Add(user);
//    await _dbContext.SaveChangesAsync();

//    return user;
//}
//#endregion

//#region Login 
//public async Task<string> Login(UserLoginDTO request)
//{
//    var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

//    if(user == null || !VerifyPasswordHash(request.Password, user.PasswordHash, user.PasswordSalt ))
//    {
//        return null;
//    }
//    return CreateToken(user);
//}
//#endregion

//#region Change Password
//public async Task<bool> ChangePassword(int id, ChangePasswprdDTO request)
//{
//    var user = await _dbContext
//}