using Microsoft.EntityFrameworkCore;
using RotaCerta.Models;
using RotaCerta.Models.Enums;

namespace RotaCerta.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Veiculo> Veiculos => Set<Veiculo>();
    public DbSet<Motorista> Motoristas => Set<Motorista>();
    public DbSet<Viagem> Viagens => Set<Viagem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // ── Veiculo ──────────────────────────────────────────
        modelBuilder.Entity<Veiculo>(entity =>
        {
            entity.HasKey(v => v.Id);

            entity.Property(v => v.Placa)
                .IsRequired()
                .HasMaxLength(10);

            entity.HasIndex(v => v.Placa)
                .IsUnique();

            entity.Property(v => v.Modelo)
                .IsRequired()
                .HasMaxLength(100);

            entity.Property(v => v.CapacidadeCargaKg)
                .HasColumnType("decimal(10,2)");

            entity.Property(v => v.Status)
                .HasConversion<string>()  // Salva o enum como texto no banco
                .HasMaxLength(20);
        });

        // ── Motorista ─────────────────────────────────────────
        modelBuilder.Entity<Motorista>(entity =>
        {
            entity.HasKey(m => m.Id);

            entity.Property(m => m.Nome)
                .IsRequired()
                .HasMaxLength(150);

            entity.Property(m => m.CNH)
                .IsRequired()
                .HasMaxLength(20);

            entity.HasIndex(m => m.CNH)
                .IsUnique();

            entity.Property(m => m.Status)
                .HasConversion<string>()
                .HasMaxLength(20);
        });

        // ── Viagem ────────────────────────────────────────────
        modelBuilder.Entity<Viagem>(entity =>
        {
            entity.HasKey(v => v.Id);

            entity.Property(v => v.Destino)
                .IsRequired()
                .HasMaxLength(200);

            entity.Property(v => v.PesoCargaKg)
                .HasColumnType("decimal(10,2)");

            entity.Property(v => v.Status)
                .HasConversion<string>()
                .HasMaxLength(20);

            entity.Property(v => v.DataCriacao)
                .IsRequired();

            // Relacionamento: Veiculo (1) → Viagens (N)
            entity.HasOne(v => v.Veiculo)
                .WithMany(ve => ve.Viagens)
                .HasForeignKey(v => v.VeiculoId)
                .OnDelete(DeleteBehavior.Restrict); // Impede exclusão em cascata

            // Relacionamento: Motorista (1) → Viagens (N)
            entity.HasOne(v => v.Motorista)
                .WithMany(m => m.Viagens)
                .HasForeignKey(v => v.MotoristaId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }
}