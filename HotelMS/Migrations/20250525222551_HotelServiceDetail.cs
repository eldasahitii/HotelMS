using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HotelMS.Migrations
{
    /// <inheritdoc />
    public partial class HotelServiceDetail : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_HotelServiceReservations_HotelServiceSchedules_ScheduleId",
                table: "HotelServiceReservations");

            migrationBuilder.DropForeignKey(
                name: "FK_HotelServiceReservations_Services_HotelServiceId",
                table: "HotelServiceReservations");

            migrationBuilder.DropForeignKey(
                name: "FK_HotelServiceReservations_Users_UserId",
                table: "HotelServiceReservations");

            migrationBuilder.DropTable(
                name: "HotelServiceSchedules");

            migrationBuilder.DropPrimaryKey(
                name: "PK_HotelServiceReservations",
                table: "HotelServiceReservations");

            migrationBuilder.DropIndex(
                name: "IX_HotelServiceReservations_ScheduleId",
                table: "HotelServiceReservations");

            migrationBuilder.RenameTable(
                name: "HotelServiceReservations",
                newName: "HotelServiceReservation");

            migrationBuilder.RenameIndex(
                name: "IX_HotelServiceReservations_UserId",
                table: "HotelServiceReservation",
                newName: "IX_HotelServiceReservation_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_HotelServiceReservations_HotelServiceId",
                table: "HotelServiceReservation",
                newName: "IX_HotelServiceReservation_HotelServiceId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_HotelServiceReservation",
                table: "HotelServiceReservation",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "HotelServiceDetails",
                columns: table => new
                {
                    DetailId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ServiceId = table.Column<int>(type: "int", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ImageUrl = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Price = table.Column<decimal>(type: "decimal(10,2)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HotelServiceDetails", x => x.DetailId);
                    table.ForeignKey(
                        name: "FK_HotelServiceDetails_Services_ServiceId",
                        column: x => x.ServiceId,
                        principalTable: "Services",
                        principalColumn: "ServiceId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_HotelServiceDetails_ServiceId",
                table: "HotelServiceDetails",
                column: "ServiceId");

            migrationBuilder.AddForeignKey(
                name: "FK_HotelServiceReservation_Services_HotelServiceId",
                table: "HotelServiceReservation",
                column: "HotelServiceId",
                principalTable: "Services",
                principalColumn: "ServiceId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_HotelServiceReservation_Users_UserId",
                table: "HotelServiceReservation",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "UserID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_HotelServiceReservation_Services_HotelServiceId",
                table: "HotelServiceReservation");

            migrationBuilder.DropForeignKey(
                name: "FK_HotelServiceReservation_Users_UserId",
                table: "HotelServiceReservation");

            migrationBuilder.DropTable(
                name: "HotelServiceDetails");

            migrationBuilder.DropPrimaryKey(
                name: "PK_HotelServiceReservation",
                table: "HotelServiceReservation");

            migrationBuilder.RenameTable(
                name: "HotelServiceReservation",
                newName: "HotelServiceReservations");

            migrationBuilder.RenameIndex(
                name: "IX_HotelServiceReservation_UserId",
                table: "HotelServiceReservations",
                newName: "IX_HotelServiceReservations_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_HotelServiceReservation_HotelServiceId",
                table: "HotelServiceReservations",
                newName: "IX_HotelServiceReservations_HotelServiceId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_HotelServiceReservations",
                table: "HotelServiceReservations",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "HotelServiceSchedules",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    HotelServiceId = table.Column<int>(type: "int", nullable: false),
                    EndTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsAvailable = table.Column<bool>(type: "bit", nullable: false),
                    StartTime = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HotelServiceSchedules", x => x.Id);
                    table.ForeignKey(
                        name: "FK_HotelServiceSchedules_Services_HotelServiceId",
                        column: x => x.HotelServiceId,
                        principalTable: "Services",
                        principalColumn: "ServiceId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_HotelServiceReservations_ScheduleId",
                table: "HotelServiceReservations",
                column: "ScheduleId");

            migrationBuilder.CreateIndex(
                name: "IX_HotelServiceSchedules_HotelServiceId",
                table: "HotelServiceSchedules",
                column: "HotelServiceId");

            migrationBuilder.AddForeignKey(
                name: "FK_HotelServiceReservations_HotelServiceSchedules_ScheduleId",
                table: "HotelServiceReservations",
                column: "ScheduleId",
                principalTable: "HotelServiceSchedules",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_HotelServiceReservations_Services_HotelServiceId",
                table: "HotelServiceReservations",
                column: "HotelServiceId",
                principalTable: "Services",
                principalColumn: "ServiceId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_HotelServiceReservations_Users_UserId",
                table: "HotelServiceReservations",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "UserID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
