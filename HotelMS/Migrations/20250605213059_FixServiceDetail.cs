using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HotelMS.Migrations
{
    /// <inheritdoc />
    public partial class FixServiceDetail : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_HotelServiceDetails_HotelServices_HotelServiceId",
                table: "HotelServiceDetails");

            migrationBuilder.DropIndex(
                name: "IX_HotelServiceDetails_HotelServiceId",
                table: "HotelServiceDetails");

            migrationBuilder.DropColumn(
                name: "EndTime",
                table: "HotelServiceDetails");

            migrationBuilder.DropColumn(
                name: "HotelServiceId",
                table: "HotelServiceDetails");

            migrationBuilder.DropColumn(
                name: "IsAvailable",
                table: "HotelServiceDetails");

            migrationBuilder.DropColumn(
                name: "StartTime",
                table: "HotelServiceDetails");

            migrationBuilder.AddColumn<string>(
                name: "DetailDescription",
                table: "HotelServiceDetails",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "DetailImage",
                table: "HotelServiceDetails",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "DetailTitle",
                table: "HotelServiceDetails",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Price",
                table: "HotelServiceDetails",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DetailDescription",
                table: "HotelServiceDetails");

            migrationBuilder.DropColumn(
                name: "DetailImage",
                table: "HotelServiceDetails");

            migrationBuilder.DropColumn(
                name: "DetailTitle",
                table: "HotelServiceDetails");

            migrationBuilder.DropColumn(
                name: "Price",
                table: "HotelServiceDetails");

            migrationBuilder.AddColumn<DateTime>(
                name: "EndTime",
                table: "HotelServiceDetails",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "HotelServiceId",
                table: "HotelServiceDetails",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "IsAvailable",
                table: "HotelServiceDetails",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "StartTime",
                table: "HotelServiceDetails",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.CreateIndex(
                name: "IX_HotelServiceDetails_HotelServiceId",
                table: "HotelServiceDetails",
                column: "HotelServiceId");

            migrationBuilder.AddForeignKey(
                name: "FK_HotelServiceDetails_HotelServices_HotelServiceId",
                table: "HotelServiceDetails",
                column: "HotelServiceId",
                principalTable: "HotelServices",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
