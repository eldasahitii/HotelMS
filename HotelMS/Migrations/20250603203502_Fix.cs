using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HotelMS.Migrations
{
    /// <inheritdoc />
    public partial class Fix : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "HotelServices");

            migrationBuilder.DropColumn(
                name: "Price",
                table: "HotelServices");

            migrationBuilder.RenameColumn(
                name: "Type",
                table: "HotelServices",
                newName: "HeroTitle");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "HotelServices",
                newName: "HeroImage");

            migrationBuilder.RenameColumn(
                name: "Description",
                table: "HotelServices",
                newName: "HeroDescription");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "HeroTitle",
                table: "HotelServices",
                newName: "Type");

            migrationBuilder.RenameColumn(
                name: "HeroImage",
                table: "HotelServices",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "HeroDescription",
                table: "HotelServices",
                newName: "Description");

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "HotelServices",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<decimal>(
                name: "Price",
                table: "HotelServices",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);
        }
    }
}
