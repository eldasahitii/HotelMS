using HotelMS.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace HotelMS.Data
{
    public class DataContext : IdentityDbContext<User>
        //DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {
            
        }

        //public DbSet <User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Recepsionist> Recepsionists { get; set; }
        public DbSet<CleaningStaff> CleaningStaffs { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<User>()
                .HasOne(u=>u.Role)
                .WithMany(r=> r.Users)
                .HasForeignKey(u=>u.RoleID)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<User>()
                .HasOne(u => u.Recepsionist)
                .WithOne(r => r.User)
                .HasForeignKey<Recepsionist>(r => r.UserID)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<User>()
                .HasOne(u => u.CleaningStaff)
                .WithOne(r => r.User)
                .HasForeignKey<CleaningStaff>(cS => cS.UserID)
                .OnDelete(DeleteBehavior.Cascade);

        }
    }
    }

