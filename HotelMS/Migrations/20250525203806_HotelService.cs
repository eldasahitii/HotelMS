using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HotelMS.Migrations
{
    /// <inheritdoc />
    public partial class HotelService : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_HotelServiceReservations_HotelServices_HotelServiceId",
                table: "HotelServiceReservations");

            migrationBuilder.DropForeignKey(
                name: "FK_HotelServiceSchedules_HotelServices_HotelServiceId",
                table: "HotelServiceSchedules");

            migrationBuilder.DropPrimaryKey(
                name: "PK_HotelServices",
                table: "HotelServices");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "HotelServices");

            migrationBuilder.DropColumn(
                name: "Price",
                table: "HotelServices");

            migrationBuilder.DropColumn(
                name: "Type",
                table: "HotelServices");

            migrationBuilder.RenameTable(
                name: "HotelServices",
                newName: "Services");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Services",
                newName: "ServiceId");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Services",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<string>(
                name: "HeroImageUrl",
                table: "Services",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Services",
                table: "Services",
                column: "ServiceId");

            migrationBuilder.AddForeignKey(
                name: "FK_HotelServiceReservations_Services_HotelServiceId",
                table: "HotelServiceReservations",
                column: "HotelServiceId",
                principalTable: "Services",
                principalColumn: "ServiceId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_HotelServiceSchedules_Services_HotelServiceId",
                table: "HotelServiceSchedules",
                column: "HotelServiceId",
                principalTable: "Services",
                principalColumn: "ServiceId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_HotelServiceReservations_Services_HotelServiceId",
                table: "HotelServiceReservations");

            migrationBuilder.DropForeignKey(
                name: "FK_HotelServiceSchedules_Services_HotelServiceId",
                table: "HotelServiceSchedules");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Services",
                table: "Services");

            migrationBuilder.DropColumn(
                name: "HeroImageUrl",
                table: "Services");

            migrationBuilder.RenameTable(
                name: "Services",
                newName: "HotelServices");

            migrationBuilder.RenameColumn(
                name: "ServiceId",
                table: "HotelServices",
                newName: "Id");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "HotelServices",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100);

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

            migrationBuilder.AddColumn<string>(
                name: "Type",
                table: "HotelServices",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddPrimaryKey(
                name: "PK_HotelServices",
                table: "HotelServices",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_HotelServiceReservations_HotelServices_HotelServiceId",
                table: "HotelServiceReservations",
                column: "HotelServiceId",
                principalTable: "HotelServices",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_HotelServiceSchedules_HotelServices_HotelServiceId",
                table: "HotelServiceSchedules",
                column: "HotelServiceId",
                principalTable: "HotelServices",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
