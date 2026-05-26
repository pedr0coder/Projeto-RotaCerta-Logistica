import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useReducer, useState } from "react";
import api from "../services/api";
import {
  StatusMotorista,
  StatusVeiculo,
  type Motorista,
  type Veiculo,
  type Viagem,
} from "../types/models";

// ─── Tipagem do formulário ────────────────────────────────────────────────────

interface FormState {
  destino: string;
  veiculoId: string;
  motoristaId: string;
  pesoCargaKg: string;
}

interface FormErrors {
  destino?: string;
  veiculoId?: string;
  motoristaId?: string;
  pesoCargaKg?: string;
}

const INITIAL_FORM: FormState = {
  destino: "",
  veiculoId: "",
  motoristaId: "",
  pesoCargaKg: "",
};

// ─── Reducer simples para o formulário ───────────────────────────────────────

type FormAction =
  | { type: "SET_FIELD"; field: keyof FormState; value: string }
  | { type: "RESET" };

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "RESET":
      return INITIAL_FORM;
  }
}

// ─── Props do componente ─────────────────────────────────────────────────────

interface NovaViagemModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (novaViagem: Viagem) => void;
}

// ─── Estilos reutilizáveis (fora do componente para evitar recriação) ─────────

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    color: "#e2e8f0",
    fontFamily: "'Barlow Condensed', sans-serif",
    fontSize: "1rem",
    "& fieldset": { borderColor: "rgba(255,255,255,0.12)" },
    "&:hover fieldset": { borderColor: "rgba(255,165,0,0.4)" },
    "&.Mui-focused fieldset": { borderColor: "#FFA500" },
  },
  "& .MuiInputLabel-root": {
    color: "rgba(255,255,255,0.4)",
    fontFamily: "'Barlow Condensed', sans-serif",
    letterSpacing: "0.05em",
    "&.Mui-focused": { color: "#FFA500" },
  },
  "& .MuiFormHelperText-root": { color: "#ef4444" },
};

const menuProps = {
  sx: {
    "& .MuiPaper-root": {
      bgcolor: "#0d1b2a",
      border: "1px solid rgba(255,255,255,0.1)",
    },
    "& .MuiMenuItem-root": {
      fontFamily: "'Barlow Condensed', sans-serif",
      color: "#e2e8f0",
      "&:hover": { bgcolor: "rgba(255,165,0,0.08)" },
      "&.Mui-selected": { bgcolor: "rgba(255,165,0,0.15)" },
    },
  },
};

// ─── Componente ──────────────────────────────────────────────────────────────

export default function NovaViagemModal({
  open,
  onClose,
  onSuccess,
}: NovaViagemModalProps) {
  const [form, dispatch] = useReducer(formReducer, INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [motoristas, setMotoristas] = useState<Motorista[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(false);

  // Busca selects ao abrir o modal
  useEffect(() => {
    if (!open) return;
    setLoadingOptions(true);
    Promise.all([
      api.get<Veiculo[]>("/veiculos"),
      api.get<Motorista[]>("/motoristas"),
    ])
      .then(([v, m]) => {
        setVeiculos(v.data);
        setMotoristas(m.data);
      })
      .finally(() => setLoadingOptions(false));
  }, [open]);

  // Limpa estado ao fechar
  function handleClose() {
    dispatch({ type: "RESET" });
    setErrors({});
    setApiError(null);
    onClose();
  }

  // Validação client-side
  function validate(): boolean {
    const next: FormErrors = {};
    if (!form.destino.trim()) next.destino = "Informe o destino da viagem.";
    if (!form.veiculoId) next.veiculoId = "Selecione um veículo.";
    if (!form.motoristaId) next.motoristaId = "Selecione um motorista.";
    const peso = parseFloat(form.pesoCargaKg);
    if (!form.pesoCargaKg || isNaN(peso) || peso <= 0)
      next.pesoCargaKg = "Informe um peso válido maior que zero.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit() {
  if (!validate()) return;
  setSubmitting(true);
  setApiError(null);
  try {
    const payload = {
  Destino: form.destino.trim(),
  VeiculoId: form.veiculoId,       // Mudou para V maiúsculo
  MotoristaId: form.motoristaId,   // Mudou para M maiúsculo
  PesoCargaKg: parseFloat(form.pesoCargaKg),
};
    const { data } = await api.post<Viagem>("/viagens", payload);
    onSuccess(data);
    handleClose();
  } catch (err: unknown) {
    const responseData = (err as { response?: { data?: unknown } })?.response?.data;

    let message = "Erro ao despachar viagem. Tente novamente.";

    if (typeof responseData === "string") {
      // API retornou string pura
      message = responseData;
    } else if (responseData && typeof responseData === "object") {
      if ("message" in responseData) {
        // Nosso BadRequest customizado: { message: "..." }
        message = (responseData as { message: string }).message;
      } else if ("errors" in responseData) {
        // ValidationProblem do .NET: { errors: { Campo: ["msg1", "msg2"] } }
        const errors = (responseData as { errors: Record<string, string[]> }).errors;
        const firstField = Object.values(errors).find((msgs) => msgs.length > 0);
        if (firstField) message = firstField[0];
      }
    }

    setApiError(message);
  } finally {
    setSubmitting(false);
  }
}

  const veiculosDisponiveis = veiculos.filter(
    (v) => v.status === StatusVeiculo.Disponivel
  );
  const motoristasDisponiveis = motoristas.filter(
    (m) => m.status === StatusMotorista.Disponivel
  );

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            background: "linear-gradient(160deg, #0d1b2a 0%, #111f30 100%)",
            border: "1px solid rgba(255,165,0,0.2)",
            borderRadius: 2,
            boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
          },
        },
      }}
    >
      {/* Cabeçalho */}
      <DialogTitle
        sx={{
          px: 3,
          pt: 3,
          pb: 0,
          display: "flex",
          alignItems: "baseline",
          gap: 1.5,
        }}
      >
        <Typography
          sx={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700,
            fontSize: "1.35rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#fff",
          }}
        >
          Nova Viagem
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: "rgba(255,165,0,0.6)",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}
        >
          Despacho
        </Typography>
      </DialogTitle>

      <Divider sx={{ mx: 3, mt: 2, borderColor: "rgba(255,255,255,0.07)" }} />

      {/* Corpo do formulário */}
      <DialogContent sx={{ px: 3, py: 2.5 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          {/* Erro de API */}
          {apiError && (
            <Box
              sx={{
                p: 1.5,
                borderRadius: 1,
                bgcolor: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.3)",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: "#ef4444",
                  fontFamily: "'Barlow Condensed', sans-serif",
                  letterSpacing: "0.04em",
                }}
              >
                {apiError}
              </Typography>
            </Box>
          )}

          {/* Destino */}
          <TextField
            label="Destino"
            placeholder="Ex: São Paulo, SP"
            value={form.destino}
            onChange={(e) =>
              dispatch({ type: "SET_FIELD", field: "destino", value: e.target.value })
            }
            error={!!errors.destino}
            helperText={errors.destino}
            fullWidth
            autoFocus
            sx={fieldSx}
          />

          {/* Veículo */}
          <FormControl fullWidth error={!!errors.veiculoId} sx={fieldSx}>
            <InputLabel>Veículo</InputLabel>
            <Select
              label="Veículo"
              value={form.veiculoId}
              onChange={(e) =>
                dispatch({ type: "SET_FIELD", field: "veiculoId", value: e.target.value })
              }
              disabled={loadingOptions}
              MenuProps={menuProps}
              sx={{ color: "#e2e8f0" }}
            >
              {loadingOptions ? (
                <MenuItem disabled>
                  <CircularProgress size={16} sx={{ color: "#FFA500", mr: 1 }} />
                  Carregando...
                </MenuItem>
              ) : veiculosDisponiveis.length === 0 ? (
                <MenuItem disabled>Nenhum veículo disponível</MenuItem>
              ) : (
                veiculosDisponiveis.map((v) => (
                  <MenuItem key={v.id} value={v.id}>
                    {v.modelo} — {v.placa}
                    <Typography
                      component="span"
                      variant="caption"
                      sx={{ ml: 1, color: "rgba(255,255,255,0.35)" }}
                    >
                      ({v.capacidadeCargaKg.toLocaleString("pt-BR")} kg)
                    </Typography>
                  </MenuItem>
                ))
              )}
            </Select>
            {errors.veiculoId && (
              <FormHelperText>{errors.veiculoId}</FormHelperText>
            )}
          </FormControl>

          {/* Motorista */}
          <FormControl fullWidth error={!!errors.motoristaId} sx={fieldSx}>
            <InputLabel>Motorista</InputLabel>
            <Select
              label="Motorista"
              value={form.motoristaId}
              onChange={(e) =>
                dispatch({ type: "SET_FIELD", field: "motoristaId", value: e.target.value })
              }
              disabled={loadingOptions}
              MenuProps={menuProps}
              sx={{ color: "#e2e8f0" }}
            >
              {loadingOptions ? (
                <MenuItem disabled>
                  <CircularProgress size={16} sx={{ color: "#FFA500", mr: 1 }} />
                  Carregando...
                </MenuItem>
              ) : motoristasDisponiveis.length === 0 ? (
                <MenuItem disabled>Nenhum motorista disponível</MenuItem>
              ) : (
                motoristasDisponiveis.map((m) => (
                  <MenuItem key={m.id} value={m.id}>
                    {m.nome}
                    <Typography
                      component="span"
                      variant="caption"
                      sx={{ ml: 1, color: "rgba(255,255,255,0.35)" }}
                    >
                      CNH {m.cnh}
                    </Typography>
                  </MenuItem>
                ))
              )}
            </Select>
            {errors.motoristaId && (
              <FormHelperText>{errors.motoristaId}</FormHelperText>
            )}
          </FormControl>

          {/* Peso da Carga */}
          <TextField
            label="Carga"
            placeholder="0"
            type="number"
            value={form.pesoCargaKg}
            onChange={(e) =>
              dispatch({ type: "SET_FIELD", field: "pesoCargaKg", value: e.target.value })
            }
            error={!!errors.pesoCargaKg}
            helperText={errors.pesoCargaKg}
            fullWidth
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <Typography
                      variant="caption"
                      sx={{
                        color: "rgba(255,255,255,0.3)",
                        fontFamily: "'Barlow Condensed', sans-serif",
                        letterSpacing: "0.1em",
                      }}
                    >
                      KG
                    </Typography>
                  </InputAdornment>
                ),
              },
              htmlInput: { min: 0, step: "0.01" },
            }}
            sx={fieldSx}
          />
        </Box>
      </DialogContent>

      <Divider sx={{ mx: 3, borderColor: "rgba(255,255,255,0.07)" }} />

      {/* Rodapé */}
      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button
          onClick={handleClose}
          disabled={submitting}
          sx={{
            color: "rgba(255,255,255,0.4)",
            fontFamily: "'Barlow Condensed', sans-serif",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            "&:hover": { color: "#fff", bgcolor: "rgba(255,255,255,0.04)" },
          }}
        >
          Cancelar
        </Button>

        <Button
          onClick={handleSubmit}
          disabled={submitting}
          variant="contained"
          startIcon={
            submitting ? (
              <CircularProgress size={14} sx={{ color: "#000" }} />
            ) : null
          }
          sx={{
            bgcolor: "#FFA500",
            color: "#000",
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            px: 3,
            "&:hover": { bgcolor: "#e69400" },
            "&:disabled": { bgcolor: "rgba(255,165,0,0.3)", color: "rgba(0,0,0,0.5)" },
          }}
        >
          {submitting ? "Despachando..." : "Despachar Viagem"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}