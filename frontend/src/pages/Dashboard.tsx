import { 
  Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, 
  IconButton, Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, TextField, Typography, MenuItem 
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useEffect, useState, useMemo } from "react";
import NovaViagemModal from "../components/NovaViagemModal";
import api from "../services/api";
import { StatusViagem, type Viagem } from "../types/models";

const statusViagemColor: Record<StatusViagem, string> = {
  [StatusViagem.Planejada]: "#3b82f6",
  [StatusViagem.EmAndamento]: "#FFA500",
  [StatusViagem.Concluida]: "#22c55e",
  [StatusViagem.Cancelada]: "#ef4444",
};

const statusViagemLabel: Record<StatusViagem, string> = {
  [StatusViagem.Planejada]: "Planejada",
  [StatusViagem.EmAndamento]: "Em Rota",
  [StatusViagem.Concluida]: "Concluída",
  [StatusViagem.Cancelada]: "Cancelada",
};

export default function Dashboard() {
  const [viagens, setViagens] = useState<Viagem[]>([]);
  const [filtroStatus, setFiltroStatus] = useState("Todos");
  const [ordemData, setOrdemData] = useState("Recente");
  const [modalAberto, setModalAberto] = useState(false);
  const [cancelModalAberto, setCancelModalAberto] = useState(false);
  const [viagemCancelId, setViagemCancelId] = useState<string | null>(null);
  const [motivoCancelamento, setMotivoCancelamento] = useState("");

  const fetchAllData = async () => {
    try {
      const { data } = await api.get<Viagem[]>("/viagens");
      setViagens(data);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchAllData(); }, []);

  const viagensFiltradas = useMemo(() => {
    let lista = [...viagens];
    if (filtroStatus !== "Todos") lista = lista.filter((v) => v.status === filtroStatus);
    lista.sort((a, b) => {
      const d1 = new Date(a.dataCriacao).getTime();
      const d2 = new Date(b.dataCriacao).getTime();
      return ordemData === "Recente" ? d2 - d1 : d1 - d2;
    });
    return lista;
  }, [viagens, filtroStatus, ordemData]);

  const handleCancelarViagem = async () => {
    if (!viagemCancelId) return;
    await api.put(`/viagens/${viagemCancelId}/cancelar`, { motivo: motivoCancelamento });
    setCancelModalAberto(false);
    fetchAllData();
  };

  const handleConcluirViagem = async (id: string) => { 
    await api.put(`/viagens/${id}/concluir`); 
    fetchAllData(); 
  };

  return (
    <Box sx={{ p: 4, bgcolor: "#050b14", minHeight: "100vh" }}>
      <Typography variant="h4" sx={{ mb: 4, color: "#fff", fontWeight: 700 }}>PAINEL OPERACIONAL</Typography>
      
      <Paper sx={{ p: 3, mb: 3, background: "#162236", display: "flex", gap: 2, alignItems: "center" }}>
        <TextField select label="Status" size="small" value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)} sx={{ width: 150, "& .MuiInputLabel-root": { color: "#fff" }, "& .MuiInputBase-root": { color: "#fff" } }}>
          <MenuItem value="Todos">Todos</MenuItem>
          <MenuItem value="Planejada">Planejada</MenuItem>
          <MenuItem value="EmAndamento">Em Rota</MenuItem>
          <MenuItem value="Concluida">Concluída</MenuItem>
          <MenuItem value="Cancelada">Cancelada</MenuItem>
        </TextField>

        <TextField select label="Data" size="small" value={ordemData} onChange={(e) => setOrdemData(e.target.value)} sx={{ width: 150, "& .MuiInputLabel-root": { color: "#fff" }, "& .MuiInputBase-root": { color: "#fff" } }}>
          <MenuItem value="Recente">Mais Recentes</MenuItem>
          <MenuItem value="Antigo">Mais Antigas</MenuItem>
        </TextField>

        <Button variant="contained" sx={{ ml: "auto", bgcolor: "#FFA500", color: "#000" }} startIcon={<AddIcon />} onClick={() => setModalAberto(true)}>Nova Viagem</Button>
      </Paper>

      <TableContainer component={Paper} sx={{ background: "#0d1b2a", border: "1px solid #1e293b" }}>
        <Table>
          <TableHead>
            <TableRow>
              {["Destino", "Motorista", "Status", "Data", "Ações"].map((c) => <TableCell key={c} sx={{ color: "#94a3b8" }}>{c}</TableCell>)}
            </TableRow>
          </TableHead>
          <TableBody>
            {viagensFiltradas.map((v) => (
              <TableRow key={v.id}>
                <TableCell sx={{ color: "#fff" }}>{v.destino}</TableCell>
                <TableCell sx={{ color: "#fff" }}>{v.motorista?.nome}</TableCell>
                <TableCell>
                  <Chip label={statusViagemLabel[v.status]} sx={{ bgcolor: `${statusViagemColor[v.status]}20`, color: statusViagemColor[v.status], fontWeight: 700 }} />
                </TableCell>
                <TableCell sx={{ color: "#fff" }}>{new Date(v.dataCriacao).toLocaleDateString()}</TableCell>
                <TableCell>
                  {v.status !== "Concluida" && v.status !== "Cancelada" && (
                    <>
                      <IconButton onClick={() => handleConcluirViagem(v.id)} sx={{ color: "#22c55e" }}><CheckCircleIcon /></IconButton>
                      <IconButton onClick={() => { setViagemCancelId(v.id); setCancelModalAberto(true); }} sx={{ color: "#ef4444" }}><CancelIcon /></IconButton>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <NovaViagemModal open={modalAberto} onClose={() => setModalAberto(false)} onSuccess={fetchAllData} />
      
      <Dialog 
        open={cancelModalAberto} 
        onClose={() => setCancelModalAberto(false)}
        sx={{ "& .MuiDialog-paper": { bgcolor: "#162236", color: "#fff" } }}
      >
        <DialogTitle sx={{ color: "#ef4444" }}>CANCELAR VIAGEM</DialogTitle>
        <DialogContent>
          <TextField fullWidth multiline rows={3} variant="outlined" placeholder="Motivo do cancelamento..." onChange={(e) => setMotivoCancelamento(e.target.value)} sx={{ mt: 1, "& .MuiInputBase-root": { color: "#fff" } }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelModalAberto(false)} sx={{ color: "#fff" }}>Voltar</Button>
          <Button onClick={handleCancelarViagem} variant="contained" color="error">Confirmar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}