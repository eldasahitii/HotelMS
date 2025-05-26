using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HotelMS.Migrations
{
    /// <inheritdoc />
    public partial class FixServices : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_HotelServiceDetails_Services_ServiceId",
                table: "HotelServiceDetails");

            migrationBuilder.DropForeignKey(
                name: "FK_HotelServiceReservation_Services_HotelServiceId",
                table: "HotelServiceReservation");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Services",
                table: "Services");

            migrationBuilder.RenameTable(
                name: "Services",
                newName: "HotelServices");

            migrationBuilder.AddPrimaryKey(
                name: "PK_HotelServices",
                table: "HotelServices",
                column: "ServiceId");

            migrationBuilder.AddForeignKey(
                name: "FK_HotelServiceDetails_HotelServices_ServiceId",
                table: "HotelServiceDetails",
                column: "ServiceId",
                principalTable: "HotelServices",
                principalColumn: "ServiceId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_HotelServiceReservation_HotelServices_HotelServiceId",
                table: "HotelServiceReservation",
                column: "HotelServiceId",
                principalTable: "HotelServices",
                principalColumn: "ServiceId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_HotelServiceDetails_HotelServices_ServiceId",
                table: "HotelServiceDetails");

            migrationBuilder.DropForeignKey(
                name: "FK_HotelServiceReservation_HotelServices_HotelServiceId",
                table: "HotelServiceReservation");

            migrationBuilder.DropPrimaryKey(
                name: "PK_HotelServices",
                table: "HotelServices");

            migrationBuilder.RenameTable(
                name: "HotelServices",
                newName: "Services");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Services",
                table: "Services",
                column: "ServiceId");

            migrationBuilder.AddForeignKey(
                name: "FK_HotelServiceDetails_Services_ServiceId",
                table: "HotelServiceDetails",
                column: "ServiceId",
                principalTable: "Services",
                principalColumn: "ServiceId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_HotelServiceReservation_Services_HotelServiceId",
                table: "HotelServiceReservation",
                column: "HotelServiceId",
                principalTable: "Services",
                principalColumn: "ServiceId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
