using HotelMS.Data;
using HotelMS.Models;
using System.Security.Cryptography;
using System.Text;

public class Seed
{
    private readonly DataContext dataContext;

    // Reuse your password hashing logic here
    private void CreatePasswordHash(string password, out byte[] hash, out byte[] salt)
    {
        using (var hmac = new HMACSHA512())
        {
            salt = hmac.Key;
            hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
        }
    }

    public Seed(DataContext dataContext)
    {
        this.dataContext = dataContext;
    }

    public void SeedDataContext()
    {
        // Seed Roles first
        if (!dataContext.Roles.Any())
        {
            var adminRole = new Role() { RoleType = "Admin" };
            var recepsionistRole = new Role() { RoleType = "Recepsionist" };
            var cleaningStaffRole = new Role() { RoleType = "Cleaning Staff" };
            var customerRole = new Role() { RoleType = "Customer" };

            dataContext.Roles.AddRange(adminRole, recepsionistRole, cleaningStaffRole, customerRole);
            dataContext.SaveChanges();
        }

        var adminRoleID = dataContext.Roles.FirstOrDefault(r => r.RoleType == "Admin")?.RoleID;
        var recepsionistRoleID = dataContext.Roles.FirstOrDefault(r => r.RoleType == "Recepsionist")?.RoleID;
        var cleaningStaffRoleID = dataContext.Roles.FirstOrDefault(r => r.RoleType == "Cleaning Staff")?.RoleID;
        var customerRoleID = dataContext.Roles.FirstOrDefault(r => r.RoleType == "Customer")?.RoleID;

        if (adminRoleID == null || recepsionistRoleID == null || cleaningStaffRoleID == null || customerRoleID == null)
        {
            // Log and handle missing roles in some way
            return;
        }

        // Seed Users
        if (!dataContext.Users.Any())
        {
          


            byte[] adminHash, adminSalt;
            CreatePasswordHash("Ruvejda123", out adminHash, out adminSalt);

            byte[] recepsionistHash, recepsionistSalt;
            CreatePasswordHash("Liranda123", out recepsionistHash, out recepsionistSalt);

            byte[] cleaningStaffHash, cleaningStaffSalt;
            CreatePasswordHash("Orgesa123", out cleaningStaffHash, out cleaningStaffSalt);

            byte[] customerHash, customerSalt;
            CreatePasswordHash("Velsa123", out customerHash, out customerSalt);

            var users = new List<User>()
            {
                new User() {FirstName="Ruvejda", LastName="Jaha", Email = "ruvejda@gmail.com", PasswordHash = adminHash, PasswordSalt = adminSalt, Phone="044-111-222", CreatedAt = DateTime.Now, RoleID = adminRoleID.Value },
                new User() {FirstName="Liranda", LastName="Ukaj",  Email = "liranda@gmail.com", PasswordHash = recepsionistHash, PasswordSalt = recepsionistSalt, Address="Prishtina", CreatedAt = DateTime.Now, RoleID = recepsionistRoleID.Value },
                new User() {FirstName="Orgesa", LastName="Berisha",  Email = "orgesa@gmail.com", PasswordHash = cleaningStaffHash, PasswordSalt = cleaningStaffSalt, CreatedAt = DateTime.Now, RoleID = cleaningStaffRoleID.Value },
                new User() {FirstName="Velsa", LastName="Zemaj", Email = "velsa@gmail.com", PasswordHash = customerHash, PasswordSalt = customerSalt, CreatedAt = DateTime.Now, RoleID = customerRoleID.Value }
            };

            dataContext.Users.AddRange(users);
            dataContext.SaveChanges();
        }

        if (!dataContext.CleaningStaff.Any())
        {
            var cleaningUser = dataContext.Users.FirstOrDefault(u => u.RoleID == cleaningStaffRoleID);

            if (cleaningUser != null)
            {
                var cleaningStaff = new CleaningStaff
                {

                    UserID = cleaningUser.UserID,
                    FirstName = cleaningUser.FirstName,  
                    LastName = cleaningUser.LastName,     
                    Email = cleaningUser.Email,          
                    Phone = cleaningUser.Phone,          
                    Address = cleaningUser.Address
                };
                dataContext.CleaningStaff.Add(cleaningStaff);
                dataContext.SaveChanges();
            }
        }

        if (!dataContext.Rooms.Any())
        {
            var room = new Room
            {
                Name = "Room 101",
                Capacity = "2 Adults",
                Size = "25m²",
                Description = "Standard double room",
                Price = 75.00M,
                IsAvailable = true,
                ImageUrl = "room101.jpg"
            };
            dataContext.Rooms.Add(room);
            dataContext.SaveChanges();
        }
        if (!dataContext.CleaningStatuses.Any())
        {
            var cleaningStaff = dataContext.CleaningStaff.FirstOrDefault();
            var room = dataContext.Rooms.FirstOrDefault();

            if (cleaningStaff != null && room != null)
            {
                var cleaningStatus = new CleaningStatus
                {
                    CleaningStaffID = cleaningStaff.CleaningStaffId,
                    RoomID = room.RoomID,
                    Comments = "Cleaned thoroughly, all good."
                };

                dataContext.CleaningStatuses.Add(cleaningStatus);
                dataContext.SaveChanges();
            }
        }
    }

   
}
