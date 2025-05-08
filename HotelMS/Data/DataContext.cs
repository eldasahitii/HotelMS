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
        public DbSet<Room> Rooms { get; set; }
        public DbSet<RoomReservation> RoomReservations { get; set; }
        public DbSet<RoomType> RoomTypes { get; set; }
        public DbSet<RoomStatus> RoomStatuses { get; set; }
        public DbSet<ReservationStatus> ReservationStatuses { get; set; }




        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<User>()
                .HasOne(u=>u.Role)
                .WithMany(r=> r.Users)
                .HasForeignKey(u=>u.RoleID)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<RoomReservation>()
           .HasOne(rr => rr.User)
           .WithMany(u => u.RoomReservations)
           .HasForeignKey(rr => rr.UserID)
           .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Room>()
          .HasOne(r => r.RoomType)
          .WithMany(rt => rt.Rooms)
          .HasForeignKey(r => r.RoomTypeID)
          .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<RoomReservation>()
           .HasOne(rr => rr.Room)
           .WithMany(r => r.Reservations)
           .HasForeignKey(rr => rr.RoomID)
           .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Room>()
            .HasOne(r => r.RoomStatus)           
            .WithMany(rs => rs.Rooms)
            .HasForeignKey(r => r.RoomStatusID)
            .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<RoomReservation>()
           .HasOne(rr => rr.ReservationStatus)
           .WithMany(rs => rs.RoomReservations)
           .HasForeignKey(rr => rr.ReservationStatusID)
            .OnDelete(DeleteBehavior.Restrict);








        }
    }
    }

