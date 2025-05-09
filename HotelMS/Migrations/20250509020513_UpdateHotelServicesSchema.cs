using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HotelMS.Migrations
{
    /// <inheritdoc />
    public partial class UpdateHotelServicesSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_HotelServiceReservations_HotelServices_ServiceId",
                table: "HotelServiceReservations");

            migrationBuilder.DropForeignKey(
                name: "FK_HotelServiceSchedules_HotelServices_ServiceId",
                table: "HotelServiceSchedules");

            migrationBuilder.RenameColumn(
                name: "ServiceId",
                table: "HotelServiceSchedules",
                newName: "HotelServiceId");

            migrationBuilder.RenameIndex(
                name: "IX_HotelServiceSchedules_ServiceId",
                table: "HotelServiceSchedules",
                newName: "IX_HotelServiceSchedules_HotelServiceId");

            migrationBuilder.RenameColumn(
                name: "ServiceId",
                table: "HotelServiceReservations",
                newName: "HotelServiceId");

            migrationBuilder.RenameIndex(
                name: "IX_HotelServiceReservations_ServiceId",
                table: "HotelServiceReservations",
                newName: "IX_HotelServiceReservations_HotelServiceId");

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "HotelServiceReservations",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_HotelServiceReservations_HotelServices_HotelServiceId",
                table: "HotelServiceReservations");

            migrationBuilder.DropForeignKey(
                name: "FK_HotelServiceSchedules_HotelServices_HotelServiceId",
                table: "HotelServiceSchedules");

            migrationBuilder.RenameColumn(
                name: "HotelServiceId",
                table: "HotelServiceSchedules",
                newName: "ServiceId");

            migrationBuilder.RenameIndex(
                name: "IX_HotelServiceSchedules_HotelServiceId",
                table: "HotelServiceSchedules",
                newName: "IX_HotelServiceSchedules_ServiceId");

            migrationBuilder.RenameColumn(
                name: "HotelServiceId",
                table: "HotelServiceReservations",
                newName: "ServiceId");

            migrationBuilder.RenameIndex(
                name: "IX_HotelServiceReservations_HotelServiceId",
                table: "HotelServiceReservations",
                newName: "IX_HotelServiceReservations_ServiceId");

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "HotelServiceReservations",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50);

            migrationBuilder.AddForeignKey(
                name: "FK_HotelServiceReservations_HotelServices_ServiceId",
                table: "HotelServiceReservations",
                column: "ServiceId",
                principalTable: "HotelServices",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_HotelServiceSchedules_HotelServices_ServiceId",
                table: "HotelServiceSchedules",
                column: "ServiceId",
                principalTable: "HotelServices",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
