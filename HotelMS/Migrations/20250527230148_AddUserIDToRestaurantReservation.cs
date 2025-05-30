using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HotelMS.Migrations
{
    /// <inheritdoc />
    public partial class AddUserIDToRestaurantReservation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "UserID",
                table: "RestaurantReservations",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_RestaurantReservations_UserID",
                table: "RestaurantReservations",
                column: "UserID");

            migrationBuilder.AddForeignKey(
                name: "FK_RestaurantReservations_Users_UserID",
                table: "RestaurantReservations",
                column: "UserID",
                principalTable: "Users",
                principalColumn: "UserID",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RestaurantReservations_Users_UserID",
                table: "RestaurantReservations");

            migrationBuilder.DropIndex(
                name: "IX_RestaurantReservations_UserID",
                table: "RestaurantReservations");

            migrationBuilder.DropColumn(
                name: "UserID",
                table: "RestaurantReservations");
        }
    }
}
