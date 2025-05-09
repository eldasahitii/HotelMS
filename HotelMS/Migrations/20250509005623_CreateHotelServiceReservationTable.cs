using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HotelMS.Migrations
{
    /// <inheritdoc />
    public partial class CreateHotelServiceReservationTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "HotelServiceReservations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    ServiceId = table.Column<int>(type: "int", nullable: false),
                    ScheduleId = table.Column<int>(type: "int", nullable: true),
                    ReservationTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HotelServiceReservations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_HotelServiceReservations_HotelServiceSchedules_ScheduleId",
                        column: x => x.ScheduleId,
                        principalTable: "HotelServiceSchedules",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_HotelServiceReservations_HotelServices_ServiceId",
                        column: x => x.ServiceId,
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

            migrationBuilder.CreateIndex(
                name: "IX_HotelServiceReservations_ScheduleId",
                table: "HotelServiceReservations",
                column: "ScheduleId");

            migrationBuilder.CreateIndex(
                name: "IX_HotelServiceReservations_ServiceId",
                table: "HotelServiceReservations",
                column: "ServiceId");

            migrationBuilder.CreateIndex(
                name: "IX_HotelServiceReservations_UserId",
                table: "HotelServiceReservations",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "HotelServiceReservations");
        }
    }
}
