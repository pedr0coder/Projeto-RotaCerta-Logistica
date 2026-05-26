using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RotaCerta.Data;
using RotaCerta.Models;

namespace RotaCerta.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MotoristasController : ControllerBase
{
    private readonly AppDbContext _context;

    public MotoristasController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/motoristas
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var motoristas = await _context.Motoristas
            .AsNoTracking()
            .ToListAsync();

        return Ok(motoristas);
    }

    // GET: api/motoristas/{id}
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var motorista = await _context.Motoristas
            .AsNoTracking()
            .FirstOrDefaultAsync(m => m.Id == id);

        if (motorista is null)
            return NotFound(new { message = $"Motorista com Id '{id}' não encontrado." });

        return Ok(motorista);
    }

    // POST: api/motoristas
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Motorista motorista)
    {
        motorista.Id = Guid.NewGuid();

        _context.Motoristas.Add(motorista);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = motorista.Id }, motorista);
    }

    // PUT: api/motoristas/{id}
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] Motorista motoristaAtualizado)
    {
        var motorista = await _context.Motoristas.FindAsync(id);

        if (motorista is null)
            return NotFound(new { message = $"Motorista com Id '{id}' não encontrado." });

        motorista.Nome = motoristaAtualizado.Nome;
        motorista.CNH = motoristaAtualizado.CNH;
        motorista.Status = motoristaAtualizado.Status;

        await _context.SaveChangesAsync();

        return Ok(motorista);
    }

    // DELETE: api/motoristas/{id}
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var motorista = await _context.Motoristas.FindAsync(id);

        if (motorista is null)
            return NotFound(new { message = $"Motorista com Id '{id}' não encontrado." });

        _context.Motoristas.Remove(motorista);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}