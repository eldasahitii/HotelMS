using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HotelMS.Migrations
{
    /// <inheritdoc />
    public partial class FixForeignKEy : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RestaurantReservations_RestaurantGuests_RestaurantGuestGuestID",
                table: "RestaurantReservations");

            migrationBuilder.DropIndex(
                name: "IX_RestaurantReservations_RestaurantGuestGuestID",
                table: "RestaurantReservations");

            migrationBuilder.DropColumn(
                name: "RestaurantGuestGuestID",
                table: "RestaurantReservations");

            migrationBuilder.CreateIndex(
                name: "IX_RestaurantReservations_GuestID",
                table: "RestaurantReservations",
                column: "GuestID");

            migrationBuilder.AddForeignKey(
                name: "FK_RestaurantReservations_RestaurantGuests_GuestID",
                table: "RestaurantReservations",
                column: "GuestID",
                principalTable: "RestaurantGuests",
                principalColumn: "GuestID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RestaurantReservations_RestaurantGuests_GuestID",
                table: "RestaurantReservations");

            migrationBuilder.DropIndex(
                name: "IX_RestaurantReservations_GuestID",
                table: "RestaurantReservations");

            migrationBuilder.AddColumn<int>(
                name: "RestaurantGuestGuestID",
                table: "RestaurantReservations",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_RestaurantReservations_RestaurantGuestGuestID",
                table: "RestaurantReservations",
                column: "RestaurantGuestGuestID");

            migrationBuilder.AddForeignKey(
                name: "FK_RestaurantReservations_RestaurantGuests_RestaurantGuestGuestID",
                table: "RestaurantReservations",
                column: "RestaurantGuestGuestID",
                principalTable: "RestaurantGuests",
                principalColumn: "GuestID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
