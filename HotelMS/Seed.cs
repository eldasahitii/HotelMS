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
        using var hmac = new HMACSHA512();
        salt = hmac.Key;
        hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
    }

    public void SeedDataContext()
    {
        // Seed Roles
        if (!dataContext.Roles.Any())
        {
            var roles = new List<Role>
            {
                new Role { RoleType = "Admin" },
                new Role { RoleType = "RoomManager" },
                new Role { RoleType = "RoomRecepsionist" },
                new Role { RoleType = "CleaningManager" },
                new Role { RoleType = "RestaurantManager" },
                new Role { RoleType = "RestaurantHost" },
                new Role { RoleType = "ServiceManager" },
                new Role { RoleType = "ServiceRecepsionist" },
                new Role { RoleType = "CleaningStaff" },
                new Role { RoleType = "Customer" }
            };

            dataContext.Roles.AddRange(roles);
            dataContext.SaveChanges();
        }

        // Seed Users
        if (!dataContext.Users.Any())
        {
            var users = new List<(string FirstName, string LastName, string Email, string Password, string Role)>
            {
                ("Ruvejda", "Jaha", "ruvejda@gmail.com", "Ruvejda123", "Admin"),
                ("Liranda", "Ukaj", "liranda@gmail.com", "Liranda123", "RoomManager"),
                ("Orgesa", "Berisha", "orgesa@gmail.com", "Orgesa123", "RoomRecepsionist"),
                ("Velsa", "Zemaj", "velsa@gmail.com", "Velsa123", "CleaningManager"),
                ("Elda", "Sahiti", "elda@gmail.com", "Elda123", "RestaurantManager"),
                ("Ema", "Salihu", "ema@gmail.com", "Ema123", "RestaurantHost"),
                ("Rona", "Veseli", "rona@gmail.com", "Rona123", "ServiceManager"),
                ("Erblina", "Kadriu", "erblina@gmail.com", "Erblina123", "ServiceRecepsionist"),
                ("Vlera", "Krasniqi", "vlera@gmail.com", "Vlera123", "CleaningStaff"),
                ("Erza", "Musliu", "erza@gmail.com", "Erza123", "Customer")
            };

            foreach (var user in users)
            {
                CreatePasswordHash(user.Password, out var hash, out var salt);
                var roleID = dataContext.Roles.First(r => r.RoleType == user.Role).RoleID;

                dataContext.Users.Add(new User
                {
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Email = user.Email,
                    PasswordHash = hash,
                    PasswordSalt = salt,
                    CreatedAt = DateTime.Now,
                    RoleID = roleID
                });
            }

            dataContext.SaveChanges();
        }

        // Seed RoomStatuses
        if (!dataContext.RoomStatuses.Any())
        {
            dataContext.RoomStatuses.AddRange(new[]
            {
                new RoomStatus { RoomStatusName = "Available" },
                new RoomStatus { RoomStatusName = "Occupied" },
                new RoomStatus { RoomStatusName = "Cleaning" },
                new RoomStatus { RoomStatusName = "Completed" }
            });
            dataContext.SaveChanges();
        }

        // Seed ReservationStatuses
        if (!dataContext.ReservationStatuses.Any())
        {
            dataContext.ReservationStatuses.AddRange(new[]
            {
                new ReservationStatus { ReservationStatusName = "Confirmed" },
                new ReservationStatus { ReservationStatusName = "Cancelled" },
                new ReservationStatus { ReservationStatusName = "Completed" },
                new ReservationStatus { ReservationStatusName = "Pending" }
            });
            dataContext.SaveChanges();
        }

        // Seed RoomTypes
        if (!dataContext.RoomTypes.Any())
        {
            dataContext.RoomTypes.AddRange(new[]
            {
                new RoomType { Name = "Standard" },
                new RoomType { Name = "Deluxe" },
                new RoomType { Name = "Suite" }
            });
            dataContext.SaveChanges();
        }

        // Seed Rooms
        if (!dataContext.Rooms.Any())
        {
            var standardID = dataContext.RoomTypes.First(rt => rt.Name == "Standard").RoomTypeID;
            var deluxeID = dataContext.RoomTypes.First(rt => rt.Name == "Deluxe").RoomTypeID;
            var suiteID = dataContext.RoomTypes.First(rt => rt.Name == "Suite").RoomTypeID;
            var statusID = dataContext.RoomStatuses.First(rs => rs.RoomStatusName == "Available").RoomStatusID;

            dataContext.Rooms.AddRange(new[]
            {
                new Room
                {
                    Name = "Single Room",
                    Capacity = "1-2 Persons",
                    Size = "15m²",
                    Description = "A cozy single room with modern amenities.",
                    Price = 50.00m,
                    CreatedAt = DateTime.Now,
                    RoomTypeID = standardID,
                    RoomStatusID = statusID
                },
                new Room
                {
                    Name = "Double Room",
                    Capacity = "2 Adults",
                    Size = "25m²",
                    Description = "A spacious double room with a comfortable bed.",
                    Price = 80.00m,
                    CreatedAt = DateTime.Now,
                    RoomTypeID = deluxeID,
                    RoomStatusID = statusID
                },
                new Room
                {
                    Name = "Twin Room",
                    Capacity = "2-3 Persons",
                    Size = "23m²",
                    Description = "A twin room with two beds.",
                    Price = 70.00m,
                    CreatedAt = DateTime.Now,
                    RoomTypeID = suiteID,
                    RoomStatusID = statusID
                }
            });

            dataContext.SaveChanges();
        }

        // Seed ReviewCategories
        if (!dataContext.ReviewCategories.Any())
        {
            dataContext.ReviewCategories.AddRange(new[]
            {
                new ReviewCategory { CategoryName = "Room" },
                new ReviewCategory { CategoryName = "Restaurant" },
                new ReviewCategory { CategoryName = "Cleaning Staff" },
                new ReviewCategory { CategoryName = "Service" }
            });

            dataContext.SaveChanges();
        }

        // Seed Reviews
        if (!dataContext.Reviews.Any())
        {
            var customer = dataContext.Users.FirstOrDefault(u => u.Email == "erza@gmail.com");
            var roomCategory = dataContext.ReviewCategories.FirstOrDefault(c => c.CategoryName == "Room");

            if (customer != null && roomCategory != null)
            {
                dataContext.Reviews.AddRange(new[]
                {
                    new Review
                    {
                        UserID = customer.UserID,
                        Rating = 5,
                        Comment = "Excellent service and very clean rooms!",
                        Date = DateTime.Now.AddDays(-2),
                        ReviewCategoryID = roomCategory.ReviewCategoryID
                    },
                    new Review
                    {
                        UserID = customer.UserID,
                        Rating = 4,
                        Comment = "Nice hotel, breakfast could improve.",
                        Date = DateTime.Now.AddDays(-1),
                        ReviewCategoryID = roomCategory.ReviewCategoryID
                    }
                });

                dataContext.SaveChanges();
            }
        }

        // Seed HotelServices
        if (!dataContext.HotelServices.Any())
        {
            dataContext.HotelServices.AddRange(new[]
            {
                new HotelService
                {
                    Type = "Pool & Spa",
                    Name = "Sauna Session",
                    Description = "30-minute sauna to relax your body",
                    Price = 30.00m
                },
                new HotelService
                {
                    Type = "Events",
                    Name = "Wedding Hall Booking",
                    Description = "Spacious hall for weddings",
                    Price = 500.00m
                }
            });

            dataContext.SaveChanges();
        }

        // Seed MenuCategories and MenuItems
        if (!dataContext.MenuCategories.Any())
        {
            var categories = new List<MenuCategory>
            {
                new MenuCategory { Name = "Appetizers" },
                new MenuCategory { Name = "Main Courses" },
                new MenuCategory { Name = "Desserts" },
                new MenuCategory { Name = "Drinks" }
            };
            dataContext.MenuCategories.AddRange(categories);
            dataContext.SaveChanges();
        }

        if (!dataContext.MenuItems.Any())
        {
            var appetizerID = dataContext.MenuCategories.First(c => c.Name == "Appetizers").MenuCategoryID;
            var mainsID = dataContext.MenuCategories.First(c => c.Name == "Main Courses").MenuCategoryID;

            dataContext.MenuItems.AddRange(new[]
            {
                new MenuItem { Name = "Bruschetta", Description = "Grilled bread with tomato & basil", Price = 4.99, MenuCategoryID = appetizerID },
                new MenuItem { Name = "Spaghetti", Description = "Classic pasta", Price = 10.99, MenuCategoryID = mainsID }
            });

            dataContext.SaveChanges();
        }
    }
}


    

