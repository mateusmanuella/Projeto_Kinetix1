export const dashboardMetrics = [
  { label: "Pacientes ativos", value: "12", hint: "+3 em acompanhamento nesta semana" },
  { label: "Adesao media", value: "86%", hint: "exercicios registrados pelos pacientes" },
  { label: "Alertas clinicos", value: "4", hint: "pedem revisao de dor ou carga" },
  { label: "Sessoes hoje", value: "5", hint: "agenda confirmada ate 18:30" },
];

export const patients = [
  {
    name: "Maria Silva",
    age: 42,
    condition: "Dor lombar cronica",
    status: "Em tratamento",
    nextSession: "Hoje, 14:00",
    adherence: 92,
    pain: 3,
  },
  {
    name: "Joao Pereira",
    age: 58,
    condition: "Reabilitacao de joelho",
    status: "Em evolucao",
    nextSession: "Amanha, 09:30",
    adherence: 78,
    pain: 5,
  },
  {
    name: "Ana Souza",
    age: 31,
    condition: "Mobilidade de ombro",
    status: "Novo paciente",
    nextSession: "Quinta, 16:00",
    adherence: 64,
    pain: 2,
  },
  {
    name: "Carlos Mendes",
    age: 49,
    condition: "Fortalecimento cervical",
    status: "Ajuste de plano",
    nextSession: "Sexta, 11:15",
    adherence: 83,
    pain: 4,
  },
];

export const exercises = [
  { name: "Alongamento cervical", duration: "3 min", level: "Leve", focus: "Mobilidade" },
  { name: "Fortalecimento lombar", duration: "6 min", level: "Medio", focus: "Estabilidade" },
  { name: "Mobilidade de ombro", duration: "5 min", level: "Leve", focus: "Amplitude" },
  { name: "Agachamento assistido", duration: "8 min", level: "Moderado", focus: "Membros inferiores" },
  { name: "Ponte glutea", duration: "4 min", level: "Leve", focus: "Core" },
  { name: "Equilibrio unipodal", duration: "5 min", level: "Medio", focus: "Propriocepcao" },
];

export const appointments = [
  { patient: "Maria Silva", time: "Hoje, 14:00", type: "Reavaliacao", room: "Sala 2" },
  { patient: "Carlos Mendes", time: "Hoje, 15:30", type: "Sessao guiada", room: "Sala 1" },
  { patient: "Joao Pereira", time: "Amanha, 09:30", type: "Prescricao", room: "Online" },
  { patient: "Ana Souza", time: "Quinta, 16:00", type: "Acompanhamento", room: "Sala 3" },
];

export const evolution = [
  { week: "Semana 1", pain: 7, adherence: 52 },
  { week: "Semana 2", pain: 6, adherence: 68 },
  { week: "Semana 3", pain: 4, adherence: 81 },
  { week: "Semana 4", pain: 3, adherence: 86 },
];
