using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HotelMS.Migrations
{
    /// <inheritdoc />
    public partial class ServiceFixes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ServiceRecepsionists",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FirstName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    LastName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Phone = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ServiceRecepsionists", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ServiceReservastionStatuses",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StatusName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ServiceReservastionStatuses", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "HotelServiceReservations",
                columns: table => new
                {
                    ReservationID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FirstName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    LastName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Phone = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    ReservationDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    TimeSlot = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    HotelServiceDetailID = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ReservationStatusID = table.Column<int>(type: "int", nullable: true),
                    ServiceRecepsionistId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HotelServiceReservations", x => x.ReservationID);
                    table.ForeignKey(
                        name: "FK_HotelServiceReservations_HotelServiceDetails_HotelServiceDetailID",
                        column: x => x.HotelServiceDetailID,
                        principalTable: "HotelServiceDetails",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_HotelServiceReservations_ReservationStatuses_ReservationStatusID",
                        column: x => x.ReservationStatusID,
                        principalTable: "ReservationStatuses",
                        principalColumn: "ReservationStatusID");
                    table.ForeignKey(
                        name: "FK_HotelServiceReservations_ServiceRecepsionists_ServiceRecepsionistId",
                        column: x => x.ServiceRecepsionistId,
                        principalTable: "ServiceRecepsionists",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_HotelServiceReservations_HotelServiceDetailID",
                table: "HotelServiceReservations",
                column: "HotelServiceDetailID");

            migrationBuilder.CreateIndex(
                name: "IX_HotelServiceReservations_ReservationStatusID",
                table: "HotelServiceReservations",
                column: "ReservationStatusID");

            migrationBuilder.CreateIndex(
                name: "IX_HotelServiceReservations_ServiceRecepsionistId",
                table: "HotelServiceReservations",
                column: "ServiceRecepsionistId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "HotelServiceReservations");

            migrationBuilder.DropTable(
                name: "ServiceReservastionStatuses");

            migrationBuilder.DropTable(
                name: "ServiceRecepsionists");
        }
    }
}
