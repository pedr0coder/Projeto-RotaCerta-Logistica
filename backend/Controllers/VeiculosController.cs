using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RotaCerta.Data;
using RotaCerta.Models;

namespace RotaCerta.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VeiculosController : ControllerBase
{
    private readonly AppDbContext _context;

    public VeiculosController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/veiculos
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var veiculos = await _context.Veiculos
            .AsNoTracking()
            .ToListAsync();

        return Ok(veiculos);
    }

    // GET: api/veiculos/{id}
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var veiculo = await _context.Veiculos
            .AsNoTracking()
            .FirstOrDefaultAsync(v => v.Id == id);

        if (veiculo is null)
            return NotFound(new { message = $"Veículo com Id '{id}' não encontrado." });

        return Ok(veiculo);
    }

    // POST: api/veiculos
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Veiculo veiculo)
    {
        veiculo.Id = Guid.NewGuid();

        _context.Veiculos.Add(veiculo);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = veiculo.Id }, veiculo);
    }

    // PUT: api/veiculos/{id}
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] Veiculo veiculoAtualizado)
    {
        var veiculo = await _context.Veiculos.FindAsync(id);

        if (veiculo is null)
            return NotFound(new { message = $"Veículo com Id '{id}' não encontrado." });

        veiculo.Placa = veiculoAtualizado.Placa;
        veiculo.Modelo = veiculoAtualizado.Modelo;
        veiculo.CapacidadeCargaKg = veiculoAtualizado.CapacidadeCargaKg;
        veiculo.Status = veiculoAtualizado.Status;

        await _context.SaveChangesAsync();

        return Ok(veiculo);
    }

    // DELETE: api/veiculos/{id}
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var veiculo = await _context.Veiculos.FindAsync(id);

        if (veiculo is null)
            return NotFound(new { message = $"Veículo com Id '{id}' não encontrado." });

        _context.Veiculos.Remove(veiculo);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}