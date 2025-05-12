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
                new Role() { RoleType = "Manager" },
                new Role() { RoleType = "Receptionist" },
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
            var recepsionistRoleID = dataContext.Roles.First(r => r.RoleType == "Receptionist").RoleID;
            var cleaningStaffRoleID = dataContext.Roles.First(r => r.RoleType == "CleaningStaff").RoleID;
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

        // Seed CleaningStaff
        if (!dataContext.CleaningStaff.Any())
        {
            var cleaningStaffUser = dataContext.Users.FirstOrDefault(u => u.Email == "orgesa@gmail.com");
            var assignedByUser = dataContext.Users.FirstOrDefault(u => u.Email == "ruvejda@gmail.com"); // manager

            if (cleaningStaffUser != null && assignedByUser != null)
            {
                var cleaningStaff = new CleaningStaff
                {
                    UserID = cleaningStaffUser.UserID,
                    IsActive = true,
                    Shift = "Morning",
                    AssignedByUserID = assignedByUser.UserID
                };

                dataContext.CleaningStaff.AddRange(cleaningStaff);
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
                new RoomStatus() { RoomStatusName = "Cleaning" }
            };

            dataContext.RoomStatuses.AddRange(roomStatuses);
            dataContext.SaveChanges();
        }

        // Seed ReservationStatuses
        if (!dataContext.ReservationStatuses.Any())
        {
            var reservationStatuses = new List<ReservationStatus>
            {
                new ReservationStatus() { ReservationStatusName = "Pending" },
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

        // Seed Rooms
        if (!dataContext.Rooms.Any())
        {
            var standardRoomTypeID = dataContext.RoomTypes.First(rt => rt.Name == "Standard").RoomTypeID;
            var deluxeRoomTypeID = dataContext.RoomTypes.First(rt => rt.Name == "Deluxe").RoomTypeID;
            var suiteRoomTypeID = dataContext.RoomTypes.First(rt => rt.Name == "Suite").RoomTypeID;

            var availableStatusID = dataContext.RoomStatuses.First(rs => rs.RoomStatusName == "Available").RoomStatusID;

            var rooms = new List<Room>
            {
                new Room()
                {
                    Name = "Single Room", Capacity = "1-2 Persons", Size = "15m²",
                    Description = "A cozy single room with modern amenities.",
                    Price = 50.00m, ImageUrl = "single-room.jpg",
                    CreatedAt = DateTime.Now, RoomTypeID = standardRoomTypeID, RoomStatusID = availableStatusID
                },
                new Room()
                {
                    Name = "Double Room", Capacity = "2 Adults", Size = "25m²",
                    Description = "A spacious double room with a comfortable bed.",
                    Price = 80.00m, ImageUrl = "double-room.jpg",
                    CreatedAt = DateTime.Now, RoomTypeID = deluxeRoomTypeID, RoomStatusID = availableStatusID
                },
                new Room()
                {
                    Name = "Twin Room", Capacity = "2-3 Persons", Size = "23m²",
                    Description = "A twin bed room with two comfortable beds and modern amenities.",
                    Price = 70.00m, ImageUrl = "twin-room.jpg",
                    CreatedAt = DateTime.Now, RoomTypeID = suiteRoomTypeID, RoomStatusID = availableStatusID
                }
            };

            dataContext.Rooms.AddRange(rooms);
            dataContext.SaveChanges();
        }

        // Seed RoomReservations
        if (!dataContext.RoomReservations.Any())
        {
            var availableRoomID = dataContext.Rooms.First(r => r.Name == "Single Room").RoomID;
            var customerID = dataContext.Users.First(u => u.Email == "velsa@gmail.com").UserID;
            var reservationStatusID = dataContext.ReservationStatuses.First(rs => rs.ReservationStatusName == "Pending").ReservationStatusID;

            var reservations = new List<RoomReservation>
            {
                new RoomReservation()
                {
                    RoomID = availableRoomID,
                    UserID = customerID,
                    CheckInDate = DateTime.Now.AddDays(1),
                    CheckOutDate = DateTime.Now.AddDays(5),
                    ReservationStatusID = reservationStatusID,
                    CreatedAt = DateTime.Now
                }
            };

            dataContext.RoomReservations.AddRange(reservations);
            dataContext.SaveChanges();
        }

        // Seed Reviews
        if (!dataContext.Reviews.Any())
        {
            var customerUser = dataContext.Users.FirstOrDefault(u => u.Email == "velsa@gmail.com");

            if (customerUser != null)
            {
                var reviews = new List<Review>
                {
                    new Review()
                    {
                        UserID = customerUser.UserID,
                        Rating = 5,
                        Comment = "Excellent service and very clean rooms!",
                        Date = DateTime.Now.AddDays(-2)
                    },
                    new Review()
                    {
                        UserID = customerUser.UserID,
                        Rating = 4,
                        Comment = "Nice hotel, but breakfast could be better.",
                        Date = DateTime.Now.AddDays(-1)
                    }
                };

                dataContext.Reviews.AddRange(reviews);
                dataContext.SaveChanges();
            }
        }
    }
}

