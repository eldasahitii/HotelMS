using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HotelMS.Migrations
{
    /// <inheritdoc />
    public partial class AddRestaurantGuestModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "RestaurantGuestGuestID",
                table: "RestaurantReservations",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "RestaurantGuests",
                columns: table => new
                {
                    GuestID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FirstName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RestaurantGuests", x => x.GuestID);
                });

            migrationBuilder.CreateIndex(
                name: "IX_RestaurantReservations_RestaurantGuestGuestID",
                table: "RestaurantReservations",
                column: "RestaurantGuestGuestID");

            migrationBuilder.AddForeignKey(
                name: "FK_RestaurantReservations_RestaurantGuests_RestaurantGuestGuestID",
                table: "RestaurantReservations",
                column: "RestaurantGuestGuestID",
                principalTable: "RestaurantGuests",
                principalColumn: "GuestID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RestaurantReservations_RestaurantGuests_RestaurantGuestGuestID",
                table: "RestaurantReservations");

            migrationBuilder.DropTable(
                name: "RestaurantGuests");

            migrationBuilder.DropIndex(
                name: "IX_RestaurantReservations_RestaurantGuestGuestID",
                table: "RestaurantReservations");

            migrationBuilder.DropColumn(
                name: "RestaurantGuestGuestID",
                table: "RestaurantReservations");
        }
    }
}
