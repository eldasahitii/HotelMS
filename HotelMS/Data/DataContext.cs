using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using HotelMS.Models;
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
        public DbSet<Review> Reviews { get; set; }
        public DbSet<ReviewCategory> ReviewCategories { get; set; }
        public DbSet<Room> Rooms { get; set; }
        public DbSet<RoomReservation> RoomReservations { get; set; }
        public DbSet<RoomType> RoomTypes { get; set; }
        public DbSet<CleaningStaff> CleaningStaff { get; set; }
        public DbSet<CleaningAssignment> CleaningAssignments { get; set; }
        public DbSet<RoomStatus> RoomStatuses { get; set; }
        public DbSet<ReservationStatus> ReservationStatuses { get; set; }
        public DbSet<HotelService> HotelServices { get; set; }
        public DbSet<HotelServiceDetail> HotelServiceDetails { get; set; }
        public DbSet<HotelServiceReservation> HotelServiceReservations { get; set; }
        public DbSet<RoomImage> RoomImages { get; set; }
        public DbSet<RoomRecepsionist> RoomRecepsionists { get; set; }
        public DbSet<MenuCategory> MenuCategories { get; set; }
        public DbSet<MenuItem> MenuItems { get; set; }
        public DbSet<RestaurantTable> RestaurantTables { get; set; }
        public DbSet<RestaurantReservation> RestaurantReservations { get; set; }
        public DbSet<Manager> Managers { get; set; }
        public DbSet<ManagerType> ManagerTypes { get; set; }
        public DbSet<RestaurantGuest> RestaurantGuests { get; set; }
        public DbSet<RestaurantSettings> RestaurantSettings { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User ↔ Role
            modelBuilder.Entity<User>()
                .HasOne(u => u.Role)
                .WithMany(r => r.Users)
                .HasForeignKey(u => u.RoleID)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<User>()
                .HasOne(u => u.RoomRecepsionist)
                .WithOne(rr => rr.User)
                .HasForeignKey<RoomRecepsionist>(rr => rr.UserID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<User>()
                .HasOne(u => u.Manager)
                .WithOne(m => m.User)
                .HasForeignKey<Manager>(m => m.UserID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Manager>()
                .HasOne(m => m.ManagerType)
                .WithMany(mt => mt.Managers)
                .HasForeignKey(m => m.ManagerTypeID)
                .IsRequired()
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ManagerType>()
                .Property(mt => mt.Name)
                .IsRequired()
                .HasMaxLength(50);

            // RoomReservation ↔ User
            modelBuilder.Entity<RoomReservation>()
                .HasOne(rr => rr.User)
                .WithMany(u => u.RoomReservations)
                .HasForeignKey(rr => rr.UserID)
                .OnDelete(DeleteBehavior.Cascade);

            // Room ↔ RoomType
            modelBuilder.Entity<Room>()
                .HasOne(r => r.RoomType)
                .WithMany(rt => rt.Rooms)
                .HasForeignKey(r => r.RoomTypeID)
                .OnDelete(DeleteBehavior.Cascade);

            // RoomReservation ↔ Room
            modelBuilder.Entity<RoomReservation>()
                .HasOne(rr => rr.Room)
                .WithMany(r => r.Reservations)
                .HasForeignKey(rr => rr.RoomID)
                .OnDelete(DeleteBehavior.Cascade);

            // Room ↔ RoomStatus
            modelBuilder.Entity<Room>()
                .HasOne(r => r.RoomStatus)
                .WithMany(rs => rs.Rooms)
                .HasForeignKey(r => r.RoomStatusID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<RoomImage>()
                .HasOne(ri => ri.RoomType)
                .WithMany(r => r.RoomImages)
                .HasForeignKey(ri => ri.RoomTypeID)
                .OnDelete(DeleteBehavior.Cascade);

            // RoomReservation ↔ ReservationStatus
            modelBuilder.Entity<RoomReservation>()
                .HasOne(rr => rr.ReservationStatus)
                .WithMany(rs => rs.RoomReservations)
                .HasForeignKey(rr => rr.ReservationStatusID)
                .OnDelete(DeleteBehavior.Restrict);

            // CleaningStaff ↔ User
            modelBuilder.Entity<CleaningStaff>()
                .HasOne(cs => cs.User)
                .WithMany()
                .HasForeignKey(cs => cs.UserID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<CleaningStaff>()
                .HasIndex(cs => cs.UserID)
                .IsUnique();

            modelBuilder.Entity<CleaningStaff>()
                .HasOne(cs => cs.AssignedBy)
                .WithMany()
                .HasForeignKey(cs => cs.AssignedByUserID)
                .OnDelete(DeleteBehavior.Restrict);

            // CleaningAssignment ↔ CleaningStaff
            modelBuilder.Entity<CleaningAssignment>()
                .HasOne(ca => ca.CleaningStaff)
                .WithMany(cs => cs.CleaningAssignments)
                .HasForeignKey(ca => ca.CleaningStaffID)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<CleaningAssignment>()
                .HasOne(ca => ca.Room)
                .WithMany()
                .HasForeignKey(ca => ca.RoomID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<CleaningAssignment>()
                .HasOne(ca => ca.AssignedBy)
                .WithMany()
                .HasForeignKey(ca => ca.AssignedByUserID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<CleaningStaff>()
                .Property(cs => cs.Shift)
                .HasConversion<string>();

            // HotelService → HotelServiceSchedule
            modelBuilder.Entity<HotelServiceDetail>()
                .HasOne(s => s.Service)
                .WithMany(h => h.HotelServiceDetails)
                .HasForeignKey(s => s.HotelServiceId)
                .OnDelete(DeleteBehavior.Cascade);

            // HotelService → HotelServiceReservation
            modelBuilder.Entity<HotelServiceReservation>()
                .HasOne(r => r.Service)
                .WithMany(s => s.HotelServiceReservations)
                .HasForeignKey(r => r.HotelServiceId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<HotelServiceReservation>()
                .HasOne(r => r.User)
                .WithMany()
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<HotelServiceReservation>()
                .HasOne(r => r.Schedule)
                .WithMany()
                .HasForeignKey(r => r.ScheduleId)
                .OnDelete(DeleteBehavior.Restrict);

            // Restaurant
            modelBuilder.Entity<MenuItem>()
                .HasOne(mi => mi.MenuCategory)
                .WithMany(mc => mc.MenuItems)
                .HasForeignKey(mi => mi.MenuCategoryID)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<RestaurantReservation>()
                .HasOne(rr => rr.RestaurantTable)
                .WithMany(rt => rt.Reservations)
                .HasForeignKey(rr => rr.RestaurantTableID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<RestaurantReservation>()
                .HasOne(rr => rr.User)
                .WithMany()
                .HasForeignKey(rr => rr.UserID)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}


