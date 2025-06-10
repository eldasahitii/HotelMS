using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HotelMS.Migrations
{
    /// <inheritdoc />
    public partial class fixxxxxx : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_HotelServiceReservations_HotelServiceDetails_HotelServiceDetailID",
                table: "HotelServiceReservations");

            migrationBuilder.DropForeignKey(
                name: "FK_HotelServiceReservations_ReservationStatuses_ReservationStatusID",
                table: "HotelServiceReservations");

            migrationBuilder.DropForeignKey(
                name: "FK_HotelServiceReservations_ServiceRecepsionists_ServiceRecepsionistId",
                table: "HotelServiceReservations");

            migrationBuilder.AddColumn<int>(
                name: "TotalReservationsHandled",
                table: "ServiceRecepsionists",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddForeignKey(
                name: "FK_HotelServiceReservations_HotelServiceDetails_HotelServiceDetailID",
                table: "HotelServiceReservations",
                column: "HotelServiceDetailID",
                principalTable: "HotelServiceDetails",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_HotelServiceReservations_ReservationStatuses_ReservationStatusID",
                table: "HotelServiceReservations",
                column: "ReservationStatusID",
                principalTable: "ReservationStatuses",
                principalColumn: "ReservationStatusID",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_HotelServiceReservations_ServiceRecepsionists_ServiceRecepsionistId",
                table: "HotelServiceReservations",
                column: "ServiceRecepsionistId",
                principalTable: "ServiceRecepsionists",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_HotelServiceReservations_HotelServiceDetails_HotelServiceDetailID",
                table: "HotelServiceReservations");

            migrationBuilder.DropForeignKey(
                name: "FK_HotelServiceReservations_ReservationStatuses_ReservationStatusID",
                table: "HotelServiceReservations");

            migrationBuilder.DropForeignKey(
                name: "FK_HotelServiceReservations_ServiceRecepsionists_ServiceRecepsionistId",
                table: "HotelServiceReservations");

            migrationBuilder.DropColumn(
                name: "TotalReservationsHandled",
                table: "ServiceRecepsionists");

            migrationBuilder.AddForeignKey(
                name: "FK_HotelServiceReservations_HotelServiceDetails_HotelServiceDetailID",
                table: "HotelServiceReservations",
                column: "HotelServiceDetailID",
                principalTable: "HotelServiceDetails",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_HotelServiceReservations_ReservationStatuses_ReservationStatusID",
                table: "HotelServiceReservations",
                column: "ReservationStatusID",
                principalTable: "ReservationStatuses",
                principalColumn: "ReservationStatusID");

            migrationBuilder.AddForeignKey(
                name: "FK_HotelServiceReservations_ServiceRecepsionists_ServiceRecepsionistId",
                table: "HotelServiceReservations",
                column: "ServiceRecepsionistId",
                principalTable: "ServiceRecepsionists",
                principalColumn: "Id");
        }
    }
}
