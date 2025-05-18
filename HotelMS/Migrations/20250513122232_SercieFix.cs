using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HotelMS.Migrations
{
    /// <inheritdoc />
    public partial class SercieFix : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_HotelServiceReservations_HotelServiceSchedules_ScheduleId",
                table: "HotelServiceReservations");

            migrationBuilder.RenameColumn(
                name: "IsAvailabale",
                table: "HotelServiceSchedules",
                newName: "IsAvailable");

            migrationBuilder.AddForeignKey(
                name: "FK_HotelServiceReservations_HotelServiceSchedules_ScheduleId",
                table: "HotelServiceReservations",
                column: "ScheduleId",
                principalTable: "HotelServiceSchedules",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_HotelServiceReservations_HotelServiceSchedules_ScheduleId",
                table: "HotelServiceReservations");

            migrationBuilder.RenameColumn(
                name: "IsAvailable",
                table: "HotelServiceSchedules",
                newName: "IsAvailabale");

            migrationBuilder.AddForeignKey(
                name: "FK_HotelServiceReservations_HotelServiceSchedules_ScheduleId",
                table: "HotelServiceReservations",
                column: "ScheduleId",
                principalTable: "HotelServiceSchedules",
                principalColumn: "Id");
        }
    }
}
