using Microsoft.EntityFrameworkCore;
using RotaCerta.Models;
using RotaCerta.Models.Enums;

namespace RotaCerta.Data;

public static class SeedData
{
    public static async Task InitializeAsync(IServiceProvider serviceProvider)
    {
        await using var context = new AppDbContext(
            serviceProvider.GetRequiredService<DbContextOptions<AppDbContext>>()
        );

        // Aplica migrations pendentes automaticamente
        await context.Database.MigrateAsync();

        // Se já existir qualquer veículo, o banco não está vazio — encerra
        if (await context.Veiculos.AnyAsync()) return;

        // ── Veículos ──────────────────────────────────────────────────────────
        var veiculos = new List<Veiculo>
        {
            new() { Id = Guid.NewGuid(), Placa = "BRA2E19", Modelo = "Volvo FH 540",        CapacidadeCargaKg = 25000, Status = StatusVeiculo.EmRota    },
            new() { Id = Guid.NewGuid(), Placa = "QRT5F82", Modelo = "Scania R 450",         CapacidadeCargaKg = 22000, Status = StatusVeiculo.Disponivel },
            new() { Id = Guid.NewGuid(), Placa = "MNO3G47", Modelo = "Mercedes Actros 630",  CapacidadeCargaKg = 28000, Status = StatusVeiculo.Manutencao },
            new() { Id = Guid.NewGuid(), Placa = "DEL4H91", Modelo = "VW Delivery 11.180",   CapacidadeCargaKg = 11000, Status = StatusVeiculo.Disponivel },
        };

        // ── Motoristas ────────────────────────────────────────────────────────
        var motoristas = new List<Motorista>
        {
            new() { Id = Guid.NewGuid(), Nome = "Carlos Eduardo Souza", CNH = "12345678900", Status = StatusMotorista.EmRota     },
            new() { Id = Guid.NewGuid(), Nome = "Marcos Antônio Lima",  CNH = "98765432100", Status = StatusMotorista.Disponivel },
            new() { Id = Guid.NewGuid(), Nome = "Roberto Ferreira",     CNH = "45678912300", Status = StatusMotorista.Inativo    },
            new() { Id = Guid.NewGuid(), Nome = "José Alencar",         CNH = "32165498700", Status = StatusMotorista.Disponivel },
        };

        await context.Veiculos.AddRangeAsync(veiculos);
        await context.Motoristas.AddRangeAsync(motoristas);
        await context.SaveChangesAsync();

        // ── Viagens ───────────────────────────────────────────────────────────
        // Referências por índice para garantir consistência com os status acima
        var viagens = new List<Viagem>
        {
            new()
            {
                Id           = Guid.NewGuid(),
                VeiculoId    = veiculos[0].Id,          // Volvo — EmRota
                MotoristaId  = motoristas[0].Id,        // Carlos — EmRota
                Destino      = "São Paulo, SP",
                PesoCargaKg  = 18500,
                Status       = StatusViagem.EmAndamento,
                DataCriacao  = DateTime.UtcNow.AddDays(-1),
            },
            new()
            {
                Id           = Guid.NewGuid(),
                VeiculoId    = veiculos[0].Id,
                MotoristaId  = motoristas[0].Id,
                Destino      = "Campinas, SP",
                PesoCargaKg  = 12000,
                Status       = StatusViagem.Concluida,
                DataCriacao  = DateTime.UtcNow.AddDays(-5),
            },
            new()
            {
                Id           = Guid.NewGuid(),
                VeiculoId    = veiculos[1].Id,          // Scania — Disponivel
                MotoristaId  = motoristas[1].Id,        // Marcos — Disponivel
                Destino      = "Rio de Janeiro, RJ",
                PesoCargaKg  = 9800,
                Status       = StatusViagem.Planejada,
                DataCriacao  = DateTime.UtcNow,
            },
            new()
            {
                Id           = Guid.NewGuid(),
                VeiculoId    = veiculos[1].Id,
                MotoristaId  = motoristas[1].Id,
                Destino      = "Belo Horizonte, MG",
                PesoCargaKg  = 21000,
                Status       = StatusViagem.Concluida,
                DataCriacao  = DateTime.UtcNow.AddDays(-10),
            },
            new()
            {
                Id           = Guid.NewGuid(),
                VeiculoId    = veiculos[2].Id,          // Mercedes — Manutencao
                MotoristaId  = motoristas[2].Id,        // Roberto — Inativo
                Destino      = "Curitiba, PR",
                PesoCargaKg  = 27500,
                Status       = StatusViagem.Concluida,
                DataCriacao  = DateTime.UtcNow.AddDays(-15),
            },
        };

        await context.Viagens.AddRangeAsync(viagens);
        await context.SaveChangesAsync();
    }
}