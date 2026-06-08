export const dashboardMetrics = [
  { label: "Pacientes", value: "12", hint: "ativos no sistema" },
  { label: "Exercícios", value: "18", hint: "cadastrados" },
  { label: "Agendamentos", value: "7", hint: "na semana" },
];

export const patients = [
  { name: "Maria Silva", status: "Em tratamento", nextSession: "Hoje, 14:00" },
  { name: "João Pereira", status: "Em evolução", nextSession: "Amanhã, 09:30" },
  { name: "Ana Souza", status: "Novo paciente", nextSession: "Quinta, 16:00" },
];

export const exercises = [
  { name: "Alongamento cervical", duration: "3 min", level: "Leve" },
  { name: "Fortalecimento lombar", duration: "6 min", level: "Médio" },
  { name: "Mobilidade de ombro", duration: "5 min", level: "Leve" },
];

export const appointments = [
  { patient: "Maria Silva", time: "Hoje, 14:00", type: "Reavaliação" },
  { patient: "João Pereira", time: "Amanhã, 09:30", type: "Prescrição" },
  { patient: "Ana Souza", time: "Quinta, 16:00", type: "Acompanhamento" },
];

