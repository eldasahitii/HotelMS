using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HotelMS.Migrations
{
    /// <inheritdoc />
    public partial class fixRoomTypes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "NumberOfRooms",
                table: "RoomTypes",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NumberOfRooms",
                table: "RoomTypes");
        }
    }
}
