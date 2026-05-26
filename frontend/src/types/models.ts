// Alterado de enum para const object + type (Padrão moderno aceito pelo Vite)
export const StatusVeiculo = {
  Disponivel: "Disponivel",
  EmRota: "EmRota",
  Manutencao: "Manutencao",
} as const;
export type StatusVeiculo = typeof StatusVeiculo[keyof typeof StatusVeiculo];

export const StatusMotorista = {
  Disponivel: "Disponivel",
  EmRota: "EmRota",
  Inativo: "Inativo",
} as const;
export type StatusMotorista = typeof StatusMotorista[keyof typeof StatusMotorista];

export const StatusViagem = {
  Planejada: "Planejada",
  EmAndamento: "EmAndamento",
  Concluida: "Concluida",
  Cancelada: "Cancelada", // Novo Status
} as const;
export type StatusViagem = typeof StatusViagem[keyof typeof StatusViagem];

// As interfaces permanecem iguaizinhas e perfeitas
export interface Veiculo {
  id: string;
  placa: string;
  modelo: string;
  capacidadeCargaKg: number;
  status: StatusVeiculo;
}

export interface Motorista {
  id: string;
  nome: string;
  cnh: string;
  status: StatusMotorista;
}

export interface Viagem {
  id: string;
  veiculoId: string;
  motoristaId: string;
  destino: string;
  pesoCargaKg: number;
  status: StatusViagem;
  dataCriacao: string;
  veiculo: Veiculo;
  motorista: Motorista;
  motivoCancelamento?: string; // Novo Campo de Auditoria
}