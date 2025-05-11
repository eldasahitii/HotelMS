using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HotelMS.Migrations
{
    /// <inheritdoc />
    public partial class RoomStatus : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsAvailable",
                table: "Rooms");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "RoomReservations");

            migrationBuilder.AddColumn<int>(
                name: "RoomStatusID",
                table: "Rooms",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ReservationStatusID",
                table: "RoomReservations",
                type: "int",
                nullable: false,
                defaultValue: 0);

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

            migrationBuilder.CreateIndex(
                name: "IX_Rooms_RoomStatusID",
                table: "Rooms",
                column: "RoomStatusID");

            migrationBuilder.CreateIndex(
                name: "IX_RoomReservations_ReservationStatusID",
                table: "RoomReservations",
                column: "ReservationStatusID");

            migrationBuilder.AddForeignKey(
                name: "FK_RoomReservations_ReservationStatuses_ReservationStatusID",
                table: "RoomReservations",
                column: "ReservationStatusID",
                principalTable: "ReservationStatuses",
                principalColumn: "ReservationStatusID",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Rooms_RoomStatuses_RoomStatusID",
                table: "Rooms",
                column: "RoomStatusID",
                principalTable: "RoomStatuses",
                principalColumn: "RoomStatusID",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RoomReservations_ReservationStatuses_ReservationStatusID",
                table: "RoomReservations");

            migrationBuilder.DropForeignKey(
                name: "FK_Rooms_RoomStatuses_RoomStatusID",
                table: "Rooms");

            migrationBuilder.DropTable(
                name: "ReservationStatuses");

            migrationBuilder.DropTable(
                name: "RoomStatuses");

            migrationBuilder.DropIndex(
                name: "IX_Rooms_RoomStatusID",
                table: "Rooms");

            migrationBuilder.DropIndex(
                name: "IX_RoomReservations_ReservationStatusID",
                table: "RoomReservations");

            migrationBuilder.DropColumn(
                name: "RoomStatusID",
                table: "Rooms");

            migrationBuilder.DropColumn(
                name: "ReservationStatusID",
                table: "RoomReservations");

            migrationBuilder.AddColumn<bool>(
                name: "IsAvailable",
                table: "Rooms",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "RoomReservations",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
