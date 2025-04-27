using HotelMS.Models;
using HotelMS.Data;
using Microsoft.AspNetCore.Http.HttpResults;
using System.Linq;

namespace HotelMS
{
    public class Seed
    {
        private readonly DataContext dataContext;
        public Seed(DataContext dataContext)
        {
            this.dataContext = dataContext;
        }
        public void SeedDataContext()
        {
            // Seed Roles first
            if (!dataContext.Roles.Any())
            {
                var adminRole = new Role() { Name = "Admin" };
                var recepsionistRole = new Role() { Name = "Recepsionist" };
                var cleaningStaffRole = new Role() { Name = "Cleaning Staff" };
                var customerRole = new Role() { Name = "Customer" };

                dataContext.Roles.AddRange(adminRole, recepsionistRole, cleaningStaffRole, customerRole);
                dataContext.SaveChanges();
            }

            // Seed Users
            if (!dataContext.Users.Any())
            {
                var adminRoleID = dataContext.Roles.FirstOrDefault(r => r.Name == "Admin")?.RoleID;
                var recepsionistRoleID = dataContext.Roles.FirstOrDefault(r => r.Name == "Recepsionist")?.RoleID;
                var cleaningStaffRoleID = dataContext.Roles.FirstOrDefault(r => r.Name == "Cleaning Staff")?.RoleID;
                var customerRoleID = dataContext.Roles.FirstOrDefault(r => r.Name == "Customer")?.RoleID;

                if (adminRoleID == null || recepsionistRoleID == null || cleaningStaffRoleID == null || customerRoleID == null)
                {
                    // Log and handle missing roles in some way
                    return;
                }

                var users = new List<User>()
                {
                    new User() { Username = "RuvejdaJaha", Email = "ruvejda@gmail.com", Password = "Ruvejda123", CreatedAt = DateTime.Now, RoleID = adminRoleID.Value },
                    new User() { Username = "LirandaUkaj", Email = "liranda@gmail.com", Password = "Liranda123", CreatedAt = DateTime.Now, RoleID = recepsionistRoleID.Value },
                    new User() { Username = "OrgesaBerisha", Email = "orgesa@gmail.com", Password = "Orgesa123", CreatedAt = DateTime.Now, RoleID = cleaningStaffRoleID.Value },
                    new User() { Username = "VelsaZemaj", Email = "velsa@gmail.com", Password = "Velsa123", CreatedAt = DateTime.Now, RoleID = customerRoleID.Value }
                };

                dataContext.Users.AddRange(users);
                dataContext.SaveChanges();
            }
        }
    }
}

