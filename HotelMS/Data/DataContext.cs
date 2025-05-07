using HotelMS.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace HotelMS.Data
{
    public class DataContext : DbContext
         
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {
            
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<CleaningStaff> CleaningStaff { get; set; }
        public DbSet<CleaningStatus> CleaningStatuses { get; set; }
        public DbSet<Room> Rooms { get; set; }
        public DbSet<RoomStatus> RoomStatuses { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<User>()
                .HasOne(u=>u.Role)
                .WithMany(r=> r.Users)
                .HasForeignKey(u=>u.RoleID)
                .OnDelete(DeleteBehavior.Cascade);


             modelBuilder.Entity<CleaningStaff>()
          .HasOne(cs => cs.User)
          .WithOne(u => u.CleaningStaff)
          .HasForeignKey<CleaningStaff>(cs => cs.UserID)
            .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<CleaningStatus>()
               .HasOne(cs => cs.Room)
               .WithMany(r => r.CleaningStatuses)
               .HasForeignKey(cs => cs.RoomID)
               .OnDelete(DeleteBehavior.Cascade);
          
            modelBuilder.Entity<RoomStatus>()
                .HasOne(rs => rs.Room)
                .WithMany(r => r.RoomStatuses)
                .HasForeignKey(rs => rs.RoomID)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
    }

