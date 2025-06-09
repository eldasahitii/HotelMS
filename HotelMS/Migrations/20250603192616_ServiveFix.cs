using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HotelMS.Migrations
{
    /// <inheritdoc />
    public partial class ServiveFix : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_HotelServiceReservations_HotelServiceSchedules_ScheduleId",
                table: "HotelServiceReservations");

            migrationBuilder.DropTable(
                name: "HotelServiceSchedules");

            migrationBuilder.CreateTable(
                name: "HotelServiceDetails",
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
                    table.PrimaryKey("PK_HotelServiceDetails", x => x.Id);
                    table.ForeignKey(
                        name: "FK_HotelServiceDetails_HotelServices_HotelServiceId",
                        column: x => x.HotelServiceId,
                        principalTable: "HotelServices",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_HotelServiceDetails_HotelServiceId",
                table: "HotelServiceDetails",
                column: "HotelServiceId");

            migrationBuilder.AddForeignKey(
                name: "FK_HotelServiceReservations_HotelServiceDetails_ScheduleId",
                table: "HotelServiceReservations",
                column: "ScheduleId",
                principalTable: "HotelServiceDetails",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_HotelServiceReservations_HotelServiceDetails_ScheduleId",
                table: "HotelServiceReservations");

            migrationBuilder.DropTable(
                name: "HotelServiceDetails");

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
                        name: "FK_HotelServiceSchedules_HotelServices_HotelServiceId",
                        column: x => x.HotelServiceId,
                        principalTable: "HotelServices",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

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
        }
    }
}
