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
        public DbSet<HotelServiceCards> HotelServiceCards { get; set; }
        public DbSet<HotelServiceReservation> HotelServiceReservations { get; set; }
        public DbSet<ServiceRecepsionist> ServiceRecepsionists { get; set; }
        public DbSet<ServiceStatus> ServiceStatuses { get; set; }
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

            // HotelServiceReservation ↔ HotelService (many-to-one)
            modelBuilder.Entity<HotelServiceReservation>()
                .HasOne(r => r.Service)
                .WithMany()  // Assuming HotelService does NOT have navigation property for reservations
                .HasForeignKey(r => r.ServiceID)
                .OnDelete(DeleteBehavior.Restrict);

            // HotelServiceReservation ↔ User (many-to-one)
            modelBuilder.Entity<HotelServiceReservation>()
                .HasOne(r => r.User)
                .WithMany()  // Assuming User does NOT have collection of reservations
                .HasForeignKey(r => r.UserID)
                .OnDelete(DeleteBehavior.Restrict);

                modelBuilder.Entity<ServiceStatus>()
               .HasMany(s => s.ServiceReservations)
               .WithOne(r => r.ServiceStatus)
               .HasForeignKey(r => r.ServiceStatusID)
               .OnDelete(DeleteBehavior.Restrict);


            // HotelServiceReservation ↔ ServiceRecepsionist (many-to-one, nullable)
            modelBuilder.Entity<HotelServiceReservation>()
                .HasOne(r => r.CreatedByServiceReceptionist)
                .WithMany()  // Assuming ServiceRecepsionist does NOT have collection of reservations
                .HasForeignKey(r => r.CreatedByServiceReceptionistID)
                .OnDelete(DeleteBehavior.SetNull);

            // HotelServiceReservation ↔ ReservationStatus (many-to-one)
            modelBuilder.Entity<HotelServiceReservation>()
                .HasOne(r => r.ReservationStatus)
                .WithMany(rs => rs.ServiceReservations)
                .HasForeignKey(r => r.ReservationStatusID)
                .OnDelete(DeleteBehavior.Restrict);

            // ServiceRecepsionist ↔ User (one-to-one)
            modelBuilder.Entity<ServiceRecepsionist>()
                .HasOne(sr => sr.User)
                .WithOne()
                .HasForeignKey<ServiceRecepsionist>(sr => sr.UserID)
                .OnDelete(DeleteBehavior.Restrict);

            // ServiceRecepsionist ↔ User (AssignedByUser) (many-to-one)
            modelBuilder.Entity<ServiceRecepsionist>()
                .HasOne(sr => sr.AssignedByUser)
                .WithMany()
                .HasForeignKey(sr => sr.AssignedByUserID)
                .OnDelete(DeleteBehavior.Restrict);

            // ServiceStatus ↔ HotelServiceReservation (one-to-many)
            modelBuilder.Entity<ServiceStatus>()
                .HasMany(ss => ss.ServiceReservations)
                .WithOne(r => r.HotelServiceReservation)
                .HasForeignKey(r => r.ReservationStatusID)
                .OnDelete(DeleteBehavior.Restrict);


            modelBuilder.Entity<ServiceRecepsionist>()
           .HasOne(sr => sr.User)
           .WithMany() // or .WithOne(u => u.ServiceRecepsionist) if you have that navigation
           .HasForeignKey(sr => sr.UserID);


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


