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

        //Seed CleaningStaff
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
                    Price = 50.00m,
                    CreatedAt = DateTime.Now, RoomTypeID = standardRoomTypeID, RoomStatusID = availableStatusID
                },
                new Room()
                {
                    Name = "Double Room", Capacity = "2 Adults", Size = "25m²",
                    Description = "A spacious double room with a comfortable bed.",
                    Price = 80.00m,
                    CreatedAt = DateTime.Now, RoomTypeID = deluxeRoomTypeID, RoomStatusID = availableStatusID
                },
                new Room()
                {
                    Name = "Twin Room", Capacity = "2-3 Persons", Size = "23m²",
                    Description = "A twin bed room with two comfortable beds and modern amenities.",
                    Price = 70.00m,
                    CreatedAt = DateTime.Now, RoomTypeID = suiteRoomTypeID, RoomStatusID = availableStatusID
                }
            };

            dataContext.Rooms.AddRange(rooms);
            dataContext.SaveChanges();
        }

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
            var customerUser = dataContext.Users.FirstOrDefault(u => u.Email == "erza@gmail.com");

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
                    },
                    new Review()
                    {
                        UserID = customerUser.UserID,
                        Rating = 3,
                        Comment = "Nice hotel, but breakfast could be better.",
                        Date = DateTime.Now.AddDays(-1)
                    }
                    }; dataContext.Reviews.AddRange(reviews);
                dataContext.SaveChanges();
            }

            //Seed HotelService
            if (!dataContext.HotelServices.Any())
            {
                var services = new List<HotelService>
                {
                    new HotelService
                    {
                        Name = "Pool & Spa",
                        Description = " Relax and unwind in our luxurious pool and spa facilities. \r\n              Take a dip in our heated indoor and outdoor pools, or melt away stress in the hot tub, \r\n              sauna, or steam room. Indulge in a soothing massage or a refreshing facial from our skilled therapists. \r\n              Whether you're looking for quiet time or a bit of pampering, this is your perfect escape.",
                        HeroImageUrl = "../../Assets/images/pool1.jpg"
                    },
                    new HotelService
                    {
                        Name = "Events",
                        Description = " Host your special moments in our elegant venues, perfect for weddings, conferences, and celebrations.\r\n               Our experienced team will help you plan every detail to ensure a seamless and memorable event. \r\n               Whether it’s an intimate gathering or a large celebration, we provide the ideal setting and personalized \r\n               service to make your occasion truly special.",
                        HeroImageUrl = "../../Assets/images/mainevents.jpg"
                    },
                };

                dataContext.HotelServices.AddRange(services);
                dataContext.SaveChangesAsync();
            }

            if (!dataContext.MenuCategories.Any())
            {
                var categories = new List<MenuCategory>
        {
            new MenuCategory {Name = "Appetizers"},
            new MenuCategory { Name = "Main Courses" },
            new MenuCategory { Name = "Desserts" },
            new MenuCategory { Name = "Drinks" }
        };

                dataContext.MenuCategories.AddRange(categories);
                dataContext.SaveChanges();
            }

            if (!dataContext.MenuItems.Any())
            {
                var appetizersID = dataContext.MenuCategories.First(c => c.Name == "Appetizers").MenuCategoryID;
                var mainsID = dataContext.MenuCategories.First(c => c.Name == "Main Courses").MenuCategoryID;
                var dessertsID = dataContext.MenuCategories.First(c => c.Name == "Desserts").MenuCategoryID;
                var drinksID = dataContext.MenuCategories.First(c => c.Name == "Drinks").MenuCategoryID;

                var menuItems = new List<MenuItem>
    {
        new MenuItem { Name = "Bruschetta", Description = "Grilled bread with tomato & basil", Price = 4.99, MenuCategoryID = appetizersID },
        new MenuItem { Name = "Spaghetti Carbonara", Description = "Pasta with eggs, cheese & pancetta", Price = 10.99, MenuCategoryID = mainsID },
        new MenuItem { Name = "Tiramisu", Description = "Coffee-flavored Italian dessert", Price = 5.50, MenuCategoryID = dessertsID },
        new MenuItem { Name = "Lemonade", Description = "Freshly squeezed lemonade", Price = 2.99, MenuCategoryID = drinksID }
    };

                dataContext.MenuItems.AddRange(menuItems);
                dataContext.SaveChanges();
            }


            if (!dataContext.RestaurantTables.Any())
            {
                var tables = new List<RestaurantTable>
    {
        new RestaurantTable { TableNumber = 1,  Status = "Available" },
        new RestaurantTable { TableNumber = 2,  Status = "Available" },
        new RestaurantTable { TableNumber = 3,  Status = "Available" }
    };

                dataContext.RestaurantTables.AddRange(tables);
                dataContext.SaveChanges();
            }
            if (!dataContext.RestaurantReservations.Any())
            {
                var tableID = dataContext.RestaurantTables.First().RestaurantTableID;
                var guestID = dataContext.Users.First(u => u.Email == "velsa@gmail.com").UserID;


                var reservation = new RestaurantReservation
                {
                    GuestID = guestID,
                    date_time = DateTime.Now.AddHours(2),
                    status = "Booked",
                    RestaurantTableID = tableID
                };

                dataContext.RestaurantReservations.Add(reservation);
                dataContext.SaveChanges();

            }

            //Seed HotelServiceSchedule
            if (!dataContext.HotelServiceSchedules.Any())
            {
                var scheduleEntries = new List<HotelServiceSchedule>();

                var allServices = dataContext.HotelServices.ToList();
                foreach (var service in allServices)
                {
                    scheduleEntries.Add(new HotelServiceSchedule
                    {
                        HotelServiceId = service.Id,
                        StartTime = DateTime.Today.AddHours(10),
                        EndTime = DateTime.Today.AddHours(11),
                        IsAvailable = true
                    });
                    scheduleEntries.Add(new HotelServiceSchedule
                    {
                        HotelServiceId = service.Id,
                        StartTime = DateTime.Today.AddHours(14),
                        EndTime = DateTime.Today.AddHours(15),
                        IsAvailable = true
                    });
                }
                dataContext.HotelServiceSchedules.AddRange(scheduleEntries);
                dataContext.SaveChanges();
            }


            //Seed HotelServiceReservation
            if (!dataContext.HotelServiceReservations.Any())
            {
                var customer = dataContext.Users.FirstOrDefault(u => u.Email == "orgesa@gmail.com");
                var saunaService = dataContext.HotelServices.FirstOrDefault(s => s.Name == "Sauna Session");
                var schedule = dataContext.HotelServiceSchedules.FirstOrDefault(s => s.HotelServiceId == saunaService.Id);

                if (customer != null && saunaService != null && schedule != null)
                {
                    var reservation = new HotelServiceReservation
                    {
                        UserId = customer.UserID,
                        HotelServiceId = saunaService.Id,
                        ScheduleId = schedule.Id,
                        ReservationTime = DateTime.Now,
                        Status = "Confirmed"

                    };

                    dataContext.HotelServiceReservations.Add(reservation);
                    dataContext.SaveChanges();
                }
            }
        }

    }
}






