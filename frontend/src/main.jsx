import React, { useMemo, useState } from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Navigate, NavLink, Route, Routes } from "react-router-dom";
import { appointments, dashboardMetrics, evolution, exercises, patients } from "./data.js";
import "./styles.css";

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/pacientes", label: "Pacientes" },
  { to: "/exercicios", label: "Exercicios" },
  { to: "/agenda", label: "Agenda" },
  { to: "/prescricao", label: "Prescricao" },
  { to: "/evolucao", label: "Evolucao" },
];

function AppShell({ children }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <div className="brand">KINETIX</div>
          <p>Painel do Fisioterapeuta</p>
        </div>

        <nav className="menu" aria-label="Navegacao principal">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <span>Status</span>
          <strong>Demo pronta para apresentacao</strong>
        </div>
      </aside>

      <main className="content">{children}</main>
    </div>
  );
}

function Page({ title, description, action, children }) {
  return (
    <section className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">KINETIX Web</p>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        {action}
      </header>
      {children}
    </section>
  );
}

function SectionTitle({ label, action }) {
  return (
    <div className="section-title">
      <h2>{label}</h2>
      {action ? <span>{action}</span> : null}
    </div>
  );
}

function ProgressBar({ value, tone = "primary" }) {
  return (
    <div className="progress" aria-label={`${value}%`}>
      <span className={tone} style={{ width: `${value}%` }} />
    </div>
  );
}

function LoginPage() {
  const [logged, setLogged] = useState(false);

  return (
    <Page
      title="Acesso ao painel"
      description="Entrada demonstrativa para validar o fluxo do fisioterapeuta antes da integracao completa com autenticacao."
    >
      <div className="login-layout">
        <form className="card form-grid" onSubmit={(event) => event.preventDefault()}>
          <label>
            E-mail
            <input type="email" defaultValue="fisio@kinetix.com" />
          </label>
          <label>
            Senha
            <input type="password" defaultValue="kinetix-demo" />
          </label>
          <button type="button" onClick={() => setLogged(true)}>
            Entrar no painel
          </button>
          {logged ? <p className="success-message">Acesso demonstrativo validado.</p> : null}
        </form>

        <section className="panel-note">
          <h2>Entrega web</h2>
          <p>
            O painel esta preparado para deploy estatico e apresenta os fluxos principais do MVP:
            pacientes, agenda, prescricao, biblioteca de exercicios e evolucao clinica.
          </p>
        </section>
      </div>
    </Page>
  );
}

function DashboardPage() {
  return (
    <Page
      title="Dashboard clinico"
      description="Resumo operacional para priorizar atendimentos, prescricoes e alertas de dor."
      action={<NavLink className="primary-action" to="/prescricao">Nova prescricao</NavLink>}
    >
      <div className="grid metrics-grid">
        {dashboardMetrics.map((metric) => (
          <article className="card metric" key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <small>{metric.hint}</small>
          </article>
        ))}
      </div>

      <div className="grid dashboard-columns">
        <section className="card">
          <SectionTitle label="Pacientes prioritarios" action="Atualizado hoje" />
          <div className="stack-list">
            {patients.slice(0, 3).map((patient) => (
              <article className="row-item" key={patient.name}>
                <div>
                  <strong>{patient.name}</strong>
                  <p>{patient.condition}</p>
                </div>
                <span>{patient.nextSession}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="card">
          <SectionTitle label="Proximas sessoes" action="Agenda parcial" />
          <div className="stack-list">
            {appointments.map((appointment) => (
              <article className="row-item" key={`${appointment.patient}-${appointment.time}`}>
                <div>
                  <strong>{appointment.patient}</strong>
                  <p>{appointment.type} - {appointment.room}</p>
                </div>
                <span>{appointment.time}</span>
              </article>
            ))}
          </div>
        </section>
      </div>
    </Page>
  );
}

function PacientesPage() {
  return (
    <Page
      title="Pacientes"
      description="Acompanhamento rapido de status, adesao, dor e proxima sessao."
      action={<button className="primary-action" type="button">Adicionar paciente</button>}
    >
      <div className="grid patients-grid">
        {patients.map((patient) => (
          <article className="card profile-card" key={patient.name}>
            <div className="card-topline">
              <span>{patient.status}</span>
              <strong>Dor {patient.pain}/10</strong>
            </div>
            <h2>{patient.name}</h2>
            <p>{patient.age} anos - {patient.condition}</p>
            <dl>
              <div>
                <dt>Proxima sessao</dt>
                <dd>{patient.nextSession}</dd>
              </div>
              <div>
                <dt>Adesao</dt>
                <dd>{patient.adherence}%</dd>
              </div>
            </dl>
            <ProgressBar value={patient.adherence} />
          </article>
        ))}
      </div>
    </Page>
  );
}

function ExerciciosPage() {
  const [query, setQuery] = useState("");
  const filteredExercises = useMemo(
    () => exercises.filter((exercise) => exercise.name.toLowerCase().includes(query.toLowerCase())),
    [query]
  );

  return (
    <Page
      title="Biblioteca de exercicios"
      description="Catalogo inicial para apoiar prescricoes e padronizar orientacoes."
      action={
        <label className="search-field">
          <span>Buscar</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Nome do exercicio" />
        </label>
      }
    >
      <div className="grid exercise-grid">
        {filteredExercises.map((exercise) => (
          <article className="card exercise-card" key={exercise.name}>
            <span>{exercise.focus}</span>
            <h2>{exercise.name}</h2>
            <p>{exercise.duration} - nivel {exercise.level}</p>
          </article>
        ))}
      </div>
    </Page>
  );
}

function AgendaPage() {
  return (
    <Page
      title="Agenda"
      description="Visao da semana para organizar sessoes presenciais, online e retornos."
      action={<button className="primary-action" type="button">Novo horario</button>}
    >
      <section className="card table-card">
        <table>
          <thead>
            <tr>
              <th>Horario</th>
              <th>Paciente</th>
              <th>Tipo</th>
              <th>Local</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={`${appointment.patient}-${appointment.time}`}>
                <td>{appointment.time}</td>
                <td>{appointment.patient}</td>
                <td>{appointment.type}</td>
                <td>{appointment.room}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </Page>
  );
}

function PrescricaoPage() {
  const [saved, setSaved] = useState(false);

  return (
    <Page title="Prescricao" description="Fluxo demonstrativo para montar e registrar uma rotina terapeutica.">
      <form className="card form-grid wide-form" onSubmit={(event) => event.preventDefault()}>
        <label>
          Paciente
          <select defaultValue="Maria Silva">
            {patients.map((patient) => (
              <option key={patient.name}>{patient.name}</option>
            ))}
          </select>
        </label>
        <label>
          Exercicio
          <select defaultValue="Alongamento cervical">
            {exercises.map((exercise) => (
              <option key={exercise.name}>{exercise.name}</option>
            ))}
          </select>
        </label>
        <div className="inline-fields">
          <label>
            Series
            <input type="number" min="1" defaultValue="3" />
          </label>
          <label>
            Repeticoes
            <input type="number" min="1" defaultValue="12" />
          </label>
        </div>
        <label>
          Orientacoes
          <textarea rows="4" defaultValue="Interromper se a dor ultrapassar 6/10 e registrar observacao no diario." />
        </label>
        <button type="button" onClick={() => setSaved(true)}>
          Salvar prescricao
        </button>
        {saved ? <p className="success-message">Prescricao demonstrativa salva.</p> : null}
      </form>
    </Page>
  );
}

function EvolutionPage() {
  return (
    <Page title="Evolucao" description="Leitura simples de dor e adesao para apoiar decisoes clinicas.">
      <div className="grid evolution-grid">
        {evolution.map((item) => (
          <article className="card evolution-card" key={item.week}>
            <h2>{item.week}</h2>
            <div>
              <span>Dor</span>
              <strong>{item.pain}/10</strong>
              <ProgressBar value={item.pain * 10} tone="danger" />
            </div>
            <div>
              <span>Adesao</span>
              <strong>{item.adherence}%</strong>
              <ProgressBar value={item.adherence} />
            </div>
          </article>
        ))}
      </div>
    </Page>
  );
}

function App() {
  return (
    <HashRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/pacientes" element={<PacientesPage />} />
          <Route path="/exercicios" element={<ExerciciosPage />} />
          <Route path="/agenda" element={<AgendaPage />} />
          <Route path="/prescricao" element={<PrescricaoPage />} />
          <Route path="/evolucao" element={<EvolutionPage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AppShell>
    </HashRouter>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
