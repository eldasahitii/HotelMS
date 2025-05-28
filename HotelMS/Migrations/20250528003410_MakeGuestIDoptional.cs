using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HotelMS.Migrations
{
    /// <inheritdoc />
    public partial class MakeGuestIDoptional : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RestaurantReservations_RestaurantGuests_GuestID",
                table: "RestaurantReservations");

            migrationBuilder.AlterColumn<int>(
                name: "GuestID",
                table: "RestaurantReservations",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_RestaurantReservations_RestaurantGuests_GuestID",
                table: "RestaurantReservations",
                column: "GuestID",
                principalTable: "RestaurantGuests",
                principalColumn: "GuestID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RestaurantReservations_RestaurantGuests_GuestID",
                table: "RestaurantReservations");

            migrationBuilder.AlterColumn<int>(
                name: "GuestID",
                table: "RestaurantReservations",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_RestaurantReservations_RestaurantGuests_GuestID",
                table: "RestaurantReservations",
                column: "GuestID",
                principalTable: "RestaurantGuests",
                principalColumn: "GuestID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
