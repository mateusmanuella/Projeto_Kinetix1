const today = new Date();
const iso = (offsetDays = 0) => {
  const date = new Date(today);
  date.setDate(today.getDate() + offsetDays);
  return date.toISOString().slice(0, 10);
};

export const storageKey = "kinetix-state-v1";

export const appointmentTypes = [
  "Consulta inicial",
  "Avaliação funcional",
  "Retorno",
  "Reavaliação",
  "Prescrição digital",
];

export const appointmentModes = ["Presencial", "Online"];

export const patientStatuses = [
  "Novo paciente",
  "Em tratamento",
  "Em evolução",
  "Alta programada",
  "Bloqueado por dor",
];

export const exerciseLevels = ["Leve", "Moderado", "Intenso"];

export const specialties = [
  "Fisioterapia ortopédica",
  "Fisioterapia esportiva",
  "Fisioterapia respiratória",
  "Fisioterapia neurofuncional",
  "Pilates clínico",
];

export const cities = ["São Paulo", "Santo André", "Mauá", "São Bernardo do Campo", "Diadema"];

export const clinicRegions = ["Centro", "Zona Sul", "Zona Leste", "Zona Oeste", "ABC Paulista"];

export const createSeedState = () => ({
  currentUser: null,
  users: [
    {
      id: "user-1",
      name: "Fisioterapeuta Demo",
      email: "fisio@kinetix.com",
      password: "kinetix123",
      role: "Fisioterapeuta",
    },
  ],
  clinics: [
    {
      id: "clinic-1",
      name: "Kinetix Reabilitação",
      region: "Centro",
      city: "São Paulo",
      specialties: ["Fisioterapia ortopédica", "Pilates clínico"],
      keywords: ["dor lombar", "postura", "reabilitação"],
      address: "Av. Paulista, 1000",
      distance: "1,2 km",
      rating: 4.9,
      phone: "(11) 3333-1111",
      highlights: "Atendimento presencial e online com agenda rápida.",
    },
    {
      id: "clinic-2",
      name: "Movimenta Fisio",
      region: "Zona Sul",
      city: "São Paulo",
      specialties: ["Fisioterapia esportiva", "Fisioterapia neurofuncional"],
      keywords: ["esporte", "joelho", "ombro"],
      address: "Rua Vergueiro, 2400",
      distance: "2,8 km",
      rating: 4.8,
      phone: "(11) 3222-4455",
      highlights: "Foco em retorno ao esporte e avaliação funcional.",
    },
    {
      id: "clinic-3",
      name: "ABC Fisio Clinic",
      region: "ABC Paulista",
      city: "Santo André",
      specialties: ["Fisioterapia respiratória", "Fisioterapia ortopédica"],
      keywords: ["respiratório", "pós-operatório", "mobilidade"],
      address: "Av. Industrial, 455",
      distance: "3,5 km",
      rating: 4.7,
      phone: "(11) 4004-7788",
      highlights: "Terapias para reabilitação e acompanhamento clínico contínuo.",
    },
    {
      id: "clinic-4",
      name: "Bem-Estar Movimento",
      region: "Zona Leste",
      city: "Mauá",
      specialties: ["Pilates clínico", "Fisioterapia neurofuncional"],
      keywords: ["pilates", "coluna", "equilíbrio"],
      address: "Rua João Ramalho, 88",
      distance: "4,1 km",
      rating: 4.6,
      phone: "(11) 95555-8899",
      highlights: "Acompanhamento individual e exercícios guiados.",
    },
  ],
  patients: [
    {
      id: "patient-1",
      name: "Maria Silva",
      age: 34,
      phone: "(11) 98811-2233",
      city: "São Paulo",
      condition: "Lombalgia",
      status: "Em tratamento",
      therapistId: "therapist-1",
      nextSession: `${iso(0)} 14:00`,
      painLevel: 3,
      notes: "Dor reduzida após alongamento e mobilidade.",
      blocked: false,
    },
    {
      id: "patient-2",
      name: "João Pereira",
      age: 41,
      phone: "(11) 97722-4455",
      city: "Santo André",
      condition: "Pós-operatório de ombro",
      status: "Em evolução",
      therapistId: "therapist-2",
      nextSession: `${iso(1)} 09:30`,
      painLevel: 5,
      notes: "Foco em ganho de amplitude e força funcional.",
      blocked: false,
    },
    {
      id: "patient-3",
      name: "Ana Souza",
      age: 28,
      phone: "(11) 96633-7788",
      city: "Mauá",
      condition: "Tendinite no punho",
      status: "Novo paciente",
      therapistId: "therapist-3",
      nextSession: `${iso(2)} 16:00`,
      painLevel: 2,
      notes: "Primeira avaliação agendada para triagem e prescrição.",
      blocked: false,
    },
  ],
  physiotherapists: [
    {
      id: "therapist-1",
      name: "Dra. Camila Rocha",
      specialty: "Fisioterapia ortopédica",
      city: "São Paulo",
      rating: 4.9,
      nextSlot: `${iso(0)} 14:00`,
      price: 180,
      online: true,
      bio: "Reabilitação musculoesquelética com foco em dor lombar e joelho.",
    },
    {
      id: "therapist-2",
      name: "Dr. Bruno Almeida",
      specialty: "Fisioterapia esportiva",
      city: "Santo André",
      rating: 4.8,
      nextSlot: `${iso(1)} 09:30`,
      price: 200,
      online: false,
      bio: "Retorno seguro ao esporte e recuperação de lesões de ombro e tornozelo.",
    },
    {
      id: "therapist-3",
      name: "Dra. Fernanda Lima",
      specialty: "Pilates clínico",
      city: "Mauá",
      rating: 4.7,
      nextSlot: `${iso(2)} 16:00`,
      price: 150,
      online: true,
      bio: "Controle motor, postura e fortalecimento progressivo em sessões guiadas.",
    },
    {
      id: "therapist-4",
      name: "Dr. Rafael Costa",
      specialty: "Fisioterapia respiratória",
      city: "São Bernardo do Campo",
      rating: 4.6,
      nextSlot: `${iso(3)} 11:00`,
      price: 170,
      online: true,
      bio: "Acompanhamento respiratório e suporte para reabilitação funcional.",
    },
  ],
  exercises: [
    {
      id: "exercise-1",
      name: "Alongamento cervical",
      focus: "Pescoço e trapézio",
      duration: "3 min",
      level: "Leve",
      guidance: "3 séries de 30 segundos, sem ultrapassar o limite de dor.",
    },
    {
      id: "exercise-2",
      name: "Fortalecimento lombar",
      focus: "Core e estabilização",
      duration: "6 min",
      level: "Moderado",
      guidance: "2 séries de 12 repetições com pausa de 45 segundos.",
    },
    {
      id: "exercise-3",
      name: "Mobilidade de ombro",
      focus: "Amplitude articular",
      duration: "5 min",
      level: "Leve",
      guidance: "Movimentos lentos com apoio de faixa elástica leve.",
    },
  ],
  appointments: [
    {
      id: "appointment-1",
      patientId: "patient-1",
      therapistId: "therapist-1",
      date: iso(0),
      time: "14:00",
      type: "Reavaliação",
      mode: "Presencial",
      status: "Confirmado",
      notes: "Verificar evolução da lombalgia e adesão aos exercícios.",
    },
    {
      id: "appointment-2",
      patientId: "patient-2",
      therapistId: "therapist-2",
      date: iso(1),
      time: "09:30",
      type: "Consulta inicial",
      mode: "Presencial",
      status: "Agendado",
      notes: "Primeiro retorno após cirurgia de ombro.",
    },
    {
      id: "appointment-3",
      patientId: "patient-3",
      therapistId: "therapist-3",
      date: iso(2),
      time: "16:00",
      type: "Avaliação funcional",
      mode: "Online",
      status: "Agendado",
      notes: "Triagem para tendinite no punho e plano inicial.",
    },
  ],
  prescriptions: [
    {
      id: "prescription-1",
      patientId: "patient-1",
      exerciseId: "exercise-1",
      frequency: "2x ao dia",
      sessions: 10,
      createdAt: iso(-1),
      notes: "Controle de postura e respiração durante a execução.",
    },
    {
      id: "prescription-2",
      patientId: "patient-2",
      exerciseId: "exercise-3",
      frequency: "1x ao dia",
      sessions: 8,
      createdAt: iso(0),
      notes: "Progressão leve, respeitando desconforto tolerável.",
    },
  ],
  painLogs: [
    {
      id: "pain-1",
      patientId: "patient-1",
      date: iso(-2),
      score: 4,
      notes: "Desconforto moderado após atividade doméstica.",
    },
    {
      id: "pain-2",
      patientId: "patient-2",
      date: iso(-1),
      score: 6,
      notes: "Aumento de dor após movimentação acima da cabeça.",
    },
  ],
});
