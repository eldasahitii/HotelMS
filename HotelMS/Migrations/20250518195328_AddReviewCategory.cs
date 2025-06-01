using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HotelMS.Migrations
{
    /// <inheritdoc />
    public partial class AddReviewCategory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ReviewCategoryID",
                table: "Reviews",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "ReviewCategories",
                columns: table => new
                {
                    ReviewCategoryID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CategoryName = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReviewCategories", x => x.ReviewCategoryID);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_ReviewCategoryID",
                table: "Reviews",
                column: "ReviewCategoryID");

            migrationBuilder.AddForeignKey(
                name: "FK_Reviews_ReviewCategories_ReviewCategoryID",
                table: "Reviews",
                column: "ReviewCategoryID",
                principalTable: "ReviewCategories",
                principalColumn: "ReviewCategoryID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reviews_ReviewCategories_ReviewCategoryID",
                table: "Reviews");

            migrationBuilder.DropTable(
                name: "ReviewCategories");

            migrationBuilder.DropIndex(
                name: "IX_Reviews_ReviewCategoryID",
                table: "Reviews");

            migrationBuilder.DropColumn(
                name: "ReviewCategoryID",
                table: "Reviews");
        }
    }
}
