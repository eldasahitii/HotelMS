using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HotelMS.Migrations
{
    /// <inheritdoc />
    public partial class FixRoomRoomType : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RoomImages_Rooms_RoomID",
                table: "RoomImages");

            migrationBuilder.DropColumn(
                name: "Capacity",
                table: "Rooms");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "Rooms");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "Rooms");

            migrationBuilder.DropColumn(
                name: "Price",
                table: "Rooms");

            migrationBuilder.RenameColumn(
                name: "Size",
                table: "Rooms",
                newName: "Title");

            migrationBuilder.RenameColumn(
                name: "RoomID",
                table: "RoomImages",
                newName: "RoomTypeID");

            migrationBuilder.RenameIndex(
                name: "IX_RoomImages_RoomID",
                table: "RoomImages",
                newName: "IX_RoomImages_RoomTypeID");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "RoomTypes",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50);

            migrationBuilder.AddColumn<string>(
                name: "Capacity",
                table: "RoomTypes",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "RoomTypes",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<decimal>(
                name: "Price",
                table: "RoomTypes",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<string>(
                name: "Size",
                table: "RoomTypes",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddForeignKey(
                name: "FK_RoomImages_RoomTypes_RoomTypeID",
                table: "RoomImages",
                column: "RoomTypeID",
                principalTable: "RoomTypes",
                principalColumn: "RoomTypeID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RoomImages_RoomTypes_RoomTypeID",
                table: "RoomImages");

            migrationBuilder.DropColumn(
                name: "Capacity",
                table: "RoomTypes");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "RoomTypes");

            migrationBuilder.DropColumn(
                name: "Price",
                table: "RoomTypes");

            migrationBuilder.DropColumn(
                name: "Size",
                table: "RoomTypes");

            migrationBuilder.RenameColumn(
                name: "Title",
                table: "Rooms",
                newName: "Size");

            migrationBuilder.RenameColumn(
                name: "RoomTypeID",
                table: "RoomImages",
                newName: "RoomID");

            migrationBuilder.RenameIndex(
                name: "IX_RoomImages_RoomTypeID",
                table: "RoomImages",
                newName: "IX_RoomImages_RoomID");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "RoomTypes",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100);

            migrationBuilder.AddColumn<string>(
                name: "Capacity",
                table: "Rooms",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Rooms",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Rooms",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<decimal>(
                name: "Price",
                table: "Rooms",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddForeignKey(
                name: "FK_RoomImages_Rooms_RoomID",
                table: "RoomImages",
                column: "RoomID",
                principalTable: "Rooms",
                principalColumn: "RoomID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
