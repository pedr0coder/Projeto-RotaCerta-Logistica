using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RotaCerta.Data;
using RotaCerta.Models;
using RotaCerta.Models.Enums;

namespace RotaCerta.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ViagensController : ControllerBase
{
    private readonly AppDbContext _context;

    public ViagensController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var viagens = await _context.Viagens
            .AsNoTracking()
            .Include(v => v.Veiculo)
            .Include(v => v.Motorista)
            .ToListAsync();

        return Ok(viagens);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var viagem = await _context.Viagens
            .AsNoTracking()
            .Include(v => v.Veiculo)
            .Include(v => v.Motorista)
            .FirstOrDefaultAsync(v => v.Id == id);

        if (viagem is null)
            return NotFound(new { message = $"Viagem com Id '{id}' não encontrada." });

        return Ok(viagem);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] ViagemCreateDto dto)
    {
        var veiculo = await _context.Veiculos.FindAsync(dto.VeiculoId);
        if (veiculo is null) return NotFound(new { message = $"Veículo com Id '{dto.VeiculoId}' não encontrado." });
        if (veiculo.Status != StatusVeiculo.Disponivel)
            return BadRequest(new { message = $"O veículo '{veiculo.Modelo}' não está disponível." });

        var motorista = await _context.Motoristas.FindAsync(dto.MotoristaId);
        if (motorista is null) return NotFound(new { message = $"Motorista com Id '{dto.MotoristaId}' não encontrado." });
        if (motorista.Status != StatusMotorista.Disponivel)
            return BadRequest(new { message = $"O motorista '{motorista.Nome}' não está disponível." });

        if (dto.PesoCargaKg > veiculo.CapacidadeCargaKg)
            return BadRequest(new { message = $"Capacidade excedida. Veículo suporta até {veiculo.CapacidadeCargaKg} kg." });

        var viagem = new Viagem
        {
            Id = Guid.NewGuid(),
            Destino = dto.Destino,
            VeiculoId = dto.VeiculoId,
            MotoristaId = dto.MotoristaId,
            PesoCargaKg = dto.PesoCargaKg,
            DataCriacao = DateTime.UtcNow,
            Status = StatusViagem.Planejada
        };

        veiculo.Status = StatusVeiculo.EmRota;
        motorista.Status = StatusMotorista.EmRota;

        _context.Viagens.Add(viagem);
        await _context.SaveChangesAsync();

        viagem.Veiculo = veiculo;
        viagem.Motorista = motorista;

        return CreatedAtAction(nameof(GetById), new { id = viagem.Id }, viagem);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] Viagem viagemAtualizada)
    {
        var viagem = await _context.Viagens.FindAsync(id);
        if (viagem is null) return NotFound(new { message = $"Viagem com Id '{id}' não encontrada." });

        viagem.Destino = viagemAtualizada.Destino;
        viagem.PesoCargaKg = viagemAtualizada.PesoCargaKg;
        viagem.Status = viagemAtualizada.Status;

        await _context.SaveChangesAsync();
        return Ok(viagem);
    }

    [HttpPut("{id:guid}/concluir")]
    public async Task<IActionResult> ConcluirViagem(Guid id)
    {
        var viagem = await _context.Viagens
            .Include(v => v.Veiculo)
            .Include(v => v.Motorista)
            .FirstOrDefaultAsync(v => v.Id == id);

        if (viagem is null) return NotFound(new { message = $"Viagem não encontrada." });
        if (viagem.Status == StatusViagem.Concluida || viagem.Status == StatusViagem.Cancelada)
            return BadRequest(new { message = $"A viagem já está {viagem.Status}." });

        viagem.Status = StatusViagem.Concluida;

        if (viagem.Veiculo != null) viagem.Veiculo.Status = StatusVeiculo.Disponivel;
        if (viagem.Motorista != null) viagem.Motorista.Status = StatusMotorista.Disponivel;

        await _context.SaveChangesAsync();
        return Ok(viagem);
    }

    // ─── ENDPOINT DE AUDITORIA E CANCELAMENTO ─────────────────────────────
    [HttpPut("{id:guid}/cancelar")]
    public async Task<IActionResult> CancelarViagem(Guid id, [FromBody] ViagemCancelamentoDto dto)
    {
        var viagem = await _context.Viagens
            .Include(v => v.Veiculo)
            .Include(v => v.Motorista)
            .FirstOrDefaultAsync(v => v.Id == id);

        if (viagem is null) return NotFound(new { message = $"Viagem não encontrada." });
        if (viagem.Status == StatusViagem.Concluida || viagem.Status == StatusViagem.Cancelada)
            return BadRequest(new { message = $"Não é possível cancelar uma viagem que já está {viagem.Status}." });
        if (string.IsNullOrWhiteSpace(dto.Motivo))
            return BadRequest(new { message = "O motivo do cancelamento é obrigatório." });

        // Muda status e salva o motivo
        viagem.Status = StatusViagem.Cancelada;
        viagem.MotivoCancelamento = dto.Motivo;

        // Libera os recursos para trabalharem de novo
        if (viagem.Veiculo != null) viagem.Veiculo.Status = StatusVeiculo.Disponivel;
        if (viagem.Motorista != null) viagem.Motorista.Status = StatusMotorista.Disponivel;

        await _context.SaveChangesAsync();
        return Ok(viagem);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var viagem = await _context.Viagens.FindAsync(id);
        if (viagem is null) return NotFound(new { message = $"Viagem não encontrada." });

        _context.Viagens.Remove(viagem);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}