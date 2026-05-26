using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RotaCerta.API.Data.Migrations
{
    /// <inheritdoc />
    public partial class AdicionaAuditoriaCancelamento : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "MotivoCancelamento",
                table: "Viagens",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MotivoCancelamento",
                table: "Viagens");
        }
    }
}
