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

            var lirandaUserID = dataContext.Users.First(u => u.Email == "liranda@gmail.com").UserID;
            var velsaUserID = dataContext.Users.First(u => u.Email == "velsa@gmail.com").UserID;
            var eldaUserID = dataContext.Users.First(u => u.Email == "elda@gmail.com").UserID;

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
            RoomNumber="100A",
            CreatedAt = DateTime.Now,
            RoomTypeID = juniorRoomTypeID,
            RoomStatusID = availableStatusID
        },
        new Room()
        {
            RoomNumber="101A",
            CreatedAt = DateTime.Now,
            RoomTypeID = deluxeRoomTypeID,
            RoomStatusID = availableStatusID
        },
        new Room()
        {
            RoomNumber="102A",
            CreatedAt = DateTime.Now,
            RoomTypeID = doubleRoomTypeID,
            RoomStatusID = availableStatusID
        },
        new Room()
        {
            RoomNumber="103A",
            CreatedAt = DateTime.Now,
            RoomTypeID = twinRoomTypeID,
            RoomStatusID = availableStatusID
        },
        new Room()
        {
            RoomNumber="104A",
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

            // **Seed Hotel Services directly here**

            // Seed HotelServices

            if (!dataContext.HotelServices.Any())
            {
                var hotelServices = new List<HotelService>
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
                    }
                    };
                }
            }
        // Seed HotelServiceDetails
        if (!dataContext.HotelServiceDetails.Any())
        {
            var spaService = dataContext.HotelServices.FirstOrDefault(s => s.Name == "Spa & Wellness");
            var eventService = dataContext.HotelServices.FirstOrDefault(s => s.Name == "Events & Banquets");

            if (spaService != null && eventService != null)
            {
                var serviceDetails = new List<HotelServiceDetail>
                {
                    new HotelServiceDetail
                    {
                         ServiceId = spaService.Id,
                         Title = "Heated Indoor Pool",
                         Description = "Relax in our temperature-controlled indoor pool, perfect for year-round swims. Ideal for solo visitors or families looking for a calm, refreshing environment regardless of the season. Enjoy clean, modern facilities and a peaceful atmosphere designed for your comfort.",
                         ImageUrl = "../../Assets/images/indoorpool3.png",
                         Price = 25.00m
                    },
                    new HotelServiceDetail
                    {
                        ServiceId = spaService.Id,
                        Title = "Scenic Outdoor Pool",
                        Description = "Escape to our breathtaking outdoor pool area, where tranquility meets natural beauty. Surrounded by lush greenery and designed with relaxation in mind, our expansive pool offers the perfect setting to soak up the sun or enjoy a peaceful swim. Lounge on comfortable sunbeds, sip refreshing drinks from our poolside bar, and take in the serene views that create a true resort-style experience.",
                        ImageUrl = "../../Assets/images/spa.jpg",
                        Price = 50.00m
                    },
                    new HotelServiceDetail
                    {
                        ServiceId = spaService.Id,
                        Title = "Sauna Room",
                        Description = "Experience the soothing warmth of our dedicated sauna room, designed to relax muscles, improve circulation, and promote overall well-being. Enjoy the quiet, wood-lined space as heat gently eases tension and clears your mind. Perfect for unwinding after a swim or simply taking time for yourself in a peaceful setting.",
                        ImageUrl = "../../Assets/images/pool2.jpg",
                        Price = 30.00m
                    },
                    new HotelServiceDetail
                    {
                        ServiceId = eventService.Id,
                        Title = "Wedding Hall",
                        Description = "Elegant hall suitable for weddings up to 300 guests.",
                        ImageUrl = "/images/services/wedding.jpg",
                        Price = 500.00m
                    },
                    new HotelServiceDetail
                    {
                        ServiceId = eventService.Id,
                        Title = "Conference Room",
                         Description = "Fully-equipped room for business meetings and seminars.",
                        ImageUrl = "/images/services/conference.jpg",
                        Price = 400.00m
                    }

                };
                dataContext.HotelServiceDetails.AddRange(serviceDetails);
                dataContext.SaveChanges();
            }

        }

















    }
}
   




  

