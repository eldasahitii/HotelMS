using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HotelMS.Migrations
{
    /// <inheritdoc />
    public partial class FixReservationRecepsionsit : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CreatedByReceptionistID",
                table: "RoomReservations",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_RoomReservations_CreatedByReceptionistID",
                table: "RoomReservations",
                column: "CreatedByReceptionistID");

            migrationBuilder.AddForeignKey(
                name: "FK_RoomReservations_RoomRecepsionists_CreatedByReceptionistID",
                table: "RoomReservations",
                column: "CreatedByReceptionistID",
                principalTable: "RoomRecepsionists",
                principalColumn: "RoomReceptionistID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RoomReservations_RoomRecepsionists_CreatedByReceptionistID",
                table: "RoomReservations");

            migrationBuilder.DropIndex(
                name: "IX_RoomReservations_CreatedByReceptionistID",
                table: "RoomReservations");

            migrationBuilder.DropColumn(
                name: "CreatedByReceptionistID",
                table: "RoomReservations");
        }
    }
}
