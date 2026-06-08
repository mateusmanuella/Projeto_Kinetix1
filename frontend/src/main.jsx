import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Navigate, NavLink, Route, Routes } from "react-router-dom";
import { appointments, dashboardMetrics, exercises, patients } from "./data.js";
import "./styles.css";

function AppShell({ children }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <div className="brand">KINETIX</div>
          <p className="brand-subtitle">Painel do Fisioterapeuta</p>
        </div>

        <nav className="menu">
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/pacientes">Pacientes</NavLink>
          <NavLink to="/exercicios">Exercícios</NavLink>
          <NavLink to="/agenda">Agenda</NavLink>
          <NavLink to="/login">Login</NavLink>
        </nav>
      </aside>

      <main className="content">{children}</main>
    </div>
  );
}

function Page({ title, description, children }) {
  return (
    <section className="page">
      <header className="page-header">
        <h1>{title}</h1>
        <p>{description}</p>
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

function LoginPage() {
  return (
    <Page title="Login" description="Acesso inicial do fisioterapeuta ao painel do KINETIX.">
      <form className="card form-grid">
        <label>
          E-mail
          <input type="email" placeholder="fisio@kinetix.com" />
        </label>
        <label>
          Senha
          <input type="password" placeholder="••••••••" />
        </label>
        <button type="button">Entrar no painel</button>
      </form>
    </Page>
  );
}

function DashboardPage() {
  return (
    <Page title="Dashboard" description="Resumo inicial de pacientes, exercícios e agenda.">
      <div className="grid cards-3">
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
          <SectionTitle label="Próximos pacientes" action="Atualizado hoje" />
          <div className="stack-list">
            {patients.map((patient) => (
              <article className="row-item" key={patient.name}>
                <div>
                  <strong>{patient.name}</strong>
                  <p>{patient.status}</p>
                </div>
                <span>{patient.nextSession}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="card">
          <SectionTitle label="Próximas sessões" action="Agenda parcial" />
          <div className="stack-list">
            {appointments.map((appointment) => (
              <article className="row-item" key={appointment.patient}>
                <div>
                  <strong>{appointment.patient}</strong>
                  <p>{appointment.type}</p>
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
    <Page title="Pacientes" description="Lista inicial de pacientes cadastrados.">
      <SectionTitle label="Cadastro e acompanhamento" action="Sprint 4" />
      <div className="grid cards-3">
        {patients.map((patient) => (
          <article className="card profile-card" key={patient.name}>
            <h3>{patient.name}</h3>
            <p>{patient.status}</p>
            <span>Próxima sessão: {patient.nextSession}</span>
          </article>
        ))}
      </div>
    </Page>
  );
}

function ExerciciosPage() {
  return (
    <Page title="Exercícios" description="Catálogo inicial de exercícios prescritos.">
      <SectionTitle label="Biblioteca de exercícios" action="Base do MVP" />
      <div className="grid cards-3">
        {exercises.map((exercise) => (
          <article className="card profile-card" key={exercise.name}>
            <h3>{exercise.name}</h3>
            <p>Duração média: {exercise.duration}</p>
            <span>Nível: {exercise.level}</span>
          </article>
        ))}
      </div>
    </Page>
  );
}

function AgendaPage() {
  return (
    <Page title="Agenda" description="Próximos atendimentos e acompanhamento das sessões.">
      <SectionTitle label="Agenda da semana" action="Sprint 4" />
      <div className="card list-card">
        <ul>
          {appointments.map((appointment) => (
            <li key={appointment.patient}>
              {appointment.time} - {appointment.patient} - {appointment.type}
            </li>
          ))}
        </ul>
      </div>
    </Page>
  );
}

function PrescricaoPage() {
  return (
    <Page title="Prescrição" description="Fluxo inicial de prescrição digital e acompanhamento clínico.">
      <SectionTitle label="Nova prescrição" action="MVP clínico" />
      <form className="card form-grid wide-form">
        <label>
          Paciente
          <input type="text" placeholder="Maria Silva" />
        </label>
        <label>
          Exercício
          <input type="text" placeholder="Alongamento cervical" />
        </label>
        <label>
          Observações
          <textarea rows="4" placeholder="Orientações, limites e frequência..." />
        </label>
        <button type="button">Salvar prescrição</button>
      </form>
    </Page>
  );
}

function EvolutionPage() {
  return (
    <Page title="Evolução" description="Visualização inicial do progresso do paciente.">
      <div className="grid dashboard-columns">
        <section className="card">
          <SectionTitle label="Diário de dor" action="Sprint 5" />
          <p className="muted-block">
            Registro semanal de dor, alertas e acompanhamento da reabilitação.
          </p>
        </section>
        <section className="card">
          <SectionTitle label="Alertas clínicos" action="Bloqueio por dor" />
          <p className="muted-block">
            Quando a dor ultrapassar o limite definido, o exercício pode ser bloqueado.
          </p>
        </section>
      </div>
    </Page>
  );
}

function App() {
  return (
    <BrowserRouter>
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
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
