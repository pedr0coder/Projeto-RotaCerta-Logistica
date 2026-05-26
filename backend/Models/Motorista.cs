using RotaCerta.Models.Enums;

namespace RotaCerta.Models;

public class Motorista
{
    public Guid Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string CNH { get; set; } = string.Empty;
    public StatusMotorista Status { get; set; }

    // Propriedade de navegação
    public ICollection<Viagem> Viagens { get; set; } = [];
}