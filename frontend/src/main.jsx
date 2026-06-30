import React, { useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  Navigate,
  NavLink,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  appointmentModes,
  appointmentTypes,
  clinicRegions,
  cities,
  createSeedState,
  exerciseLevels,
  patientStatuses,
  specialties,
  storageKey,
} from "./data.js";
import "./styles.css";

function createId(prefix) {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function addDays(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function formatDate(value) {
  if (!value) return "A definir";
  const date = new Date(`${value}T12:00:00`);
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatDayTime(date, time) {
  return `${formatDate(date)} às ${time}`;
}

function formatMoney(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}

function getInitialState() {
  if (typeof window === "undefined") {
    return createSeedState();
  }

  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return createSeedState();

    const parsed = JSON.parse(raw);
    const seed = createSeedState();

      return {
      ...seed,
      ...parsed,
      users: Array.isArray(parsed.users) && parsed.users.length ? parsed.users : seed.users,
      clinics: Array.isArray(parsed.clinics) && parsed.clinics.length ? parsed.clinics : seed.clinics,
      patients: Array.isArray(parsed.patients) && parsed.patients.length ? parsed.patients : seed.patients,
      physiotherapists:
        Array.isArray(parsed.physiotherapists) && parsed.physiotherapists.length
          ? parsed.physiotherapists
          : seed.physiotherapists,
      exercises: Array.isArray(parsed.exercises) && parsed.exercises.length ? parsed.exercises : seed.exercises,
      appointments:
        Array.isArray(parsed.appointments) && parsed.appointments.length ? parsed.appointments : seed.appointments,
      prescriptions:
        Array.isArray(parsed.prescriptions) && parsed.prescriptions.length ? parsed.prescriptions : seed.prescriptions,
      painLogs: Array.isArray(parsed.painLogs) && parsed.painLogs.length ? parsed.painLogs : seed.painLogs,
    };
  } catch {
    return createSeedState();
  }
}

function sortBySchedule(a, b) {
  return `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`);
}

function getStatusTone(status) {
  if (!status) return "neutral";
  if (status.includes("Cancelado") || status.includes("Bloqueado")) return "danger";
  if (status.includes("Agendado") || status.includes("Confirmado") || status.includes("Em tratamento")) return "primary";
  if (status.includes("Novo") || status.includes("Online")) return "accent";
  return "neutral";
}

function lookupById(list, id) {
  return list.find((item) => item.id === id);
}

function Page({ eyebrow, title, description, children, action }) {
  return (
    <section className="page">
      <header className="page-hero">
        <div>
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        {action ? <div className="page-action">{action}</div> : null}
      </header>
      <div className="page-body">{children}</div>
    </section>
  );
}

function matchesSearch(value, term) {
  return String(value ?? "")
    .toLowerCase()
    .includes(term);
}

function SectionTitle({ title, action }) {
  return (
    <div className="section-title">
      <h2>{title}</h2>
      {action ? <span>{action}</span> : null}
    </div>
  );
}

function StatusPill({ children, tone = "neutral" }) {
  return <span className={`pill pill-${tone}`}>{children}</span>;
}

function AppShell({ currentUser, onLogout, children }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <div className="brand">KINETIX</div>
          <p className="brand-subtitle">Agendamentos online para fisioterapia</p>
        </div>

        <nav className="menu">
          <NavLink to="/clinicas">Clínicas</NavLink>
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/pacientes">Pacientes</NavLink>
          <NavLink to="/agendar">Agendar consulta</NavLink>
          <NavLink to="/fisioterapeutas">Fisioterapeutas</NavLink>
          <NavLink to="/exercicios">Exercícios</NavLink>
          <NavLink to="/prescricao">Prescrição</NavLink>
          <NavLink to="/evolucao">Evolução</NavLink>
          <NavLink to="/login">Login/Cadastro</NavLink>
        </nav>
      </aside>

      <div className="content-shell">
        <header className="topbar">
          <div>
            <p className="topbar-label">Clínica de fisioterapia</p>
            <strong>Central de consultas, evolução e prescrição digital</strong>
          </div>
          <div className="topbar-user">
            <div>
              <span className="muted">Sessão ativa</span>
              <strong>{currentUser ? currentUser.name : "Acesso de demonstração"}</strong>
            </div>
            <button type="button" className="button button-secondary" onClick={onLogout}>
              Sair
            </button>
          </div>
        </header>

        <main className="content">{children}</main>
      </div>
    </div>
  );
}

function PublicHomePage({ clinics }) {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("Todas");
  const [proximity, setProximity] = useState("Todas");

  const normalizedQuery = query.trim().toLowerCase();
  const filteredClinics = clinics.filter((clinic) => {
    const matchesQuery =
      !normalizedQuery ||
      [
        clinic.name,
        clinic.city,
        clinic.region,
        clinic.address,
        clinic.highlights,
        clinic.specialties.join(" "),
        clinic.keywords.join(" "),
      ].some((value) => matchesSearch(value, normalizedQuery));
    const matchesRegion = region === "Todas" || clinic.region === region;
    const matchesProximity =
      proximity === "Todas" ||
      (proximity === "Perto de mim" &&
        (clinic.distance?.includes("km") || clinic.city === "São Paulo" || clinic.city === "Santo André"));

    return matchesQuery && matchesRegion && matchesProximity;
  });

  return (
    <section className="public-page">
      <header className="public-hero">
        <div className="public-hero-copy">
          <p className="eyebrow">Rede de clínicas</p>
          <h1>Encontre clínicas de fisioterapia antes de entrar no sistema</h1>
          <p>
            Pesquise por nome, perto de você, região ou palavras-chave e veja opções prontas para agendamento.
          </p>
        </div>

        <div className="public-searchbar card">
          <div className="field">
            <label htmlFor="clinic-search">Buscar clínicas</label>
            <input
              id="clinic-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Nome, perto de mim, região ou palavra-chave"
            />
          </div>
          <div className="filters-row">
            <div className="field">
              <label htmlFor="region-filter">Região</label>
              <select id="region-filter" value={region} onChange={(event) => setRegion(event.target.value)}>
                <option value="Todas">Todas</option>
                {clinicRegions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="proximity-filter">Perto de mim</label>
              <select id="proximity-filter" value={proximity} onChange={(event) => setProximity(event.target.value)}>
                <option value="Todas">Todas</option>
                <option value="Perto de mim">Perto de mim</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      <div className="stats-grid clinic-grid">
        {filteredClinics.map((clinic) => (
          <article className="card clinic-card" key={clinic.id}>
            <div className="card-topline">
              <div>
                <h3>{clinic.name}</h3>
                <p>{clinic.city} · {clinic.region}</p>
              </div>
              <StatusPill tone="primary">{clinic.distance}</StatusPill>
            </div>
            <p className="muted-block">{clinic.highlights}</p>
            <div className="summary-list compact">
              <div>
                <span className="muted">Especialidades</span>
                <strong>{clinic.specialties.join(", ")}</strong>
              </div>
              <div>
                <span className="muted">Palavras-chave</span>
                <strong>{clinic.keywords.join(", ")}</strong>
              </div>
              <div>
                <span className="muted">Endereço</span>
                <strong>{clinic.address}</strong>
              </div>
              <div>
                <span className="muted">Contato</span>
                <strong>{clinic.phone}</strong>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function AuthPage({ currentUser, users, onLogin, onRegister }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("fisio@kinetix.com");
  const [password, setPassword] = useState("kinetix123");
  const [name, setName] = useState("Fisioterapeuta Demo");
  const [message, setMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    if (mode === "register") {
      const result = onRegister({ name, email, password });
      setMessage(result.ok ? "Cadastro criado com sucesso. Agora você já pode entrar." : result.message);
      if (result.ok) {
        setMode("login");
      }
      return;
    }

    const result = onLogin({ email, password });
    setMessage(result.ok ? "Login realizado com sucesso." : result.message);
  }

  return (
    <Page
      eyebrow="Acesso"
      title={mode === "login" ? "Login do fisioterapeuta" : "Cadastro de usuário"}
      description="Entre para administrar pacientes, agenda, prescrições e o acompanhamento de dor."
      action={<button className="button button-secondary" type="button" onClick={() => setMode(mode === "login" ? "register" : "login")}>{mode === "login" ? "Criar cadastro" : "Já tenho acesso"}</button>}
    >
      <div className="split-grid">
        <form className="card form-grid" onSubmit={handleSubmit}>
          {mode === "register" ? (
            <div className="field">
              <label htmlFor="name">Nome</label>
              <input id="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Seu nome" />
            </div>
          ) : null}
          <div className="field">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="fisio@kinetix.com"
            />
          </div>

          <div className="field">
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="********"
            />
          </div>

          <button type="submit" className="button button-primary">
            {mode === "login" ? "Entrar no painel" : "Criar cadastro"}
          </button>
          {message ? <div className="inline-note">{message}</div> : null}
        </form>

        <section className="card">
          <SectionTitle title="Acesso da sessão" action="Pronto para demonstração" />
          <p className="muted-block">
            O login e o cadastro gravam uma sessão local para permitir navegação completa no front, mesmo sem backend.
          </p>
          {currentUser ? (
            <div className="summary-list">
              <div>
                <span className="muted">Usuário logado</span>
                <strong>{currentUser.name}</strong>
              </div>
              <div>
                <span className="muted">Perfil</span>
                <strong>{currentUser.role}</strong>
              </div>
              <div>
                <span className="muted">E-mail</span>
                <strong>{currentUser.email}</strong>
              </div>
            </div>
          ) : (
            <p className="muted-block">Use o formulário ao lado para acessar o painel.</p>
          )}
          <div className="inline-note">
            Conta de demonstração: <strong>fisio@kinetix.com</strong> / <strong>kinetix123</strong>
          </div>
        </section>
      </div>
    </Page>
  );
}

function DashboardPage({ patients, physiotherapists, appointments, prescriptions, painLogs }) {
  const navigate = useNavigate();
  const activeAppointments = [...appointments].filter((item) => item.status !== "Cancelado").sort(sortBySchedule);
  const blockedPatients = patients.filter((patient) => patient.blocked);
  const nextAppointments = activeAppointments.slice(0, 4);
  const onlineAppointments = activeAppointments.filter((item) => item.mode === "Online").length;

  const metrics = [
    { label: "Pacientes acompanhados", value: patients.length, hint: "cadastros ativos" },
    { label: "Consultas agendadas", value: activeAppointments.length, hint: "na operação atual" },
    { label: "Prescrições digitais", value: prescriptions.length, hint: "registradas no sistema" },
    { label: "Alertas de dor", value: blockedPatients.length, hint: "bloqueios clínicos" },
  ];

  return (
    <Page
      eyebrow="Resumo operacional"
      title="Dashboard"
      description="Visão rápida da clínica, com foco em agendamento online e acompanhamento fisioterapêutico."
      action={
        <button type="button" className="button button-primary" onClick={() => navigate("/agendar")}>Nova consulta</button>
      }
    >
      <div className="stats-grid">
        {metrics.map((metric) => (
          <article className="card stat-card" key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <small>{metric.hint}</small>
          </article>
        ))}
      </div>

      <div className="split-grid two-up">
        <section className="card">
          <SectionTitle title="Próximas consultas" action="Atualização local" />
          <div className="stack-list">
            {nextAppointments.map((appointment) => {
              const patient = lookupById(patients, appointment.patientId);
              const therapist = lookupById(physiotherapists, appointment.therapistId);

              return (
                <article className="item-row" key={appointment.id}>
                  <div>
                    <div className="item-topline">
                      <strong>{patient?.name ?? "Paciente não encontrado"}</strong>
                      <StatusPill tone={getStatusTone(appointment.status)}>{appointment.status}</StatusPill>
                    </div>
                    <p>
                      {appointment.type} · {therapist?.name ?? "Profissional indisponível"}
                    </p>
                    <small>{formatDayTime(appointment.date, appointment.time)} · {appointment.mode}</small>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="card">
          <SectionTitle title="Indicadores clínicos" action={`${onlineAppointments} online`} />
          <div className="summary-list">
            <div>
              <span className="muted">Pacientes bloqueados</span>
              <strong>{blockedPatients.length}</strong>
            </div>
            <div>
              <span className="muted">Fisioterapeutas disponíveis</span>
              <strong>{physiotherapists.length}</strong>
            </div>
            <div>
              <span className="muted">Registros de dor</span>
              <strong>{painLogs.length}</strong>
            </div>
          </div>
          <p className="muted-block">
            O fluxo foi pensado para consultas online e presenciais, com bloqueio por dor, prescrição digital e
            acompanhamento semanal.
          </p>
        </section>
      </div>
    </Page>
  );
}
function PatientsPage({ patients, physiotherapists, appointments, onSavePatient }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    age: "",
    phone: "",
    city: cities[0],
    condition: "",
    status: patientStatuses[0],
    notes: "",
    blocked: false,
  });

  useEffect(() => {
    if (!editingId) return;
    const patient = lookupById(patients, editingId);
    if (patient) {
      setForm({
        name: patient.name,
        age: String(patient.age ?? ""),
        phone: patient.phone ?? "",
        city: patient.city ?? cities[0],
        condition: patient.condition ?? "",
        status: patient.status ?? patientStatuses[0],
        notes: patient.notes ?? "",
        blocked: Boolean(patient.blocked),
      });
    }
  }, [editingId, patients]);

  const filteredPatients = patients.filter((patient) => {
    const term = query.trim().toLowerCase();
    if (!term) return true;
    return [patient.name, patient.city, patient.condition, patient.status].some((value) =>
      String(value).toLowerCase().includes(term)
    );
  });

  function resetForm() {
    setEditingId(null);
    setForm({
      name: "",
      age: "",
      phone: "",
      city: cities[0],
      condition: "",
      status: patientStatuses[0],
      notes: "",
      blocked: false,
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSavePatient({
      id: editingId,
      name: form.name.trim(),
      age: Number(form.age) || 0,
      phone: form.phone.trim(),
      city: form.city,
      condition: form.condition.trim(),
      status: form.status,
      notes: form.notes.trim(),
      blocked: form.blocked,
    });
    resetForm();
  }

  return (
    <Page
      eyebrow="Cadastro"
      title="Pacientes"
      description="Cadastro e acompanhamento de pessoas em reabilitação, com vínculo à agenda e evolução clínica."
    >
      <div className="split-grid">
        <section className="card form-grid">
          <SectionTitle title={editingId ? "Editar paciente" : "Novo paciente"} action="MVP completo" />
          <form className="form-grid" onSubmit={handleSubmit}>
            <div className="field-row">
              <div className="field">
                <label htmlFor="patient-name">Nome</label>
                <input
                  id="patient-name"
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  placeholder="Nome completo"
                  required
                />
              </div>

              <div className="field narrow-field">
                <label htmlFor="patient-age">Idade</label>
                <input
                  id="patient-age"
                  type="number"
                  min="0"
                  value={form.age}
                  onChange={(event) => setForm({ ...form, age: event.target.value })}
                  placeholder="34"
                />
              </div>
            </div>

            <div className="field-row">
              <div className="field">
                <label htmlFor="patient-phone">Telefone</label>
                <input
                  id="patient-phone"
                  value={form.phone}
                  onChange={(event) => setForm({ ...form, phone: event.target.value })}
                  placeholder="(11) 99999-9999"
                />
              </div>

              <div className="field">
                <label htmlFor="patient-city">Cidade</label>
                <select id="patient-city" value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })}>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="field-row">
              <div className="field">
                <label htmlFor="patient-condition">Condição</label>
                <input
                  id="patient-condition"
                  value={form.condition}
                  onChange={(event) => setForm({ ...form, condition: event.target.value })}
                  placeholder="Lombalgia, ombro, joelho..."
                />
              </div>

              <div className="field">
                <label htmlFor="patient-status">Status</label>
                <select id="patient-status" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
                  {patientStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="field">
              <label htmlFor="patient-notes">Observações</label>
              <textarea
                id="patient-notes"
                rows="4"
                value={form.notes}
                onChange={(event) => setForm({ ...form, notes: event.target.value })}
                placeholder="Histórico, limitações, preferências, alertas clínicos..."
              />
            </div>

            <label className="checkline">
              <input
                type="checkbox"
                checked={form.blocked}
                onChange={(event) => setForm({ ...form, blocked: event.target.checked })}
              />
              Bloqueado por dor
            </label>

            <div className="button-row">
              <button type="submit" className="button button-primary">
                {editingId ? "Salvar alterações" : "Cadastrar paciente"}
              </button>
              {editingId ? (
                <button type="button" className="button button-secondary" onClick={resetForm}>
                  Cancelar edição
                </button>
              ) : null}
            </div>
          </form>
        </section>

        <section className="card">
          <SectionTitle title="Lista de pacientes" action={`${filteredPatients.length} registros`} />
          <div className="field search-field">
            <label htmlFor="patients-search">Buscar</label>
            <input
              id="patients-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Nome, condição, cidade ou status"
            />
          </div>

          <div className="stack-list">
            {filteredPatients.map((patient) => {
              const therapist = lookupById(physiotherapists, patient.therapistId);
              const nextAppointment = [...appointments]
                .filter((appointment) => appointment.patientId === patient.id && appointment.status !== "Cancelado")
                .sort(sortBySchedule)[0];

              return (
                <article className="item-row" key={patient.id}>
                  <div>
                    <div className="item-topline">
                      <strong>{patient.name}</strong>
                      <StatusPill tone={getStatusTone(patient.status)}>{patient.status}</StatusPill>
                    </div>
                    <p>
                      {patient.condition} · {patient.city} · {patient.age} anos
                    </p>
                    <small>
                      {patient.phone} · {therapist?.name ?? "Sem fisioterapeuta vinculado"} · Próxima sessão:{" "}
                      {nextAppointment ? formatDayTime(nextAppointment.date, nextAppointment.time) : patient.nextSession || "A definir"}
                    </small>
                    {patient.blocked ? <div className="inline-note">Bloqueado por dor até nova liberação clínica.</div> : null}
                  </div>

                  <div className="row-actions">
                    <button type="button" className="button button-secondary" onClick={() => setEditingId(patient.id)}>
                      Editar
                    </button>
                    <button type="button" className="button button-primary" onClick={() => navigate("/agendar", { state: { patientId: patient.id } })}>
                      Agendar
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </Page>
  );
}

function TherapistsPage({ physiotherapists, appointments }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("Todas");
  const [specialty, setSpecialty] = useState("Todas");

  const filteredTherapists = physiotherapists.filter((therapist) => {
    const term = query.trim().toLowerCase();
    const matchesTerm =
      !term ||
      [therapist.name, therapist.specialty, therapist.city, therapist.bio].some((value) =>
        String(value).toLowerCase().includes(term)
      );

    const matchesCity = city === "Todas" || therapist.city === city;
    const matchesSpecialty = specialty === "Todas" || therapist.specialty === specialty;

    return matchesTerm && matchesCity && matchesSpecialty;
  });

  return (
    <Page
      eyebrow="Marketplace clínico"
      title="Fisioterapeutas"
      description="Lista de profissionais, especialidades e próximos horários livres para consultas online e presenciais."
    >
      <section className="card filters-card">
        <SectionTitle title="Filtrar profissionais" action="Busca por localização" />
        <div className="filters-row">
          <div className="field">
            <label htmlFor="therapist-search">Texto</label>
            <input
              id="therapist-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Nome, especialidade ou cidade"
            />
          </div>

          <div className="field">
            <label htmlFor="city-filter">Cidade</label>
            <select id="city-filter" value={city} onChange={(event) => setCity(event.target.value)}>
              <option value="Todas">Todas</option>
              {cities.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="specialty-filter">Especialidade</label>
            <select id="specialty-filter" value={specialty} onChange={(event) => setSpecialty(event.target.value)}>
              <option value="Todas">Todas</option>
              {specialties.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <div className="stats-grid therapist-grid">
        {filteredTherapists.map((therapist) => {
          const therapistAppointments = appointments.filter(
            (item) => item.therapistId === therapist.id && item.status !== "Cancelado"
          ).length;

          return (
            <article className="card therapist-card" key={therapist.id}>
              <div className="card-topline">
                <div>
                  <h3>{therapist.name}</h3>
                  <p>{therapist.specialty}</p>
                </div>
                <StatusPill tone={therapist.online ? "accent" : "neutral"}>{therapist.online ? "Online" : "Presencial"}</StatusPill>
              </div>
              <p className="muted-block">{therapist.bio}</p>
              <div className="summary-list compact">
                <div>
                  <span className="muted">Cidade</span>
                  <strong>{therapist.city}</strong>
                </div>
                <div>
                  <span className="muted">Avaliação</span>
                  <strong>{therapist.rating.toFixed(1)}</strong>
                </div>
                <div>
                  <span className="muted">Valor</span>
                  <strong>{formatMoney(therapist.price)}</strong>
                </div>
                <div>
                  <span className="muted">Agenda</span>
                  <strong>{formatDayTime(therapist.nextSlot.split(" ")[0], therapist.nextSlot.split(" ")[1])}</strong>
                </div>
                <div>
                  <span className="muted">Consultas</span>
                  <strong>{therapistAppointments}</strong>
                </div>
              </div>
              <button type="button" className="button button-primary" onClick={() => navigate("/agendar", { state: { therapistId: therapist.id } })}>
                Agendar com este profissional
              </button>
            </article>
          );
        })}
      </div>
    </Page>
  );
}
function AppointmentPage({ patients, physiotherapists, appointments, onCreateAppointment, locationState }) {
  const [form, setForm] = useState(() => ({
    patientId: locationState?.patientId ?? "",
    patientName: "",
    patientPhone: "",
    city: cities[0],
    therapistId: locationState?.therapistId ?? physiotherapists[0]?.id ?? "",
    date: addDays(1),
    time: "09:00",
    type: appointmentTypes[0],
    mode: appointmentModes[0],
    notes: "",
  }));
  const [error, setError] = useState("");

  useEffect(() => {
    if (locationState?.patientId) {
      const patient = lookupById(patients, locationState.patientId);
      if (patient) {
        setForm((current) => ({
          ...current,
          patientId: patient.id,
          patientName: patient.name,
          patientPhone: patient.phone,
          city: patient.city,
        }));
      }
    }
  }, [locationState, patients]);

  useEffect(() => {
    if (locationState?.therapistId) {
      setForm((current) => ({ ...current, therapistId: locationState.therapistId }));
    }
  }, [locationState]);

  const selectedPatient = lookupById(patients, form.patientId);
  const selectedTherapist = lookupById(physiotherapists, form.therapistId);
  const futureAppointments = [...appointments].filter((item) => item.status !== "Cancelado").sort(sortBySchedule);

  function handlePatientSelection(patientId) {
    const patient = lookupById(patients, patientId);
    setForm((current) => ({
      ...current,
      patientId,
      patientName: patient?.name ?? "",
      patientPhone: patient?.phone ?? "",
      city: patient?.city ?? current.city,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!form.patientId && !form.patientName.trim()) {
      setError("Informe um paciente existente ou preencha os dados de um novo paciente.");
      return;
    }

    if (!form.therapistId) {
      setError("Selecione um fisioterapeuta para concluir o agendamento.");
      return;
    }

    if (selectedPatient?.blocked) {
      setError("Este paciente está bloqueado por dor e precisa de liberação clínica antes de novo agendamento.");
      return;
    }

    onCreateAppointment({
      ...form,
      patientName: form.patientName.trim(),
      patientPhone: form.patientPhone.trim(),
      city: form.city,
      notes: form.notes.trim(),
    });

    setForm({
      patientId: "",
      patientName: "",
      patientPhone: "",
      city: cities[0],
      therapistId: selectedTherapist?.id ?? physiotherapists[0]?.id ?? "",
      date: addDays(1),
      time: "09:00",
      type: appointmentTypes[0],
      mode: appointmentModes[0],
      notes: "",
    });
  }

  return (
    <Page
      eyebrow="Agendamento online"
      title="Agendar consulta"
      description="Fluxo completo para nova consulta, retorno ou avaliação, com cadastro automático do paciente quando necessário."
    >
      <div className="split-grid">
        <section className="card form-grid">
          <SectionTitle title="Nova marcação" action="Pronto para produção" />
          {error ? <div className="alert alert-danger">{error}</div> : null}
          {selectedPatient?.blocked ? (
            <div className="alert alert-warning">Paciente bloqueado por dor. Ajuste a evolução antes de reagendar.</div>
          ) : null}
          <form className="form-grid" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="existing-patient">Paciente cadastrado</label>
              <select id="existing-patient" value={form.patientId} onChange={(event) => handlePatientSelection(event.target.value)}>
                <option value="">Novo paciente</option>
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name} · {patient.city}
                  </option>
                ))}
              </select>
            </div>

            <div className="field-row">
              <div className="field">
                <label htmlFor="appointment-name">Nome do paciente</label>
                <input
                  id="appointment-name"
                  value={form.patientName}
                  onChange={(event) => setForm({ ...form, patientName: event.target.value })}
                  placeholder="Nome do paciente"
                  required={!form.patientId}
                />
              </div>
              <div className="field narrow-field">
                <label htmlFor="appointment-phone">Telefone</label>
                <input
                  id="appointment-phone"
                  value={form.patientPhone}
                  onChange={(event) => setForm({ ...form, patientPhone: event.target.value })}
                  placeholder="(11) 99999-9999"
                />
              </div>
            </div>

            <div className="field-row">
              <div className="field">
                <label htmlFor="appointment-city">Cidade</label>
                <select id="appointment-city" value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })}>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="appointment-therapist">Fisioterapeuta</label>
                <select id="appointment-therapist" value={form.therapistId} onChange={(event) => setForm({ ...form, therapistId: event.target.value })}>
                  {physiotherapists.map((therapist) => (
                    <option key={therapist.id} value={therapist.id}>
                      {therapist.name} · {therapist.specialty}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="field-row">
              <div className="field">
                <label htmlFor="appointment-date">Data</label>
                <input id="appointment-date" type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} />
              </div>
              <div className="field narrow-field">
                <label htmlFor="appointment-time">Hora</label>
                <input id="appointment-time" type="time" value={form.time} onChange={(event) => setForm({ ...form, time: event.target.value })} />
              </div>
            </div>

            <div className="field-row">
              <div className="field">
                <label htmlFor="appointment-type">Tipo</label>
                <select id="appointment-type" value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })}>
                  {appointmentTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="appointment-mode">Modalidade</label>
                <select id="appointment-mode" value={form.mode} onChange={(event) => setForm({ ...form, mode: event.target.value })}>
                  {appointmentModes.map((mode) => (
                    <option key={mode} value={mode}>
                      {mode}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="field">
              <label htmlFor="appointment-notes">Observações</label>
              <textarea
                id="appointment-notes"
                rows="4"
                value={form.notes}
                onChange={(event) => setForm({ ...form, notes: event.target.value })}
                placeholder="Motivo, preferência de horário, sintomas ou instruções para recepção..."
              />
            </div>

            <button type="submit" className="button button-primary">
              Confirmar agendamento
            </button>
          </form>
        </section>

        <section className="card">
          <SectionTitle title="Próximas marcações" action={`${futureAppointments.length} ativas`} />
          <div className="stack-list">
            {futureAppointments.map((appointment) => {
              const patient = lookupById(patients, appointment.patientId);
              const therapist = lookupById(physiotherapists, appointment.therapistId);

              return (
                <article className="item-row" key={appointment.id}>
                  <div>
                    <div className="item-topline">
                      <strong>{patient?.name ?? appointment.patientName ?? "Paciente"}</strong>
                      <StatusPill tone={getStatusTone(appointment.status)}>{appointment.status}</StatusPill>
                    </div>
                    <p>
                      {appointment.type} · {appointment.mode} · {therapist?.name ?? "Profissional"}
                    </p>
                    <small>{formatDayTime(appointment.date, appointment.time)}</small>
                    {appointment.notes ? <div className="inline-note">{appointment.notes}</div> : null}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </Page>
  );
}

function ExercisesPage({ exercises, onSaveExercise }) {
  const [form, setForm] = useState({
    name: "",
    focus: "",
    duration: "",
    level: exerciseLevels[0],
    guidance: "",
  });
  const [query, setQuery] = useState("");

  const filteredExercises = exercises.filter((exercise) => {
    const term = query.trim().toLowerCase();
    if (!term) return true;
    return [exercise.name, exercise.focus, exercise.level, exercise.guidance].some((value) =>
      String(value).toLowerCase().includes(term)
    );
  });

  function handleSubmit(event) {
    event.preventDefault();
    onSaveExercise({
      name: form.name.trim(),
      focus: form.focus.trim(),
      duration: form.duration.trim(),
      level: form.level,
      guidance: form.guidance.trim(),
    });
    setForm({ name: "", focus: "", duration: "", level: exerciseLevels[0], guidance: "" });
  }

  return (
    <Page
      eyebrow="Biblioteca clínica"
      title="Exercícios"
      description="Catálogo de exercícios prescritos para mobilidade, força e recuperação funcional."
    >
      <div className="split-grid">
        <section className="card form-grid">
          <SectionTitle title="Novo exercício" action="Cadastro rápido" />
          <form className="form-grid" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="exercise-name">Nome</label>
              <input
                id="exercise-name"
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                placeholder="Alongamento cervical"
                required
              />
            </div>

            <div className="field-row">
              <div className="field">
                <label htmlFor="exercise-focus">Foco</label>
                <input
                  id="exercise-focus"
                  value={form.focus}
                  onChange={(event) => setForm({ ...form, focus: event.target.value })}
                  placeholder="Pescoço, core, ombro..."
                />
              </div>
              <div className="field narrow-field">
                <label htmlFor="exercise-duration">Duração</label>
                <input
                  id="exercise-duration"
                  value={form.duration}
                  onChange={(event) => setForm({ ...form, duration: event.target.value })}
                  placeholder="5 min"
                />
              </div>
            </div>

            <div className="field-row">
              <div className="field">
                <label htmlFor="exercise-level">Nível</label>
                <select id="exercise-level" value={form.level} onChange={(event) => setForm({ ...form, level: event.target.value })}>
                  {exerciseLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="field">
              <label htmlFor="exercise-guidance">Orientação</label>
              <textarea
                id="exercise-guidance"
                rows="4"
                value={form.guidance}
                onChange={(event) => setForm({ ...form, guidance: event.target.value })}
                placeholder="Execução, séries, pausas e alertas"
              />
            </div>

            <button type="submit" className="button button-primary">
              Salvar exercício
            </button>
          </form>
        </section>

        <section className="card">
          <SectionTitle title="Lista de exercícios" action={`${filteredExercises.length} itens`} />
          <div className="field search-field">
            <label htmlFor="exercise-search">Buscar</label>
            <input
              id="exercise-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Nome, foco, nível ou orientação"
            />
          </div>

          <div className="stats-grid exercise-grid">
            {filteredExercises.map((exercise) => (
              <article className="card list-card" key={exercise.id}>
                <div className="card-topline">
                  <h3>{exercise.name}</h3>
                  <StatusPill tone="accent">{exercise.level}</StatusPill>
                </div>
                <p>{exercise.focus}</p>
                <div className="summary-list compact">
                  <div>
                    <span className="muted">Duração</span>
                    <strong>{exercise.duration}</strong>
                  </div>
                  <div>
                    <span className="muted">Orientação</span>
                    <strong>{exercise.guidance}</strong>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </Page>
  );
}
function PrescriptionPage({ patients, exercises, prescriptions, onSavePrescription }) {
  const [form, setForm] = useState({
    patientId: patients[0]?.id ?? "",
    exerciseId: exercises[0]?.id ?? "",
    frequency: "2x ao dia",
    sessions: "10",
    notes: "",
  });

  function handleSubmit(event) {
    event.preventDefault();
    onSavePrescription({
      patientId: form.patientId,
      exerciseId: form.exerciseId,
      frequency: form.frequency.trim(),
      sessions: Number(form.sessions) || 0,
      notes: form.notes.trim(),
    });
    setForm((current) => ({ ...current, frequency: "2x ao dia", sessions: "10", notes: "" }));
  }

  return (
    <Page
      eyebrow="Prescrição digital"
      title="Prescrição"
      description="Crie rotinas de exercício vinculadas ao paciente e mantenha o plano de cuidado sempre visível."
    >
      <div className="split-grid">
        <section className="card form-grid">
          <SectionTitle title="Nova prescrição" action="Fluxo clínico" />
          <form className="form-grid" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="prescription-patient">Paciente</label>
              <select id="prescription-patient" value={form.patientId} onChange={(event) => setForm({ ...form, patientId: event.target.value })}>
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="prescription-exercise">Exercício</label>
              <select id="prescription-exercise" value={form.exerciseId} onChange={(event) => setForm({ ...form, exerciseId: event.target.value })}>
                {exercises.map((exercise) => (
                  <option key={exercise.id} value={exercise.id}>
                    {exercise.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="field-row">
              <div className="field">
                <label htmlFor="prescription-frequency">Frequência</label>
                <input
                  id="prescription-frequency"
                  value={form.frequency}
                  onChange={(event) => setForm({ ...form, frequency: event.target.value })}
                  placeholder="2x ao dia"
                />
              </div>
              <div className="field narrow-field">
                <label htmlFor="prescription-sessions">Sessões</label>
                <input
                  id="prescription-sessions"
                  type="number"
                  min="1"
                  value={form.sessions}
                  onChange={(event) => setForm({ ...form, sessions: event.target.value })}
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="prescription-notes">Orientações</label>
              <textarea
                id="prescription-notes"
                rows="4"
                value={form.notes}
                onChange={(event) => setForm({ ...form, notes: event.target.value })}
                placeholder="Restrições, frequência, observações e progressão..."
              />
            </div>

            <button type="submit" className="button button-primary">
              Salvar prescrição
            </button>
          </form>
        </section>

        <section className="card">
          <SectionTitle title="Prescrições ativas" action={`${prescriptions.length} registros`} />
          <div className="stack-list">
            {prescriptions.map((prescription) => {
              const patient = lookupById(patients, prescription.patientId);
              const exercise = lookupById(exercises, prescription.exerciseId);

              return (
                <article className="item-row" key={prescription.id}>
                  <div>
                    <div className="item-topline">
                      <strong>{patient?.name ?? "Paciente"}</strong>
                      <StatusPill tone="primary">{prescription.frequency}</StatusPill>
                    </div>
                    <p>
                      {exercise?.name ?? "Exercício"} · {prescription.sessions} sessões
                    </p>
                    <small>{prescription.notes || "Sem observações adicionais"}</small>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </Page>
  );
}

function EvolutionPage({ patients, painLogs, onSavePainLog }) {
  const [form, setForm] = useState({
    patientId: patients[0]?.id ?? "",
    date: addDays(0),
    score: 3,
    notes: "",
  });

  const blockedPatients = patients.filter((patient) => patient.blocked);
  const recentLogs = [...painLogs].sort((a, b) => `${b.date}`.localeCompare(a.date));

  function handleSubmit(event) {
    event.preventDefault();
    onSavePainLog({
      patientId: form.patientId,
      date: form.date,
      score: Number(form.score),
      notes: form.notes.trim(),
    });
    setForm((current) => ({ ...current, score: 3, notes: "", date: addDays(0) }));
  }

  return (
    <Page
      eyebrow="Monitoramento clínico"
      title="Evolução"
      description="Registre dor, acompanhe alertas e identifique quando uma consulta precisa ser bloqueada temporariamente."
    >
      <div className="split-grid">
        <section className="card form-grid">
          <SectionTitle title="Diário de dor" action="Regra de bloqueio" />
          {blockedPatients.length ? (
            <div className="alert alert-danger">
              {blockedPatients.length} paciente(s) estão bloqueados por dor e aguardam liberação clínica.
            </div>
          ) : null}

          <form className="form-grid" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="pain-patient">Paciente</label>
              <select id="pain-patient" value={form.patientId} onChange={(event) => setForm({ ...form, patientId: event.target.value })}>
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="field-row">
              <div className="field">
                <label htmlFor="pain-date">Data</label>
                <input id="pain-date" type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} />
              </div>
              <div className="field narrow-field">
                <label htmlFor="pain-score">Dor: {form.score}</label>
                <input
                  id="pain-score"
                  type="range"
                  min="0"
                  max="10"
                  value={form.score}
                  onChange={(event) => setForm({ ...form, score: event.target.value })}
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="pain-notes">Observações</label>
              <textarea
                id="pain-notes"
                rows="4"
                value={form.notes}
                onChange={(event) => setForm({ ...form, notes: event.target.value })}
                placeholder="Gatilhos de dor, tolerância ao exercício, evolução diária..."
              />
            </div>

            <button type="submit" className="button button-primary">
              Registrar evolução
            </button>
          </form>
        </section>

        <section className="card">
          <SectionTitle title="Registros recentes" action={`${recentLogs.length} entradas`} />
          <div className="stack-list">
            {recentLogs.map((log) => {
              const patient = lookupById(patients, log.patientId);
              const tone = log.score >= 7 ? "danger" : log.score >= 4 ? "warning" : "accent";

              return (
                <article className="item-row" key={log.id}>
                  <div>
                    <div className="item-topline">
                      <strong>{patient?.name ?? "Paciente"}</strong>
                      <StatusPill tone={tone}>{log.score}/10</StatusPill>
                    </div>
                    <p>{formatDate(log.date)}</p>
                    <small>{log.notes || "Sem observações"}</small>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </Page>
  );
}

function AppRouter() {
  const [state, setState] = useState(getInitialState);
  const location = useLocation();
  const isAuthed = Boolean(state.currentUser);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(state));
  }, [state]);

  function login({ email, password }) {
    const localPart = email.split("@")[0] || "fisioterapeuta";
    const displayName = localPart
      .split(/[._-]/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");

    const user = state.users.find((item) => item.email.toLowerCase() === email.toLowerCase());
    if (!user || user.password !== password) {
      return { ok: false, message: "E-mail ou senha inválidos." };
    }

    setState((current) => ({
      ...current,
      currentUser: {
        name: user.name || displayName || "Fisioterapeuta",
        email: user.email,
        role: user.role,
      },
    }));

    return { ok: true };
  }

  function register({ name, email, password }) {
    const normalizedEmail = email.trim().toLowerCase();
    if (!name.trim() || !normalizedEmail || !password.trim()) {
      return { ok: false, message: "Preencha nome, e-mail e senha." };
    }

    const alreadyExists = state.users.some((user) => user.email.toLowerCase() === normalizedEmail);
    if (alreadyExists) {
      return { ok: false, message: "Já existe um usuário cadastrado com este e-mail." };
    }

    const newUser = {
      id: createId("user"),
      name: name.trim(),
      email: normalizedEmail,
      password: password.trim(),
      role: "Fisioterapeuta",
    };

    setState((current) => ({
      ...current,
      users: [...current.users, newUser],
      currentUser: {
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    }));

    return { ok: true };
  }

  function logout() {
    setState((current) => ({ ...current, currentUser: null }));
  }

  function savePatient(payload) {
    setState((current) => {
      if (payload.id) {
        return {
          ...current,
          patients: current.patients.map((patient) =>
            patient.id === payload.id
              ? {
                  ...patient,
                  name: payload.name,
                  age: payload.age,
                  phone: payload.phone,
                  city: payload.city,
                  condition: payload.condition,
                  status: payload.status,
                  notes: payload.notes,
                  blocked: payload.blocked,
                }
              : patient
          ),
        };
      }

      return {
        ...current,
        patients: [
          {
            id: createId("patient"),
            therapistId: "",
            nextSession: "A definir",
            painLevel: 0,
            ...payload,
          },
          ...current.patients,
        ],
      };
    });
  }

  function saveExercise(payload) {
    setState((current) => ({
      ...current,
      exercises: [
        {
          id: createId("exercise"),
          ...payload,
        },
        ...current.exercises,
      ],
    }));
  }

  function savePrescription(payload) {
    setState((current) => ({
      ...current,
      prescriptions: [
        {
          id: createId("prescription"),
          createdAt: addDays(0),
          notes: payload.notes,
          patientId: payload.patientId,
          exerciseId: payload.exerciseId,
          frequency: payload.frequency,
          sessions: payload.sessions,
        },
        ...current.prescriptions,
      ],
      patients: current.patients.map((patient) =>
        patient.id === payload.patientId ? { ...patient, status: patient.blocked ? patient.status : "Em tratamento" } : patient
      ),
    }));
  }

  function savePainLog(payload) {
    setState((current) => ({
      ...current,
      painLogs: [
        {
          id: createId("pain"),
          ...payload,
        },
        ...current.painLogs,
      ],
      patients: current.patients.map((patient) => {
        if (patient.id !== payload.patientId) {
          return patient;
        }

        const blocked = payload.score >= 7 ? true : patient.blocked;
        return {
          ...patient,
          painLevel: payload.score,
          blocked,
          status: blocked ? "Bloqueado por dor" : payload.score >= 4 ? "Em tratamento" : patient.status,
        };
      }),
    }));
  }
  function saveAppointment(payload) {
    setState((current) => {
      let patientId = payload.patientId;
      let nextPatients = current.patients;

      if (!patientId) {
        patientId = createId("patient");
        nextPatients = [
          {
            id: patientId,
            name: payload.patientName,
            age: 0,
            phone: payload.patientPhone || "Não informado",
            city: payload.city || cities[0],
            condition: "Consulta agendada online",
            status: "Novo paciente",
            therapistId: payload.therapistId,
            nextSession: `${payload.date} ${payload.time}`,
            painLevel: 0,
            notes: payload.notes,
            blocked: false,
          },
          ...nextPatients,
        ];
      }

      const appointment = {
        id: createId("appointment"),
        patientId,
        therapistId: payload.therapistId,
        date: payload.date,
        time: payload.time,
        type: payload.type,
        mode: payload.mode,
        status: "Agendado",
        notes: payload.notes,
      };

      return {
        ...current,
        patients: nextPatients.map((item) =>
          item.id === patientId
            ? {
                ...item,
                therapistId: payload.therapistId,
                nextSession: `${payload.date} ${payload.time}`,
                status: item.blocked ? item.status : item.status === "Novo paciente" ? "Em tratamento" : item.status,
              }
            : item
        ),
        appointments: [appointment, ...current.appointments],
      };
    });
  }

  return (
    <Routes>
      <Route path="/" element={<PublicHomePage clinics={state.clinics} />} />
      <Route path="/clinicas" element={<PublicHomePage clinics={state.clinics} />} />
      <Route
        path="/login"
        element={<AuthPage currentUser={state.currentUser} users={state.users} onLogin={login} onRegister={register} />}
      />
      <Route
        path="/dashboard"
        element={
          isAuthed ? (
            <AppShell currentUser={state.currentUser} onLogout={logout}>
              <DashboardPage
                patients={state.patients}
                physiotherapists={state.physiotherapists}
                appointments={state.appointments}
                prescriptions={state.prescriptions}
                painLogs={state.painLogs}
              />
            </AppShell>
          ) : (
            <PublicHomePage clinics={state.clinics} />
          )
        }
      />
      <Route
        path="/pacientes"
        element={
          isAuthed ? (
            <AppShell currentUser={state.currentUser} onLogout={logout}>
              <PatientsPage
                patients={state.patients}
                physiotherapists={state.physiotherapists}
                appointments={state.appointments}
                onSavePatient={savePatient}
              />
            </AppShell>
          ) : (
            <PublicHomePage clinics={state.clinics} />
          )
        }
      />
      <Route
        path="/agendar"
        element={
          isAuthed ? (
            <AppShell currentUser={state.currentUser} onLogout={logout}>
              <AppointmentPage
                patients={state.patients}
                physiotherapists={state.physiotherapists}
                appointments={state.appointments}
                onCreateAppointment={saveAppointment}
                locationState={location.state}
              />
            </AppShell>
          ) : (
            <PublicHomePage clinics={state.clinics} />
          )
        }
      />
      <Route
        path="/fisioterapeutas"
        element={
          isAuthed ? (
            <AppShell currentUser={state.currentUser} onLogout={logout}>
              <TherapistsPage physiotherapists={state.physiotherapists} appointments={state.appointments} />
            </AppShell>
          ) : (
            <PublicHomePage clinics={state.clinics} />
          )
        }
      />
      <Route
        path="/exercicios"
        element={
          isAuthed ? (
            <AppShell currentUser={state.currentUser} onLogout={logout}>
              <ExercisesPage exercises={state.exercises} onSaveExercise={saveExercise} />
            </AppShell>
          ) : (
            <PublicHomePage clinics={state.clinics} />
          )
        }
      />
      <Route
        path="/prescricao"
        element={
          isAuthed ? (
            <AppShell currentUser={state.currentUser} onLogout={logout}>
              <PrescriptionPage
                patients={state.patients}
                exercises={state.exercises}
                prescriptions={state.prescriptions}
                onSavePrescription={savePrescription}
              />
            </AppShell>
          ) : (
            <PublicHomePage clinics={state.clinics} />
          )
        }
      />
      <Route
        path="/evolucao"
        element={
          isAuthed ? (
            <AppShell currentUser={state.currentUser} onLogout={logout}>
              <EvolutionPage patients={state.patients} painLogs={state.painLogs} onSavePainLog={savePainLog} />
            </AppShell>
          ) : (
            <PublicHomePage clinics={state.clinics} />
          )
        }
      />
      <Route path="*" element={<PublicHomePage clinics={state.clinics} />} />
    </Routes>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  </React.StrictMode>
);
