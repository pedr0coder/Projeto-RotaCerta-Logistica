using RotaCerta.Models.Enums;

namespace RotaCerta.Models;

public class Veiculo
{
    public Guid Id { get; set; }
    public string Placa { get; set; } = string.Empty;
    public string Modelo { get; set; } = string.Empty;
    public decimal CapacidadeCargaKg { get; set; }
    public StatusVeiculo Status { get; set; }

    // Propriedade de navegação
    public ICollection<Viagem> Viagens { get; set; } = [];
}