using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HotelMS.Migrations
{
    public partial class UpdateTableStatusDefault : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Update existing null or empty statuses to "Available"
            migrationBuilder.Sql(
                "UPDATE RestaurantTables SET Status = 'Available' WHERE Status IS NULL OR Status = ''");

            // Alter the column default to "Available"
            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "RestaurantTables",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "Available",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldDefaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Revert the column default back to empty string
            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "RestaurantTables",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldDefaultValue: "Available");
        }
    }
}
