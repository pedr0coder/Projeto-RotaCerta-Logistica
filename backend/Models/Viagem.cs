using RotaCerta.Models.Enums;

namespace RotaCerta.Models;

public class Viagem
{
    public Guid Id { get; set; }
    public Guid VeiculoId { get; set; }
    public Guid MotoristaId { get; set; }
    public string Destino { get; set; } = string.Empty;
    public decimal PesoCargaKg { get; set; }
    public StatusViagem Status { get; set; }
    public DateTime DataCriacao { get; set; }
    
    // Novo campo para registrar o motivo
    public string? MotivoCancelamento { get; set; }

    // Propriedades de navegação
    public Veiculo Veiculo { get; set; } = null!;
    public Motorista Motorista { get; set; } = null!;
}