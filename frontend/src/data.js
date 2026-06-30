const today = new Date();
const iso = (offsetDays = 0) => {
  const date = new Date(today);
  date.setDate(today.getDate() + offsetDays);
  return date.toISOString().slice(0, 10);
};

export const storageKey = "kinetix-state-v1";

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
      phone: "(11) 4004-7788",
      highlights: "Terapias para reabilitação e acompanhamento clínico contínuo.",
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
      nextSession: `${iso(0)} 14:00`,
    },
    {
      id: "patient-2",
      name: "João Pereira",
      age: 41,
      phone: "(11) 97722-4455",
      city: "Santo André",
      condition: "Pós-operatório de ombro",
      status: "Em evolução",
      nextSession: `${iso(1)} 09:30`,
    },
  ],
});
