using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HotelMS.Migrations
{
    /// <inheritdoc />
    public partial class HotelServiceDetail : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_HotelServiceReservations_HotelServiceSchedules_ScheduleId",
                table: "HotelServiceReservations");

            migrationBuilder.DropForeignKey(
                name: "FK_HotelServiceReservations_HotelServices_HotelServiceId",
                table: "HotelServiceReservations");

            migrationBuilder.DropForeignKey(
                name: "FK_HotelServiceReservations_Users_UserId",
                table: "HotelServiceReservations");

            migrationBuilder.DropTable(
                name: "HotelServiceSchedules");

            migrationBuilder.DropIndex(
                name: "IX_HotelServiceReservations_ScheduleId",
                table: "HotelServiceReservations");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "HotelServices");

            migrationBuilder.DropColumn(
                name: "Price",
                table: "HotelServices");

            migrationBuilder.DropColumn(
                name: "Type",
                table: "HotelServices");

            migrationBuilder.DropColumn(
                name: "ScheduleId",
                table: "HotelServiceReservations");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "HotelServiceReservations");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "HotelServices",
                newName: "ServiceId");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "HotelServiceReservations",
                newName: "ServiceId");

            migrationBuilder.RenameColumn(
                name: "ReservationTime",
                table: "HotelServiceReservations",
                newName: "ReservationDate");

            migrationBuilder.RenameColumn(
                name: "HotelServiceId",
                table: "HotelServiceReservations",
                newName: "ReservationStatusID");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "HotelServiceReservations",
                newName: "ReservationID");

            migrationBuilder.RenameIndex(
                name: "IX_HotelServiceReservations_UserId",
                table: "HotelServiceReservations",
                newName: "IX_HotelServiceReservations_ServiceId");

            migrationBuilder.RenameIndex(
                name: "IX_HotelServiceReservations_HotelServiceId",
                table: "HotelServiceReservations",
                newName: "IX_HotelServiceReservations_ReservationStatusID");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "HotelServices",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<string>(
                name: "HeroImageUrl",
                table: "HotelServices",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "HotelServiceReservations",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "HotelServiceReservations",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<TimeSpan>(
                name: "EndTime",
                table: "HotelServiceReservations",
                type: "time",
                nullable: false,
                defaultValue: new TimeSpan(0, 0, 0, 0, 0));

            migrationBuilder.AddColumn<string>(
                name: "FirstName",
                table: "HotelServiceReservations",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "LastName",
                table: "HotelServiceReservations",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Phone",
                table: "HotelServiceReservations",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<TimeSpan>(
                name: "StartTime",
                table: "HotelServiceReservations",
                type: "time",
                nullable: false,
                defaultValue: new TimeSpan(0, 0, 0, 0, 0));

            migrationBuilder.CreateTable(
                name: "HotelServiceDetails",
                columns: table => new
                {
                    DetailId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ServiceId = table.Column<int>(type: "int", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ImageUrl = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Price = table.Column<decimal>(type: "decimal(10,2)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HotelServiceDetails", x => x.DetailId);
                    table.ForeignKey(
                        name: "FK_HotelServiceDetails_HotelServices_ServiceId",
                        column: x => x.ServiceId,
                        principalTable: "HotelServices",
                        principalColumn: "ServiceId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_HotelServiceDetails_ServiceId",
                table: "HotelServiceDetails",
                column: "ServiceId");

            migrationBuilder.AddForeignKey(
                name: "FK_HotelServiceReservations_HotelServices_ServiceId",
                table: "HotelServiceReservations",
                column: "ServiceId",
                principalTable: "HotelServices",
                principalColumn: "ServiceId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_HotelServiceReservations_ReservationStatuses_ReservationStatusID",
                table: "HotelServiceReservations",
                column: "ReservationStatusID",
                principalTable: "ReservationStatuses",
                principalColumn: "ReservationStatusID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_HotelServiceReservations_HotelServices_ServiceId",
                table: "HotelServiceReservations");

            migrationBuilder.DropForeignKey(
                name: "FK_HotelServiceReservations_ReservationStatuses_ReservationStatusID",
                table: "HotelServiceReservations");

            migrationBuilder.DropTable(
                name: "HotelServiceDetails");

            migrationBuilder.DropColumn(
                name: "HeroImageUrl",
                table: "HotelServices");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "HotelServiceReservations");

            migrationBuilder.DropColumn(
                name: "Email",
                table: "HotelServiceReservations");

            migrationBuilder.DropColumn(
                name: "EndTime",
                table: "HotelServiceReservations");

            migrationBuilder.DropColumn(
                name: "FirstName",
                table: "HotelServiceReservations");

            migrationBuilder.DropColumn(
                name: "LastName",
                table: "HotelServiceReservations");

            migrationBuilder.DropColumn(
                name: "Phone",
                table: "HotelServiceReservations");

            migrationBuilder.DropColumn(
                name: "StartTime",
                table: "HotelServiceReservations");

            migrationBuilder.RenameColumn(
                name: "ServiceId",
                table: "HotelServices",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "ServiceId",
                table: "HotelServiceReservations",
                newName: "UserId");

            migrationBuilder.RenameColumn(
                name: "ReservationStatusID",
                table: "HotelServiceReservations",
                newName: "HotelServiceId");

            migrationBuilder.RenameColumn(
                name: "ReservationDate",
                table: "HotelServiceReservations",
                newName: "ReservationTime");

            migrationBuilder.RenameColumn(
                name: "ReservationID",
                table: "HotelServiceReservations",
                newName: "Id");

            migrationBuilder.RenameIndex(
                name: "IX_HotelServiceReservations_ServiceId",
                table: "HotelServiceReservations",
                newName: "IX_HotelServiceReservations_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_HotelServiceReservations_ReservationStatusID",
                table: "HotelServiceReservations",
                newName: "IX_HotelServiceReservations_HotelServiceId");

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

            migrationBuilder.AddColumn<int>(
                name: "ScheduleId",
                table: "HotelServiceReservations",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "HotelServiceReservations",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "HotelServiceSchedules",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    HotelServiceId = table.Column<int>(type: "int", nullable: false),
                    EndTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsAvailable = table.Column<bool>(type: "bit", nullable: false),
                    StartTime = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HotelServiceSchedules", x => x.Id);
                    table.ForeignKey(
                        name: "FK_HotelServiceSchedules_HotelServices_HotelServiceId",
                        column: x => x.HotelServiceId,
                        principalTable: "HotelServices",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_HotelServiceReservations_ScheduleId",
                table: "HotelServiceReservations",
                column: "ScheduleId");

            migrationBuilder.CreateIndex(
                name: "IX_HotelServiceSchedules_HotelServiceId",
                table: "HotelServiceSchedules",
                column: "HotelServiceId");

            migrationBuilder.AddForeignKey(
                name: "FK_HotelServiceReservations_HotelServiceSchedules_ScheduleId",
                table: "HotelServiceReservations",
                column: "ScheduleId",
                principalTable: "HotelServiceSchedules",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_HotelServiceReservations_HotelServices_HotelServiceId",
                table: "HotelServiceReservations",
                column: "HotelServiceId",
                principalTable: "HotelServices",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_HotelServiceReservations_Users_UserId",
                table: "HotelServiceReservations",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "UserID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
