using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HotelMS.Migrations
{
    public partial class Fixes : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Create HotelServices table
            migrationBuilder.CreateTable(
                name: "HotelServices",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(maxLength: 100, nullable: false),
                    Description = table.Column<string>(nullable: true),
                    Price = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HotelServices", x => x.Id);
                });

            // Create HotelServiceDetails table
            migrationBuilder.CreateTable(
                name: "HotelServiceDetails",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ServiceId = table.Column<int>(nullable: false),
                    Detail = table.Column<string>(maxLength: 200, nullable: false),
                    AdditionalInfo = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HotelServiceDetails", x => x.Id);
                    table.ForeignKey(
                        name: "FK_HotelServiceDetails_HotelServices_ServiceId",
                        column: x => x.ServiceId,
                        principalTable: "HotelServices",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            // Create HotelServiceReservations table
            migrationBuilder.CreateTable(
                name: "HotelServiceReservations",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ServiceId = table.Column<int>(nullable: false),
                    UserID = table.Column<int>(nullable: false),
                    ReservationDate = table.Column<DateTime>(nullable: false),
                    ReservationStatusID = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HotelServiceReservations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_HotelServiceReservations_HotelServices_ServiceId",
                        column: x => x.ServiceId,
                        principalTable: "HotelServices",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_HotelServiceReservations_Users_UserID",
                        column: x => x.UserID,
                        principalTable: "Users",
                        principalColumn: "UserID", // <-- fixed here
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_HotelServiceReservations_ReservationStatuses_ReservationStatusID",
                        column: x => x.ReservationStatusID,
                        principalTable: "ReservationStatuses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            // Indexes to speed up foreign key lookups
            migrationBuilder.CreateIndex(
                name: "IX_HotelServiceDetails_ServiceId",
                table: "HotelServiceDetails",
                column: "ServiceId");

            migrationBuilder.CreateIndex(
                name: "IX_HotelServiceReservations_ServiceId",
                table: "HotelServiceReservations",
                column: "ServiceId");

            migrationBuilder.CreateIndex(
                name: "IX_HotelServiceReservations_UserID",
                table: "HotelServiceReservations",
                column: "UserID");

            migrationBuilder.CreateIndex(
                name: "IX_HotelServiceReservations_ReservationStatusID",
                table: "HotelServiceReservations",
                column: "ReservationStatusID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "HotelServiceReservations");

            migrationBuilder.DropTable(
                name: "HotelServiceDetails");

            migrationBuilder.DropTable(
                name: "HotelServices");
        }
    }
}
