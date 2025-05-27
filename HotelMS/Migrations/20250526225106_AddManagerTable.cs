using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HotelMS.Migrations
{
    /// <inheritdoc />
    public partial class AddManagerTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ManagerTypes",
                columns: table => new
                {
                    ManagerTypeID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ManagerTypes", x => x.ManagerTypeID);
                });

            migrationBuilder.CreateTable(
                name: "Managers",
                columns: table => new
                {
                    ManagerID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserID = table.Column<int>(type: "int", nullable: false),
                    ManagerTypeID = table.Column<int>(type: "int", nullable: false),
                    AssignedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Managers", x => x.ManagerID);
                    table.ForeignKey(
                        name: "FK_Managers_ManagerTypes_ManagerTypeID",
                        column: x => x.ManagerTypeID,
                        principalTable: "ManagerTypes",
                        principalColumn: "ManagerTypeID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Managers_Users_UserID",
                        column: x => x.UserID,
                        principalTable: "Users",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Managers_ManagerTypeID",
                table: "Managers",
                column: "ManagerTypeID");

            migrationBuilder.CreateIndex(
                name: "IX_Managers_UserID",
                table: "Managers",
                column: "UserID",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Managers");

            migrationBuilder.DropTable(
                name: "ManagerTypes");
        }
    }
}
