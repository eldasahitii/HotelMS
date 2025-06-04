
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

        if (!dataContext.ManagerTypes.Any())
        {
            var managerTypes = new List<ManagerType>
    {
        new ManagerType() { Name = "Room Manager" },
        new ManagerType() { Name = "Cleaning Manager" },
        new ManagerType() { Name = "Restaurant Manager" },
        new ManagerType() { Name = "Services Manager" },
        // Add other manager types as needed
    };

            dataContext.ManagerTypes.AddRange(managerTypes);
            dataContext.SaveChanges();
        }

        if (!dataContext.Managers.Any())
        {
            var roomManagerTypeID = dataContext.ManagerTypes.First(mt => mt.Name == "Room Manager").ManagerTypeID;
            var cleaningManagerTypeID = dataContext.ManagerTypes.First(mt => mt.Name == "Cleaning Manager").ManagerTypeID;
            var restaurantManagerTypeID = dataContext.ManagerTypes.First(mt => mt.Name == "Restaurant Manager").ManagerTypeID;
            var servicesManagerTypeID = dataContext.ManagerTypes.First(mt => mt.Name == "Services Manager").ManagerTypeID;

            var lirandaUserID = dataContext.Users.First(u => u.Email == "liranda@gmail.com").UserID;
            var velsaUserID = dataContext.Users.First(u => u.Email == "velsa@gmail.com").UserID;
            var eldaUserID = dataContext.Users.First(u => u.Email == "elda@gmail.com").UserID;
            var ronaUserID = dataContext.Users.First(u => u.Email == "rona@gmail.com").UserID;

            var managers = new List<Manager>
    {
        new Manager()
        {
            UserID = lirandaUserID,
            ManagerTypeID = roomManagerTypeID,
            AssignedAt = DateTime.UtcNow
        },
        new Manager()
        {
            UserID = velsaUserID,
            ManagerTypeID = cleaningManagerTypeID,
            AssignedAt = DateTime.UtcNow
        },
        new Manager()
        {
            UserID = eldaUserID,
            ManagerTypeID = restaurantManagerTypeID,
            AssignedAt = DateTime.UtcNow
        },
        new Manager()
        {
            UserID = ronaUserID,
            ManagerTypeID = servicesManagerTypeID,
            AssignedAt = DateTime.UtcNow
        }
    };

            dataContext.Managers.AddRange(managers);
            dataContext.SaveChanges();
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
        new RoomType()
        {
            Name = "Junior Room",
            Capacity = "1-2 PERSONS",
            Size = "22M2",
            Description = "Step into a world of comfort and elegance, where every detail is designed to make your stay truly special. Wake up to a delicious breakfast delivered right to your door, letting you enjoy a leisurely morning without leaving your room.\r\n\r\nStay connected with fast, reliable WiFi, whether you need to catch up on work or share your favorite moments. When it’s time to unwind, take a refreshing swim in the sparkling pool or recharge your energy in the fully equipped gym.\r\n\r\nFor your convenience, your room features a well-stocked mini bar with premium drinks and snacks, and our attentive room service is always ready to bring you whatever you need, anytime.\r\n\r\nWhether you’re here to relax or stay active, you’ll find everything you need for a perfect balance of luxury and ease—all within the comfort of your beautiful room.",
            Price = 120m
        },
        new RoomType()
        {
            Name = "Deluxe Room",
            Capacity = "1-2 PERSONS",
            Size = "22M2",
            Description = "Enjoy an elevated stay in our Deluxe Room, thoughtfully designed to combine comfort and style. Rest peacefully on a plush king-size bed, and start your mornings right with a complimentary breakfast delivered directly to your room. Stay connected throughout your visit with high-speed Wi-Fi, perfect for both work and leisure.\r\n\r\nIndulge in refreshing swims at the pool or maintain your fitness routine in the fully equipped gym. For your convenience, 24-hour room service is available to attend to your every need, whether it’s a late-night snack or a relaxing coffee brewed with your in-room coffee machine.\r\n\r\nYour room also features a well-stocked mini bar, ideal for unwinding after a day of activities. The luxurious en-suite bathroom includes premium toiletries, adding an extra touch of elegance to your stay.\r\n\r\nExperience the perfect blend of relaxation and convenience in the Deluxe Room — your stylish home away from home.\r\n\r\n",
            Price = 140m
        },
        new RoomType()
        {
            Name = "Double Room",
            Capacity = "1-2 PERSONS",
            Size = "22M2",
            Description = "Step into our stylish Double Room, designed for comfort and convenience. Rest easy on a cozy double bed while enjoying modern touches like a smart TV and a dedicated workspace, perfect for both relaxation and productivity. Keep your belongings secure in the in-room safe, and stay comfortable year-round with air conditioning.\r\n\r\nStart your day with a fresh breakfast delivered right to your door, and stay connected with complimentary high-speed Wi-Fi throughout your stay. Take advantage of 24-hour room service to satisfy any craving at any time.\r\n\r\nWhen it’s time to unwind, enjoy access to the refreshing pool or keep up with your fitness routine in the gym. A well-stocked mini bar awaits for you to relax with your favorite drink after a busy day.\r\n\r\nThis room offers everything you need for a seamless and enjoyable stay.",
            Price = 110m
        },
        new RoomType()
        {
            Name = "Twin Room",
            Capacity = "1-2 PERSONS",
            Size = "30M2",
            Description = "Perfect for friends or colleagues traveling together, the Twin Room offers two comfortable single beds and a private bathroom stocked with complimentary toiletries. Stay connected with high-speed Wi-Fi and enjoy the convenience of a mini fridge for your refreshments.\r\n\r\nStart your day with a delicious breakfast served to your room, and rely on daily housekeeping to keep your space fresh and tidy. When you want to relax or stay active, take a dip in the pool or visit the gym to keep up with your routine.\r\n\r\nRound out your stay with 24-hour room service and a well-stocked mini bar, ensuring everything you need is right at your fingertips.\r\n\r\nExperience comfort and convenience tailored for shared stays in the spacious Twin Room",
            Price = 130m
        },
        new RoomType()
        {
            Name = "Superior Twin Room",
            Capacity = "2-3 PERSONS",
            Size = "28M2",
            Description = "Designed to comfortably accommodate up to three guests, the Superior Twin Room features two twin beds alongside a convenient pull-out sofa. Relax and unwind with modern amenities including a flat-screen TV and a well-stocked minibar for your favorite refreshments.\r\n\r\nStart each day with a complimentary breakfast, and enjoy the ease of 24-hour room service ready to attend to your needs at any time. Stay connected with high-speed Wi-Fi throughout your stay.\r\n\r\nTake advantage of access to the pool and gym facilities, perfect for both relaxation and staying active. Whether you’re traveling with family or friends, this room offers the perfect balance of space, comfort, and convenience.",
            Price = 160m
        }
    };

            dataContext.RoomTypes.AddRange(roomTypes);
            dataContext.SaveChanges();
        }

        // ⚠️ Pre-seed fallback RoomTypes to prevent First() crash (do NOT remove this)
        var requiredRoomTypes = new[]
        {
    new RoomType { Name = "Junior Room", Capacity = "1-2 PERSONS", Size = "22M2", Description = "Auto-added fallback", Price = 120 },
    new RoomType { Name = "Deluxe Room", Capacity = "1-2 PERSONS", Size = "22M2", Description = "Auto-added fallback", Price = 140 },
    new RoomType { Name = "Double Room", Capacity = "1-2 PERSONS", Size = "22M2", Description = "Auto-added fallback", Price = 110 },
    new RoomType { Name = "Twin Room", Capacity = "1-2 PERSONS", Size = "30M2", Description = "Auto-added fallback", Price = 130 },
    new RoomType { Name = "Superior Twin Room", Capacity = "2-3 PERSONS", Size = "28M2", Description = "Auto-added fallback", Price = 160 }
};

        foreach (var rt in requiredRoomTypes)
        {
            if (!dataContext.RoomTypes.Any(x => x.Name == rt.Name))
            {
                dataContext.RoomTypes.Add(rt);
            }
        }
        dataContext.SaveChanges();


        // Seed Rooms
        if (!dataContext.Rooms.Any())
        {
            var juniorRoomTypeID = dataContext.RoomTypes.First(rt => rt.Name == "Junior Room").RoomTypeID;
            var deluxeRoomTypeID = dataContext.RoomTypes.First(rt => rt.Name == "Deluxe Room").RoomTypeID;
            var doubleRoomTypeID = dataContext.RoomTypes.First(rt => rt.Name == "Double Room").RoomTypeID;
            var twinRoomTypeID = dataContext.RoomTypes.First(rt => rt.Name == "Twin Room").RoomTypeID;
            var superiorTwinRoomTypeID = dataContext.RoomTypes.First(rt => rt.Name == "Superior Twin Room").RoomTypeID;

            var availableStatusID = dataContext.RoomStatuses.First(rs => rs.RoomStatusName == "Available").RoomStatusID;

            var rooms = new List<Room>
    {
        new Room()
        {
            RoomNumber="Junior1",
            CreatedAt = DateTime.Now,
            RoomTypeID = juniorRoomTypeID,
            RoomStatusID = availableStatusID
        },
        new Room()
        {
            RoomNumber="Deluxe1",
            CreatedAt = DateTime.Now,
            RoomTypeID = deluxeRoomTypeID,
            RoomStatusID = availableStatusID
        },
        new Room()
        {
            RoomNumber="Double1",
            CreatedAt = DateTime.Now,
            RoomTypeID = doubleRoomTypeID,
            RoomStatusID = availableStatusID
        },
        new Room()
        {
            RoomNumber="Twin1",
            CreatedAt = DateTime.Now,
            RoomTypeID = twinRoomTypeID,
            RoomStatusID = availableStatusID
        },
        new Room()
        {
            RoomNumber="SuperiorTwin1",
            CreatedAt = DateTime.Now,
            RoomTypeID = superiorTwinRoomTypeID,
            RoomStatusID = availableStatusID
        }
    };

            dataContext.Rooms.AddRange(rooms);
            dataContext.SaveChanges();
        }

        if (!dataContext.RoomImages.Any())
        {
            var juniorRoomTypeID = dataContext.RoomTypes.First(rt => rt.Name == "Junior Room").RoomTypeID;
            var deluxeRoomTypeID = dataContext.RoomTypes.First(rt => rt.Name == "Deluxe Room").RoomTypeID;
            var doubleRoomTypeID = dataContext.RoomTypes.First(rt => rt.Name == "Double Room").RoomTypeID;
            var twinRoomTypeID = dataContext.RoomTypes.First(rt => rt.Name == "Twin Room").RoomTypeID;
            var superiorTwinRoomTypeID = dataContext.RoomTypes.First(rt => rt.Name == "Superior Twin Room").RoomTypeID;

            var roomImages = new List<RoomImage>
{
    new RoomImage { RoomTypeID = juniorRoomTypeID, ImageUrl = "Images/roomtypes/dhoma1.jpeg", IsPreview = true },
    new RoomImage { RoomTypeID = juniorRoomTypeID, ImageUrl = "Images/roomtypes/slider3.jpeg", IsPreview = true },
    new RoomImage { RoomTypeID = juniorRoomTypeID, ImageUrl = "Images/roomtypes/dhoma3bath.webp", IsPreview = false },
    new RoomImage { RoomTypeID = juniorRoomTypeID, ImageUrl = "Images/roomtypes/junior.jpg", IsPreview = false },
    new RoomImage { RoomTypeID = juniorRoomTypeID, ImageUrl = "Images/roomtypes/room3-bathroom2.jpg", IsPreview = false },


    new RoomImage { RoomTypeID = deluxeRoomTypeID, ImageUrl = "Images/roomtypes/dhoma22.jpeg", IsPreview = true },
    new RoomImage { RoomTypeID = deluxeRoomTypeID, ImageUrl = "Images/roomtypes/slider4.webp", IsPreview = true },
    new RoomImage { RoomTypeID = deluxeRoomTypeID, ImageUrl = "Images/roomtypes/room2-bathroom.jpg", IsPreview = false },
    new RoomImage { RoomTypeID = deluxeRoomTypeID, ImageUrl = "Images/roomtypes/dhoma22.jpeg", IsPreview = false },
    new RoomImage { RoomTypeID = deluxeRoomTypeID, ImageUrl = "Images/roomtypes/room2-bathrom2.jpg", IsPreview = false },



    new RoomImage { RoomTypeID = doubleRoomTypeID, ImageUrl = "Images/roomtypes/dhoma3.jpeg", IsPreview = true },
    new RoomImage { RoomTypeID = doubleRoomTypeID, ImageUrl = "Images/roomtypes/slider5.jpeg", IsPreview = true },
    new RoomImage { RoomTypeID = doubleRoomTypeID, ImageUrl = "Images/roomtypes/dhoma1details.jpeg", IsPreview = false },
    new RoomImage { RoomTypeID = doubleRoomTypeID, ImageUrl = "Images/roomtypes/dhoma1.jpeg", IsPreview = false },
    new RoomImage { RoomTypeID = doubleRoomTypeID, ImageUrl = "Images/roomtypes/bathroom2-room1.jpg", IsPreview = false },

    new RoomImage { RoomTypeID = twinRoomTypeID, ImageUrl = "Images/roomtypes/woden.jpeg", IsPreview = true },
    new RoomImage { RoomTypeID = twinRoomTypeID, ImageUrl = "Images/roomtypes/junior3.jpg", IsPreview = true },
    new RoomImage { RoomTypeID = twinRoomTypeID, ImageUrl = "Images/roomtypes/twin-bathrom.jpg", IsPreview = false },
    new RoomImage { RoomTypeID = twinRoomTypeID, ImageUrl = "Images/roomtypes/junior3.jpg", IsPreview = false },
    new RoomImage { RoomTypeID = twinRoomTypeID, ImageUrl = "Images/roomtypes/twin-bathroom2.jpg", IsPreview = false },


    new RoomImage { RoomTypeID = superiorTwinRoomTypeID, ImageUrl = "Images/roomtypes/supertwin.jpg", IsPreview = true },
    new RoomImage { RoomTypeID = superiorTwinRoomTypeID, ImageUrl = "Images/roomtypes/slider6.jpeg", IsPreview = true },
    new RoomImage { RoomTypeID = superiorTwinRoomTypeID, ImageUrl = "Images/roomtypes/supertwin-bathroom2.jpg", IsPreview = false },
    new RoomImage { RoomTypeID = superiorTwinRoomTypeID, ImageUrl = "Images/roomtypes/supertwin.jpg", IsPreview = false },
    new RoomImage { RoomTypeID = superiorTwinRoomTypeID, ImageUrl = "Images/roomtypes/tile.jpg", IsPreview = false },
};


            dataContext.RoomImages.AddRange(roomImages);
            dataContext.SaveChanges();
        }




        //if (!dataContext.RoomReservations.Any())
        //{
        //    var availableRoomID = dataContext.Rooms.First(r => r.Title == "Single Room").RoomID;
        //    var customerID = dataContext.Users.First(u => u.Email == "velsa@gmail.com").UserID;
        //    var reservationStatusID = dataContext.ReservationStatuses.First(rs => rs.ReservationStatusName == "Pending").ReservationStatusID;

        //    var reservations = new List<RoomReservation>
        //    {
        //        new RoomReservation()
        //        {
        //            RoomID = availableRoomID,
        //            UserID = customerID,
        //            CheckInDate = DateTime.Now.AddDays(1),
        //            CheckOutDate = DateTime.Now.AddDays(5),
        //            ReservationStatusID = reservationStatusID,
        //            CreatedAt = DateTime.Now

        //        }
        //    };

        //    dataContext.RoomReservations.AddRange(reservations);
        //    dataContext.SaveChanges();
        //}

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
                        ReviewCategoryID = roomCategory.ReviewCategoryID,
                        ManagerReply = "Thanks for the feedback! We'll work on improving breakfast.",
                        ReplyDate = DateTime.Now
                    }
                });

                dataContext.SaveChanges();
            }
        }

        //Seed HotelService
        if (!dataContext.HotelServices.Any())
        {
            var services = new List<HotelService>
            {
                new HotelService
                {
                    HeroImage = "pool6.jpg",
                    HeroTitle = "Welcome to Hotel Services",
                    HeroDescription = "Discover elegance, comfort, and premium hospitality tailored just for you."
                }
            };
            dataContext.HotelServices.AddRange(services);
            dataContext.SaveChanges();
        }

        //Seed HotelServiceCards
        if (!dataContext.HotelServiceCards.Any())
        {
            var services = new List<HotelServiceCards>
            {
                new HotelServiceCards
                {
                    CardImage = "pool6.jpg",
                    CardTitle = "Welcome to Hotel Services",
                    CardDescription = "Discover elegance, comfort, and premium hospitality tailored just for you.",
                    CardLink = "See more button"
                },
                new HotelServiceCards
                {
                    CardImage = "pool6.jpg",
                    CardTitle = "Welcome to Hotel Services",
                    CardDescription = "Discover elegance, comfort, and premium hospitality tailored just for you.",
                    CardLink = "See more button"
                }
            };
            dataContext.HotelServiceCards.AddRange(services);
            dataContext.SaveChanges();
        }

        if (!dataContext.MenuCategories.Any())
        {
            var categories = new List<MenuCategory>
        {
            new MenuCategory {Name = "Breakfast"},
            new MenuCategory { Name = "Lunch" },
            new MenuCategory { Name = "Dinner" },
            new MenuCategory { Name = "Dessert" }
        };

            dataContext.MenuCategories.AddRange(categories);
            dataContext.SaveChanges();
        }

        if (!dataContext.MenuItems.Any())
        {
            var breakfastID = dataContext.MenuCategories.First(c => c.Name == "Breakfast").MenuCategoryID;
            var lunchID = dataContext.MenuCategories.First(c => c.Name == "Lunch").MenuCategoryID;
            var dinnerID = dataContext.MenuCategories.First(c => c.Name == "Dinner").MenuCategoryID;
            var dessertID = dataContext.MenuCategories.First(c => c.Name == "Dessert").MenuCategoryID;

            var menuItems = new List<MenuItem>
    {
        new MenuItem { Name = "Avocado Toast", Description = "Freshly toasted artisan bread topped with creamy avocado and perfectly cooked eggs, finished with a touch of sea salt, chili flakes, and a drizzle of olive oil. A wholesome and flavorful start to your day.", Price = 4.99, image_url="/Images/restaurant/AvocadoToast.png", MenuCategoryID = breakfastID },
        new MenuItem { Name = "Fluffy Pancakes", Description = "Light, airy pancakes stacked high and served warm, with a golden exterior and soft, melt-in-your-mouth center. Perfectly paired with maple syrup, fresh fruit, or a dusting of powdered sugar.", Price = 10.99, image_url="/Images/restaurant/FluffyPancakes.png", MenuCategoryID = breakfastID },
        new MenuItem { Name = "Salmon Bagel", Description = "Toasted bagel layered with silky smoked salmon, cream cheese, fresh dill, capers, and thinly sliced red onions. A classic, savory delight perfect for any time of day.", Price = 5.50, image_url="/Images/restaurant/SalmonBagel.png", MenuCategoryID = breakfastID },
        new MenuItem { Name = "Eggs Benedict", Description = "Two poached eggs served on toasted English muffins with layers of savory ham or smoked salmon, topped with rich, velvety hollandaise sauce. A timeless brunch favorite.", Price = 2.99,image_url="/Images/restaurant/eggsBenedict.jpg", MenuCategoryID = breakfastID },
        new MenuItem { Name = "French Toast", Description = "Golden-brown brioche slices infused with a herbed egg mixture, pan-seared and served with crispy bacon, sautéed mushrooms, and a sprinkle of parmesan. A rich and satisfying twist on a brunch classic.", Price = 2.99,image_url="/Images/restaurant/frenchtoast.jpg", MenuCategoryID = breakfastID },
        new MenuItem { Name = "Waffles", Description = "Crispy on the outside, fluffy on the inside—our golden waffles are served warm with your choice of toppings like fresh fruit, whipped cream, and maple syrup. A deliciously comforting treat for any time of day.", Price = 2.99,image_url="/Images/restaurant/waffles.jpg", MenuCategoryID = breakfastID },
        new MenuItem {Name = "Bruschetta", Description ="Toasted rustic bread topped with a vibrant mix of fresh diced tomatoes, garlic, basil, and a drizzle of extra virgin olive oil. A light and flavorful Italian classic.", Price = 3.55, image_url="/Images/restaurant/bruschetta.jpg", MenuCategoryID = lunchID},
        new MenuItem { Name = "Teriyaki Chicken Rice", Description ="Tender grilled chicken glazed with a rich teriyaki sauce, served over steamed jasmine rice with sautéed vegetables and a sprinkle of sesame seeds. A savory and satisfying Asian-inspired dish.", Price = 4.34, image_url ="/Images/restaurant/chickenrice.jpg", MenuCategoryID = lunchID},
        new MenuItem { Name = "Ceaser Salad", Description = "Crisp romaine lettuce tossed with creamy Caesar dressing, crunchy croutons, and grated Parmesan cheese. Finished with a hint of garlic and optional grilled chicken for added protein.", Price = 5.55, image_url = "/Images/restaurant/ceasersalad.jpg", MenuCategoryID = lunchID},
        new MenuItem { Name = "Shrimp Gyoza", Description = "Delicate dumplings filled with seasoned shrimp and vegetables, pan-seared to a golden crisp and served with a savory soy dipping sauce. A flavorful Japanese appetizer.", Price = 7.88, image_url = "/Images/restaurant/gyoza.jpg", MenuCategoryID = lunchID},
        new MenuItem { Name = "Shrimp Tacos", Description ="Soft corn tortillas filled with juicy, seasoned shrimp, topped with crisp slaw, fresh lime, and a zesty creamy sauce. A vibrant and refreshing coastal favorite.", Price = 7.55, image_url = "/Images/restaurant/shrimptacos.jpg", MenuCategoryID = lunchID},
        new MenuItem { Name = "Pasta", Description ="Al dente pasta served with your choice of classic sauces—from rich and creamy Alfredo to bold tomato-based marinara or fragrant pesto. Finished with Parmesan and fresh herbs for a comforting Italian experience. ", Price = 5.55, image_url = "/Images/restaurant/pasta.jpg", MenuCategoryID = lunchID},
        new MenuItem { Name = "Salmon", Description = "Pan-seared or oven-roasted salmon fillet, cooked to tender perfection and served with seasonal vegetables and a light lemon-butter or herb sauce. A healthy and elegant main course.", Price = 10.0, image_url = "/Images/restaurant/salmon.jpg", MenuCategoryID = dinnerID},
        new MenuItem { Name = "Chicken Mushroom Risotto", Description = "Creamy Arborio rice slowly cooked with tender chicken, sautéed mushrooms, and Parmesan cheese. Finished with a touch of white wine and herbs for a rich, comforting flavor.", Price = 12.55, image_url="/Images/restaurant/risotto.jpg", MenuCategoryID = dinnerID},
        new MenuItem { Name = "Steak", Description = "Juicy, grilled-to-perfection steak seasoned with sea salt and cracked pepper, served with your choice of sides and a rich house-made sauce. A timeless and satisfying classic.", Price = 15.55, image_url = "/Images/restaurant/steak.jpg", MenuCategoryID = dinnerID},
        new MenuItem { Name = "Seafood Pasta", Description = "A medley of fresh seafood—shrimp, mussels, and calamari—tossed with al dente pasta in a fragrant garlic, white wine, and tomato sauce. A rich and flavorful taste of the sea.", Price = 13.33, image_url = "/Images/restaurant/seafoodpasta.jpg", MenuCategoryID = dinnerID},
        new MenuItem { Name = "Lobster", Description = "Succulent whole lobster, steamed or grilled to perfection, served with melted butter, lemon, and seasonal sides. A luxurious and indulgent seafood delicacy.", Price = 20.0, image_url = "/Images/restaurant/lobster.jpg", MenuCategoryID = dinnerID},
        new MenuItem { Name = "Sushi", Description ="An elegant selection of handcrafted sushi rolls and nigiri, featuring fresh fish, seasoned rice, and vibrant vegetables. Served with soy sauce, wasabi, and pickled ginger for a refined Japanese experience.", Price = 25.0, image_url="/Images/restaurant/sushi.jpg", MenuCategoryID = dinnerID},
        new MenuItem {Name = "Tiramisu", Description = "A classic Italian dessert made with layers of espresso-soaked ladyfingers and creamy mascarpone, dusted with cocoa powder. Rich, smooth, and irresistibly indulgent.", Price = 6.0, image_url = "/Images/restaurant/tiramisu.jpg", MenuCategoryID = dessertID},
        new MenuItem { Name = "Apple Crumble Pie", Description = "Warm spiced apples baked beneath a golden, buttery crumble topping, served with a scoop of vanilla ice cream or a drizzle of caramel. A comforting and timeless dessert favorite.", Price = 5.0, image_url="/Images/restaurant/applecrumble.jpg", MenuCategoryID = dessertID},
        new MenuItem {Name = "Chocolate Cake", Description = "Rich, moist layers of decadent chocolate sponge filled and frosted with silky chocolate ganache. A timeless dessert for true chocolate lovers.", Price = 4.5, image_url = "/Images/restaurant/chocolate.jpg", MenuCategoryID = dessertID}


    };

            dataContext.MenuItems.AddRange(menuItems);
            dataContext.SaveChanges();
        }


        if (!dataContext.RestaurantTables.Any())
        {
            var tables = new List<RestaurantTable>
    {
        new RestaurantTable { TableNumber = 1 },
        new RestaurantTable { TableNumber = 2 },
        new RestaurantTable { TableNumber = 3 }
    };

            dataContext.RestaurantTables.AddRange(tables);
            dataContext.SaveChanges();
        }
        if (!dataContext.RestaurantReservations.Any())
        {
            var tableID = dataContext.RestaurantTables.First().RestaurantTableID;

            // Create a restaurant guest
            var guest = new RestaurantGuest
            {
                FirstName = "Velsa",
                LastName = "Zemaj",
                Email = "velsa@gmail.com",
                PhoneNumber = "044-123-456"
            };
            dataContext.RestaurantGuests.Add(guest);
            dataContext.SaveChanges(); // Save first to get the GuestID

            var reservation = new RestaurantReservation
            {
                GuestID = guest.GuestID,
                date_time = DateTime.Now.AddHours(2),
                status = "Booked",
                RestaurantTableID = tableID
            };

            dataContext.RestaurantReservations.Add(reservation);
            dataContext.SaveChanges();
        }




        //Seed HotelServiceSchedule
        if (!dataContext.HotelServiceDetails.Any())
        {
            var scheduleEntries = new List<HotelServiceDetail>();

            var allServices = dataContext.HotelServices.ToList();
            foreach (var service in allServices)
            {
                scheduleEntries.Add(new HotelServiceDetail
                {
                    HotelServiceId = service.Id,
                    StartTime = DateTime.Today.AddHours(10),
                    EndTime = DateTime.Today.AddHours(11),
                    IsAvailable = true
                });
                scheduleEntries.Add(new HotelServiceDetail
                {
                    HotelServiceId = service.Id,
                    StartTime = DateTime.Today.AddHours(14),
                    EndTime = DateTime.Today.AddHours(15),
                    IsAvailable = true
                });
            }
            dataContext.HotelServiceDetails.AddRange(scheduleEntries);
            dataContext.SaveChanges();
        }


        //Seed HotelServiceReservation
        //if (!dataContext.HotelServiceReservations.Any())
        //{
        //    var customer = dataContext.Users.FirstOrDefault(u => u.Email == "orgesa@gmail.com");
        //   // var saunaService = dataContext.HotelServices.FirstOrDefault(s => s.Name == "Sauna Session");
        //    var schedule = dataContext.HotelServiceDetails.FirstOrDefault(s => s.HotelServiceId == saunaService.Id);

        //    if (customer != null && saunaService != null && schedule != null)
        //    {
        //        var reservation = new HotelServiceReservation
        //        {
        //            UserId = customer.UserID,
        //            HotelServiceId = saunaService.Id,
        //            ScheduleId = schedule.Id,
        //            ReservationTime = DateTime.Now,
        //            Status = "Confirmed"

        //        };

        //        dataContext.HotelServiceReservations.Add(reservation);
        //        dataContext.SaveChanges();
        //    }
        //}

        if (!dataContext.RestaurantSettings.Any())
        {
            var homepageSettings = new RestaurantSettings
            {
                WelcomeTitle = "Welcome to Amé Restaurant",
                WelcomeMessage = "Discover the essence of fine dining at Amé Restaurant, where every dish is crafted with organic ingredients, timeless flavors, and a passion for culinary excellence.",
                WelcomeImageUrl = "/Images/restaurant/restaurant.jpg", // Path should match your frontend assets or be publicly hosted

                AboutTitle = "About Amé Restaurant",
                AboutMessage = "At Amé Restaurant, we believe food should not only taste amazing but also be nourishing. Our chefs blend tradition with creativity, using locally sourced organic ingredients to bring every dish to life.",
                AboutImageUrl1 = "/Images/restaurant/restaurantTerrace.jpg",
                AboutImageUrl2 = "/Images/restaurant/restaurantInterior.jpg"
            };

            dataContext.RestaurantSettings.Add(homepageSettings);
            dataContext.SaveChanges();
        }
    }

}














