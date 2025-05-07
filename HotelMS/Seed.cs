using HotelMS.Data;
using HotelMS.Models;
using System.Security.Cryptography;
using System.Text;

public class Seed
{
    private readonly DataContext dataContext;

    public Seed(DataContext dataContext)
    {
        this.dataContext = dataContext;
    }

    private void CreatePasswordHash(string password, out byte[] hash, out byte[] salt)
    {
        using (var hmac = new HMACSHA512())
        {
            salt = hmac.Key;
            hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
        }
    }

    public void SeedDataContext()
    {
        // Seed Roles
        if (!dataContext.Roles.Any())
        {
            var roles = new List<Role>
            {
                new Role() { RoleType = "Admin" },
                new Role() { RoleType = "Recepsionist" },
                new Role() { RoleType = "Cleaning Staff" },
                new Role() { RoleType = "Customer" }
            };

            dataContext.Roles.AddRange(roles);
            dataContext.SaveChanges();
        }


        // Seed Users
        if (!dataContext.Users.Any())
        {

            var adminRoleID = dataContext.Roles.First(r => r.RoleType == "Admin").RoleID;
            var recepsionistRoleID = dataContext.Roles.First(r => r.RoleType == "Recepsionist").RoleID;
            var cleaningStaffRoleID = dataContext.Roles.First(r => r.RoleType == "Cleaning Staff").RoleID;
            var customerRoleID = dataContext.Roles.First(r => r.RoleType == "Customer").RoleID;

            CreatePasswordHash("Ruvejda123", out var adminHash, out var adminSalt);
            CreatePasswordHash("Liranda123", out var recepsionistHash, out var recepsionistSalt);
            CreatePasswordHash("Orgesa123", out var cleaningStaffHash, out var cleaningStaffSalt);
            CreatePasswordHash("Velsa123", out var customerHash, out var customerSalt);

            var users = new List<User>
            {
                new User() {
                    FirstName = "Ruvejda", LastName = "Jaha", Email = "ruvejda@gmail.com",
                    PasswordHash = adminHash, PasswordSalt = adminSalt,
                    Phone = "044-111-222", CreatedAt = DateTime.Now,
                    RoleID = adminRoleID
                },
                new User() {
                    FirstName = "Liranda", LastName = "Ukaj", Email = "liranda@gmail.com",
                    PasswordHash = recepsionistHash, PasswordSalt = recepsionistSalt,
                    Address = "Prishtina", CreatedAt = DateTime.Now,
                    RoleID = recepsionistRoleID
                },
                new User() {
                    FirstName = "Orgesa", LastName = "Berisha", Email = "orgesa@gmail.com",
                    PasswordHash = cleaningStaffHash, PasswordSalt = cleaningStaffSalt,
                    CreatedAt = DateTime.Now, RoleID = cleaningStaffRoleID
                },
                new User() {
                    FirstName = "Velsa", LastName = "Zemaj", Email = "velsa@gmail.com",
                    PasswordHash = customerHash, PasswordSalt = customerSalt,
                    CreatedAt = DateTime.Now, RoleID = customerRoleID
                }

            };

            dataContext.Users.AddRange(users);
            dataContext.SaveChanges();
        }



        // Seed Rooms
        if (!dataContext.Rooms.Any())
        {
            var rooms = new List<Room>
            {
                new Room()
                {
                    Name = "Single Room", Capacity = "1-2 Persons", Size = "15m²",
                    Description = "A cozy single room with modern amenities.",
                    Price = 50.00m, IsAvailable = true, ImageUrl = "single-room.jpg",
                    CreatedAt = DateTime.Now
                },
                new Room()
                {
                    Name = "Double Room", Capacity = "2 Adults", Size = "25m²",
                    Description = "A spacious double room with a comfortable bed.",
                    Price = 80.00m, IsAvailable = true, ImageUrl = "double-room.jpg",
                    CreatedAt = DateTime.Now
                },
                new Room()
                {
                    Name = "Twin Room", Capacity = "2-3 Persons", Size = "23m²",
                    Description = "A twin bed room with two comfortable beds and modern amenities.",
                    Price = 70.00m, IsAvailable = true, ImageUrl = "twin-room.jpg",
                    CreatedAt = DateTime.Now
                }
            };

            dataContext.Rooms.AddRange(rooms);
            dataContext.SaveChanges();
        }
    }

   
}
