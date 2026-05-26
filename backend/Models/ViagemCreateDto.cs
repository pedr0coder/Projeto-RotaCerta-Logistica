using System;

namespace RotaCerta.Models
{
    public class ViagemCreateDto
    {
        public string Destino { get; set; } = string.Empty;
        public Guid VeiculoId { get; set; }
        public Guid MotoristaId { get; set; }
        public int PesoCargaKg { get; set; } // Ajustado para int para bater com o banco
    }
}