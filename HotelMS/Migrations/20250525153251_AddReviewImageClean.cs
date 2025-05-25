using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HotelMS.Migrations
{
    /// <inheritdoc />
    public partial class AddReviewImageClean : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "HotelServices",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Type = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Price = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HotelServices", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "MenuCategories",
                columns: table => new
                {
                    MenuCategoryID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MenuCategories", x => x.MenuCategoryID);
                });

            migrationBuilder.CreateTable(
                name: "ReservationStatuses",
                columns: table => new
                {
                    ReservationStatusID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ReservationStatusName = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReservationStatuses", x => x.ReservationStatusID);
                });

            migrationBuilder.CreateTable(
                name: "RestaurantTables",
                columns: table => new
                {
                    RestaurantTableID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TableNumber = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RestaurantTables", x => x.RestaurantTableID);
                });

            migrationBuilder.CreateTable(
                name: "ReviewCategories",
                columns: table => new
                {
                    ReviewCategoryID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CategoryName = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReviewCategories", x => x.ReviewCategoryID);
                });

            migrationBuilder.CreateTable(
                name: "ReviewImages",
                columns: table => new
                {
                    ReviewImageID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ReviewID = table.Column<int>(type: "int", nullable: false),
                    ImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReviewImages", x => x.ReviewImageID);
                });

            migrationBuilder.CreateTable(
                name: "Roles",
                columns: table => new
                {
                    RoleID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RoleType = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Roles", x => x.RoleID);
                });

            migrationBuilder.CreateTable(
                name: "RoomStatuses",
                columns: table => new
                {
                    RoomStatusID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RoomStatusName = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RoomStatuses", x => x.RoomStatusID);
                });

            migrationBuilder.CreateTable(
                name: "RoomTypes",
                columns: table => new
                {
                    RoomTypeID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RoomTypes", x => x.RoomTypeID);
                });

            migrationBuilder.CreateTable(
                name: "HotelServiceSchedules",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    HotelServiceId = table.Column<int>(type: "int", nullable: false),
                    StartTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsAvailable = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HotelServiceSchedules", x => x.Id);
                    table.ForeignKey(
                        name: "FK_HotelServiceSchedules_HotelServices_HotelServiceId",
                        column: x => x.HotelServiceId,
                        principalTable: "HotelServices",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MenuItems",
                columns: table => new
                {
                    MenuItemID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Price = table.Column<double>(type: "float", nullable: false),
                    image_url = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    is_available = table.Column<bool>(type: "bit", nullable: false),
                    MenuCategoryID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MenuItems", x => x.MenuItemID);
                    table.ForeignKey(
                        name: "FK_MenuItems_MenuCategories_MenuCategoryID",
                        column: x => x.MenuCategoryID,
                        principalTable: "MenuCategories",
                        principalColumn: "MenuCategoryID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RestaurantReservations",
                columns: table => new
                {
                    ReservationID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    GuestID = table.Column<int>(type: "int", nullable: false),
                    date_time = table.Column<DateTime>(type: "datetime2", nullable: false),
                    status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RestaurantTableID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RestaurantReservations", x => x.ReservationID);
                    table.ForeignKey(
                        name: "FK_RestaurantReservations_RestaurantTables_RestaurantTableID",
                        column: x => x.RestaurantTableID,
                        principalTable: "RestaurantTables",
                        principalColumn: "RestaurantTableID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    UserID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FirstName = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    LastName = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PasswordHash = table.Column<byte[]>(type: "varbinary(max)", nullable: false),
                    PasswordSalt = table.Column<byte[]>(type: "varbinary(max)", nullable: false),
                    Phone = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Address = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    RoleID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.UserID);
                    table.ForeignKey(
                        name: "FK_Users_Roles_RoleID",
                        column: x => x.RoleID,
                        principalTable: "Roles",
                        principalColumn: "RoleID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Rooms",
                columns: table => new
                {
                    RoomID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Capacity = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Size = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Price = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    RoomTypeID = table.Column<int>(type: "int", nullable: false),
                    RoomStatusID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Rooms", x => x.RoomID);
                    table.ForeignKey(
                        name: "FK_Rooms_RoomStatuses_RoomStatusID",
                        column: x => x.RoomStatusID,
                        principalTable: "RoomStatuses",
                        principalColumn: "RoomStatusID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Rooms_RoomTypes_RoomTypeID",
                        column: x => x.RoomTypeID,
                        principalTable: "RoomTypes",
                        principalColumn: "RoomTypeID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CleaningStaff",
                columns: table => new
                {
                    CleaningStaffID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserID = table.Column<int>(type: "int", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    Shift = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AssignedByUserID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CleaningStaff", x => x.CleaningStaffID);
                    table.ForeignKey(
                        name: "FK_CleaningStaff_Users_AssignedByUserID",
                        column: x => x.AssignedByUserID,
                        principalTable: "Users",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_CleaningStaff_Users_UserID",
                        column: x => x.UserID,
                        principalTable: "Users",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "HotelServiceReservations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    HotelServiceId = table.Column<int>(type: "int", nullable: false),
                    ScheduleId = table.Column<int>(type: "int", nullable: true),
                    ReservationTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HotelServiceReservations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_HotelServiceReservations_HotelServiceSchedules_ScheduleId",
                        column: x => x.ScheduleId,
                        principalTable: "HotelServiceSchedules",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_HotelServiceReservations_HotelServices_HotelServiceId",
                        column: x => x.HotelServiceId,
                        principalTable: "HotelServices",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_HotelServiceReservations_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Reviews",
                columns: table => new
                {
                    ReviewID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserID = table.Column<int>(type: "int", nullable: false),
                    ReviewCategoryID = table.Column<int>(type: "int", nullable: false),
                    Rating = table.Column<int>(type: "int", nullable: false),
                    Comment = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Date = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Reviews", x => x.ReviewID);
                    table.ForeignKey(
                        name: "FK_Reviews_ReviewCategories_ReviewCategoryID",
                        column: x => x.ReviewCategoryID,
                        principalTable: "ReviewCategories",
                        principalColumn: "ReviewCategoryID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Reviews_Users_UserID",
                        column: x => x.UserID,
                        principalTable: "Users",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RoomRecepsionists",
                columns: table => new
                {
                    RoomReceptionistID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserID = table.Column<int>(type: "int", nullable: false),
                    Shift = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AssignedByUserID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RoomRecepsionists", x => x.RoomReceptionistID);
                    table.ForeignKey(
                        name: "FK_RoomRecepsionists_Users_AssignedByUserID",
                        column: x => x.AssignedByUserID,
                        principalTable: "Users",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_RoomRecepsionists_Users_UserID",
                        column: x => x.UserID,
                        principalTable: "Users",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "RoomImages",
                columns: table => new
                {
                    RoomImageID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RoomID = table.Column<int>(type: "int", nullable: false),
                    ImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RoomImages", x => x.RoomImageID);
                    table.ForeignKey(
                        name: "FK_RoomImages_Rooms_RoomID",
                        column: x => x.RoomID,
                        principalTable: "Rooms",
                        principalColumn: "RoomID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RoomReservations",
                columns: table => new
                {
                    ReservationID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RoomID = table.Column<int>(type: "int", nullable: false),
                    UserID = table.Column<int>(type: "int", nullable: false),
                    CheckInDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CheckOutDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ReservationStatusID = table.Column<int>(type: "int", nullable: false),
                    SpecialRequests = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RoomReservations", x => x.ReservationID);
                    table.ForeignKey(
                        name: "FK_RoomReservations_ReservationStatuses_ReservationStatusID",
                        column: x => x.ReservationStatusID,
                        principalTable: "ReservationStatuses",
                        principalColumn: "ReservationStatusID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_RoomReservations_Rooms_RoomID",
                        column: x => x.RoomID,
                        principalTable: "Rooms",
                        principalColumn: "RoomID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_RoomReservations_Users_UserID",
                        column: x => x.UserID,
                        principalTable: "Users",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CleaningAssignments",
                columns: table => new
                {
                    CleaningAssignmentID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RoomID = table.Column<int>(type: "int", nullable: false),
                    CleaningStaffID = table.Column<int>(type: "int", nullable: false),
                    AssignedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    StartedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    FinishedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AssignedByUserID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CleaningAssignments", x => x.CleaningAssignmentID);
                    table.ForeignKey(
                        name: "FK_CleaningAssignments_CleaningStaff_CleaningStaffID",
                        column: x => x.CleaningStaffID,
                        principalTable: "CleaningStaff",
                        principalColumn: "CleaningStaffID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CleaningAssignments_Rooms_RoomID",
                        column: x => x.RoomID,
                        principalTable: "Rooms",
                        principalColumn: "RoomID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_CleaningAssignments_Users_AssignedByUserID",
                        column: x => x.AssignedByUserID,
                        principalTable: "Users",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CleaningAssignments_AssignedByUserID",
                table: "CleaningAssignments",
                column: "AssignedByUserID");

            migrationBuilder.CreateIndex(
                name: "IX_CleaningAssignments_CleaningStaffID",
                table: "CleaningAssignments",
                column: "CleaningStaffID");

            migrationBuilder.CreateIndex(
                name: "IX_CleaningAssignments_RoomID",
                table: "CleaningAssignments",
                column: "RoomID");

            migrationBuilder.CreateIndex(
                name: "IX_CleaningStaff_AssignedByUserID",
                table: "CleaningStaff",
                column: "AssignedByUserID");

            migrationBuilder.CreateIndex(
                name: "IX_CleaningStaff_UserID",
                table: "CleaningStaff",
                column: "UserID",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_HotelServiceReservations_HotelServiceId",
                table: "HotelServiceReservations",
                column: "HotelServiceId");

            migrationBuilder.CreateIndex(
                name: "IX_HotelServiceReservations_ScheduleId",
                table: "HotelServiceReservations",
                column: "ScheduleId");

            migrationBuilder.CreateIndex(
                name: "IX_HotelServiceReservations_UserId",
                table: "HotelServiceReservations",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_HotelServiceSchedules_HotelServiceId",
                table: "HotelServiceSchedules",
                column: "HotelServiceId");

            migrationBuilder.CreateIndex(
                name: "IX_MenuItems_MenuCategoryID",
                table: "MenuItems",
                column: "MenuCategoryID");

            migrationBuilder.CreateIndex(
                name: "IX_RestaurantReservations_RestaurantTableID",
                table: "RestaurantReservations",
                column: "RestaurantTableID");

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_ReviewCategoryID",
                table: "Reviews",
                column: "ReviewCategoryID");

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_UserID",
                table: "Reviews",
                column: "UserID");

            migrationBuilder.CreateIndex(
                name: "IX_RoomImages_RoomID",
                table: "RoomImages",
                column: "RoomID");

            migrationBuilder.CreateIndex(
                name: "IX_RoomRecepsionists_AssignedByUserID",
                table: "RoomRecepsionists",
                column: "AssignedByUserID");

            migrationBuilder.CreateIndex(
                name: "IX_RoomRecepsionists_UserID",
                table: "RoomRecepsionists",
                column: "UserID",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_RoomReservations_ReservationStatusID",
                table: "RoomReservations",
                column: "ReservationStatusID");

            migrationBuilder.CreateIndex(
                name: "IX_RoomReservations_RoomID",
                table: "RoomReservations",
                column: "RoomID");

            migrationBuilder.CreateIndex(
                name: "IX_RoomReservations_UserID",
                table: "RoomReservations",
                column: "UserID");

            migrationBuilder.CreateIndex(
                name: "IX_Rooms_RoomStatusID",
                table: "Rooms",
                column: "RoomStatusID");

            migrationBuilder.CreateIndex(
                name: "IX_Rooms_RoomTypeID",
                table: "Rooms",
                column: "RoomTypeID");

            migrationBuilder.CreateIndex(
                name: "IX_Users_RoleID",
                table: "Users",
                column: "RoleID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CleaningAssignments");

            migrationBuilder.DropTable(
                name: "HotelServiceReservations");

            migrationBuilder.DropTable(
                name: "MenuItems");

            migrationBuilder.DropTable(
                name: "RestaurantReservations");

            migrationBuilder.DropTable(
                name: "ReviewImages");

            migrationBuilder.DropTable(
                name: "Reviews");

            migrationBuilder.DropTable(
                name: "RoomImages");

            migrationBuilder.DropTable(
                name: "RoomRecepsionists");

            migrationBuilder.DropTable(
                name: "RoomReservations");

            migrationBuilder.DropTable(
                name: "CleaningStaff");

            migrationBuilder.DropTable(
                name: "HotelServiceSchedules");

            migrationBuilder.DropTable(
                name: "MenuCategories");

            migrationBuilder.DropTable(
                name: "RestaurantTables");

            migrationBuilder.DropTable(
                name: "ReviewCategories");

            migrationBuilder.DropTable(
                name: "ReservationStatuses");

            migrationBuilder.DropTable(
                name: "Rooms");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "HotelServices");

            migrationBuilder.DropTable(
                name: "RoomStatuses");

            migrationBuilder.DropTable(
                name: "RoomTypes");

            migrationBuilder.DropTable(
                name: "Roles");
        }
    }
}
