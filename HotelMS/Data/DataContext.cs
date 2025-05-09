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

        public DbSet<CleaningStaff> CleaningStaff { get; set; }
        public DbSet<CleaningAssignment> CleaningAssignments { get; set; }

        public DbSet<RoomReservation> RoomReservations { get; set; }
        public DbSet<RoomType> RoomTypes { get; set; }
        public DbSet<RoomStatus> RoomStatuses { get; set; }
        public DbSet<ReservationStatus> ReservationStatuses { get; set; }
        public DbSet<HotelService> HotelServices { get; set; }
        public DbSet<HotelServiceSchedule> HotelServiceSchedules { get; set; }
        public DbSet<HotelServiceReservation> HotelServiceReservations { get; set; }




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





            //CleaningStaff ↔ User(assigned user)
            modelBuilder.Entity<CleaningStaff>()
                .HasOne(cs => cs.User)
                .WithMany() 
                .HasForeignKey(cs => cs.UserID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<CleaningStaff>()
            .HasIndex(cs => cs.UserID)
             .IsUnique();

            //CleaningStaff ↔ User(assigned by)
            modelBuilder.Entity<CleaningStaff>()
                .HasOne(cs => cs.AssignedBy)
                .WithMany()
                .HasForeignKey(cs => cs.AssignedByUserID)
                .OnDelete(DeleteBehavior.Restrict);

            //CleaningAssignment ↔ CleaningStaff
            modelBuilder.Entity<CleaningAssignment>()
                .HasOne(ca => ca.CleaningStaff)
                .WithMany(cs => cs.CleaningAssignments)
                .HasForeignKey(ca => ca.CleaningStaffID)
                .OnDelete(DeleteBehavior.Cascade);

            //CleaningAssignment ↔ Room
            modelBuilder.Entity<CleaningAssignment>()
                .HasOne(ca => ca.Room)
                .WithMany()
                .HasForeignKey(ca => ca.RoomID)
                .OnDelete(DeleteBehavior.Restrict);

            //CleaningAssignment ↔ User(assigned by)
            modelBuilder.Entity<CleaningAssignment>()
                .HasOne(ca => ca.AssignedBy)
                .WithMany()
                .HasForeignKey(ca => ca.AssignedByUserID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<CleaningStaff>()
             .Property(cs => cs.Shift)
              .HasConversion<string>();

            //HotelService -> HotelServiceSchedule
            modelBuilder.Entity<HotelServiceSchedule>()
                .HasOne(s => s.Service)
                .WithMany(h => h.HotelServiceSchedules)
                .HasForeignKey(s => s.HotelServiceId)
                .OnDelete(DeleteBehavior.Cascade);

            //HotelService -> HotelReservation
            modelBuilder.Entity<HotelServiceReservation>()
                .HasOne(r => r.Service)
                .WithMany(s => s.HotelServiceReservations)
                .HasForeignKey(r => r.HotelServiceId)
                .OnDelete(DeleteBehavior.Cascade);

            //HotelReservation -> User
            modelBuilder.Entity<HotelServiceReservation>()
                .HasOne(r => r.User)
                .WithMany()
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            //HotelServiceReservation -> HotelServiceSchedule
            modelBuilder.Entity<HotelServiceReservation>()
                .HasOne(r => r.Schedule)
                .WithMany()
                .HasForeignKey(r => r.ScheduleId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
    }

