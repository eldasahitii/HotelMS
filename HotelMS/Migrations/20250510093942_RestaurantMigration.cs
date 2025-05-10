using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HotelMS.Migrations
{
    /// <inheritdoc />
    public partial class RestaurantMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "MenuCategories",
                columns: table => new
                {
                    MenuCategoryIDs = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MenuCategories", x => x.MenuCategoryIDs);
                });

            migrationBuilder.CreateTable(
                name: "RestaurantTables",
                columns: table => new
                {
                    RestaurantTableID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TableNumber = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RestaurantTables", x => x.RestaurantTableID);
                });

            migrationBuilder.CreateTable(
                name: "MenuItems",
                columns: table => new
                {
                    MenuItemID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Price = table.Column<double>(type: "float", nullable: false),
                    image_url = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    is_available = table.Column<bool>(type: "bit", nullable: false),
                    MenuCategoryID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MenuItems", x => x.MenuItemID);
                    table.ForeignKey(
                        name: "FK_MenuItems_MenuCategories_MenuCategoryID",
                        column: x => x.MenuCategoryID,
                        principalTable: "MenuCategories",
                        principalColumn: "MenuCategoryIDs",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RestaurantReservations",
                columns: table => new
                {
                    ReservationID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    guest_id = table.Column<int>(type: "int", nullable: false),
                    date_time = table.Column<DateTime>(type: "datetime2", nullable: false),
                    status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RestaurantTableID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RestaurantReservations", x => x.ReservationID);
                    table.ForeignKey(
                        name: "FK_RestaurantReservations_RestaurantTables_RestaurantTableID",
                        column: x => x.RestaurantTableID,
                        principalTable: "RestaurantTables",
                        principalColumn: "RestaurantTableID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_MenuItems_MenuCategoryID",
                table: "MenuItems",
                column: "MenuCategoryID");

            migrationBuilder.CreateIndex(
                name: "IX_RestaurantReservations_RestaurantTableID",
                table: "RestaurantReservations",
                column: "RestaurantTableID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MenuItems");

            migrationBuilder.DropTable(
                name: "RestaurantReservations");

            migrationBuilder.DropTable(
                name: "MenuCategories");

            migrationBuilder.DropTable(
                name: "RestaurantTables");
        }
    }
}
