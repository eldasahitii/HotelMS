using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HotelMS.Migrations
{
    /// <inheritdoc />
    public partial class CleaningStaff : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CleaningStaff",
                columns: table => new
                {
                    CleaningStaffID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserID = table.Column<int>(type: "int", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    Shift = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AssignedByUserID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CleaningStaff", x => x.CleaningStaffID);
                    table.ForeignKey(
                        name: "FK_CleaningStaff_Users_AssignedByUserID",
                        column: x => x.AssignedByUserID,
                        principalTable: "Users",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_CleaningStaff_Users_UserID",
                        column: x => x.UserID,
                        principalTable: "Users",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "CleaningAssignments",
                columns: table => new
                {
                    CleaningAssignmentID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RoomID = table.Column<int>(type: "int", nullable: false),
                    CleaningStaffID = table.Column<int>(type: "int", nullable: false),
                    AssignedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    StartedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    FinishedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AssignedByUserID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CleaningAssignments", x => x.CleaningAssignmentID);
                    table.ForeignKey(
                        name: "FK_CleaningAssignments_CleaningStaff_CleaningStaffID",
                        column: x => x.CleaningStaffID,
                        principalTable: "CleaningStaff",
                        principalColumn: "CleaningStaffID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CleaningAssignments_Rooms_RoomID",
                        column: x => x.RoomID,
                        principalTable: "Rooms",
                        principalColumn: "RoomID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_CleaningAssignments_Users_AssignedByUserID",
                        column: x => x.AssignedByUserID,
                        principalTable: "Users",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CleaningAssignments_AssignedByUserID",
                table: "CleaningAssignments",
                column: "AssignedByUserID");

            migrationBuilder.CreateIndex(
                name: "IX_CleaningAssignments_CleaningStaffID",
                table: "CleaningAssignments",
                column: "CleaningStaffID");

            migrationBuilder.CreateIndex(
                name: "IX_CleaningAssignments_RoomID",
                table: "CleaningAssignments",
                column: "RoomID");

            migrationBuilder.CreateIndex(
                name: "IX_CleaningStaff_AssignedByUserID",
                table: "CleaningStaff",
                column: "AssignedByUserID");

            migrationBuilder.CreateIndex(
                name: "IX_CleaningStaff_UserID",
                table: "CleaningStaff",
                column: "UserID",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CleaningAssignments");

            migrationBuilder.DropTable(
                name: "CleaningStaff");
        }
    }
}
