using HotelMS.Data;
using HotelMS.Models;
using System.Security.Cryptography;
using System.Text;
using System.Linq;

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
                new Role() { RoleType = "RoomManager" },
                new Role() { RoleType = "RoomRecepsionist" },
                new Role() { RoleType = "CleaningManager" },
                new Role() { RoleType = "RestaurantManager" },
                new Role() { RoleType = "RestaurantHost" },
                new Role() { RoleType = "ServiceManager" },
                new Role() { RoleType = "ServiceRecepsionist" },
                new Role() { RoleType = "CleaningStaff" },
                new Role() { RoleType = "Customer" }
            };

            dataContext.Roles.AddRange(roles);
            dataContext.SaveChanges();
        }

        // Seed Users
        if (!dataContext.Users.Any())
        {
            var adminRoleID = dataContext.Roles.First(r => r.RoleType == "Admin").RoleID;
            var roomManagerRoleID = dataContext.Roles.First(r => r.RoleType == "RoomManager").RoleID;
            var roomRecepsionistRoleID = dataContext.Roles.First(r => r.RoleType == "RoomRecepsionist").RoleID;
            var cleaningManagerRoleID = dataContext.Roles.First(r => r.RoleType == "CleaningManager").RoleID;
            var restaurantManagerRoleID = dataContext.Roles.First(r => r.RoleType == "RestaurantManager").RoleID;
            var restaurantHostRoleID = dataContext.Roles.First(r => r.RoleType == "RestaurantHost").RoleID;
            var serviceManagerRoleID = dataContext.Roles.First(r => r.RoleType == "ServiceManager").RoleID;
            var serviceRecepsionistRoleID = dataContext.Roles.First(r => r.RoleType == "ServiceRecepsionist").RoleID;
            var cleaningStaffRoleID = dataContext.Roles.First(r => r.RoleType == "CleaningStaff").RoleID;
            var customerRoleID = dataContext.Roles.First(r => r.RoleType == "Customer").RoleID;

            CreatePasswordHash("Ruvejda123", out var adminHash, out var adminSalt);
            CreatePasswordHash("Liranda123", out var roomManagerHash, out var roomManagerSalt);
            CreatePasswordHash("Orgesa123", out var roomRecepsionistHash, out var roomRecepsionistSalt);
            CreatePasswordHash("Velsa123", out var cleaningManagerHash, out var cleaningManagerSalt);
            CreatePasswordHash("Elda123", out var restaurantManagerHash, out var restaurantManagerSalt);
            CreatePasswordHash("Ema123", out var restaurantHostHash, out var restaurantHostSalt);
            CreatePasswordHash("Rona123", out var serviceManagerHash, out var serviceManagerSalt);
            CreatePasswordHash("Erblina123", out var serviceRecepsionistHash, out var serviceRecepsionistSalt);
            CreatePasswordHash("Vlera123", out var cleaningStaffHash, out var cleaningStaffSalt);
            CreatePasswordHash("Erza123", out var customerHash, out var customerSalt);

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
                    PasswordHash = roomManagerHash, PasswordSalt = roomManagerSalt,
                    Address = "Prishtina", CreatedAt = DateTime.Now,
                    RoleID = roomManagerRoleID
                },
                new User() {
                    FirstName = "Orgesa", LastName = "Berisha", Email = "orgesa@gmail.com",
                    PasswordHash = roomRecepsionistHash, PasswordSalt = roomRecepsionistSalt,
                    CreatedAt = DateTime.Now, RoleID = roomRecepsionistRoleID
                },
                new User() {
                    FirstName = "Velsa", LastName = "Zemaj", Email = "velsa@gmail.com",
                    PasswordHash = cleaningManagerHash, PasswordSalt = cleaningManagerSalt,
                    CreatedAt = DateTime.Now, RoleID = cleaningManagerRoleID
                },
                new User() {
                    FirstName = "Elda", LastName = "Sahiti", Email = "elda@gmail.com",
                    PasswordHash = restaurantManagerHash, PasswordSalt = restaurantManagerSalt,
                    CreatedAt = DateTime.Now, RoleID = restaurantManagerRoleID
                },
                new User() {
                    FirstName = "Ema", LastName = "Salihu", Email = "ema@gmail.com",
                    PasswordHash = restaurantHostHash, PasswordSalt = restaurantHostSalt,
                    CreatedAt = DateTime.Now, RoleID = restaurantHostRoleID
                },
                new User() {
                    FirstName = "Rona", LastName = "Veseli", Email = "rona@gmail.com",
                    PasswordHash = serviceManagerHash, PasswordSalt = serviceManagerSalt,
                    CreatedAt = DateTime.Now, RoleID = serviceManagerRoleID
                },
                new User() {
                    FirstName = "Erblina", LastName = "Kadriu", Email = "erblina@gmail.com",
                    PasswordHash = serviceRecepsionistHash, PasswordSalt = serviceRecepsionistSalt,
                    CreatedAt = DateTime.Now, RoleID = serviceRecepsionistRoleID
                },
                new User() {
                    FirstName = "Vlera", LastName = "Krasniqi", Email = "vlera@gmail.com",
                    PasswordHash = cleaningStaffHash, PasswordSalt = cleaningStaffSalt,
                    CreatedAt = DateTime.Now, RoleID = cleaningStaffRoleID
                },
                new User() {
                    FirstName = "Erza", LastName = "Musliu", Email = "erza@gmail.com",
                    PasswordHash = customerHash, PasswordSalt = customerSalt,
                    CreatedAt = DateTime.Now, RoleID = customerRoleID
                }
            };

            dataContext.Users.AddRange(users);
            dataContext.SaveChanges();
        }

        // Seed RoomRecepsionists
        if (!dataContext.RoomRecepsionists.Any())
        {
            var roomRecepsionistUser = dataContext.Users.FirstOrDefault(u => u.Email == "orgesa@gmail.com");
            var assignedByUser = dataContext.Users.FirstOrDefault(u => u.Email == "ruvejda@gmail.com");

            if (roomRecepsionistUser != null && assignedByUser != null)
            {
                var roomRecepsionist = new RoomRecepsionist
                {
                    UserID = roomRecepsionistUser.UserID,
                    Shift = "Morning",
                    AssignedByUserID = assignedByUser.UserID
                };

                dataContext.RoomRecepsionists.Add(roomRecepsionist);
                dataContext.SaveChanges();
            }
        }

        // Seed CleaningStaff
        if (!dataContext.CleaningStaff.Any())
        {
            var cleaningStaffUser = dataContext.Users.FirstOrDefault(u => u.Email == "orgesa@gmail.com");
            var assignedByUser = dataContext.Users.FirstOrDefault(u => u.Email == "ruvejda@gmail.com");

            if (cleaningStaffUser != null && assignedByUser != null)
            {
                var cleaningStaff = new CleaningStaff
                {
                    UserID = cleaningStaffUser.UserID,
                    IsActive = true,
                    Shift = "Morning",
                    AssignedByUserID = assignedByUser.UserID
                };

                dataContext.CleaningStaff.Add(cleaningStaff);
                dataContext.SaveChanges();
            }
        }

        // Seed RoomStatuses
        if (!dataContext.RoomStatuses.Any())
        {
            var roomStatuses = new List<RoomStatus>
            {
                new RoomStatus() { RoomStatusName = "Available" },
                new RoomStatus() { RoomStatusName = "Occupied" },
                new RoomStatus() { RoomStatusName = "Cleaning" },
                new RoomStatus() { RoomStatusName = "Completed" }
            };

            dataContext.RoomStatuses.AddRange(roomStatuses);
            dataContext.SaveChanges();
        }

        // Seed ReservationStatuses
        if (!dataContext.ReservationStatuses.Any())
        {
            var reservationStatuses = new List<ReservationStatus>
            {
                new ReservationStatus() { ReservationStatusName = "Confirmed" },
                new ReservationStatus() { ReservationStatusName = "Cancelled" },
                new ReservationStatus() { ReservationStatusName = "Completed" }
            };

            dataContext.ReservationStatuses.AddRange(reservationStatuses);
            dataContext.SaveChanges();
        }

        // Seed RoomTypes
        if (!dataContext.RoomTypes.Any())
        {
            var roomTypes = new List<RoomType>
            {
                new RoomType() { Name = "Standard" },
                new RoomType() { Name = "Deluxe" },
                new RoomType() { Name = "Suite" }
            };

            dataContext.RoomTypes.AddRange(roomTypes);
            dataContext.SaveChanges();
        }
    }
}
