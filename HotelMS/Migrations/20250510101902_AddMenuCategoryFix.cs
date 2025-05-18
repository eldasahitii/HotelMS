using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HotelMS.Migrations
{
    /// <inheritdoc />
    public partial class AddMenuCategoryFix : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "guest_id",
                table: "RestaurantReservations",
                newName: "GuestID");

            migrationBuilder.RenameColumn(
                name: "MenuCategoryIDs",
                table: "MenuCategories",
                newName: "MenuCategoryID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "GuestID",
                table: "RestaurantReservations",
                newName: "guest_id");

            migrationBuilder.RenameColumn(
                name: "MenuCategoryID",
                table: "MenuCategories",
                newName: "MenuCategoryIDs");
        }
    }
}
