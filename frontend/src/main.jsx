import React, { useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, NavLink, Route, Routes, useNavigate } from "react-router-dom";
import { clinicRegions, createSeedState, storageKey } from "./data.js";
import "./styles.css";

function createId(prefix) {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function usePersistedState() {
  const [state, setState] = useState(() => {
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
      };
    } catch {
      return createSeedState();
    }
  });

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(state));
  }, [state]);

  return [state, setState];
}

function getTone(value) {
  if (!value) return "neutral";
  return value.toLowerCase().includes("dor") ? "danger" : "primary";
}

function Shell({ currentUser, onLogout, children }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <div className="brand">KINETIX</div>
          <p className="brand-subtitle">Painel do fisioterapeuta</p>
        </div>
        <nav className="menu">
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/pacientes">Pacientes</NavLink>
          <NavLink to="/clínicas">Clínicas</NavLink>
          <NavLink to="/login">Login / Cadastro</NavLink>
        </nav>
      </aside>
      <div className="content-shell">
        <header className="topbar">
          <div>
            <p className="topbar-label">Clínica de fisioterapia</p>
            <strong>Central de consultas, evolução e prescrição</strong>
          </div>
          <div className="topbar-user">
            <div>
              <span className="muted">Sessão ativa</span>
              <strong>{currentUser?.name ?? "Visitante"}</strong>
            </div>
            {currentUser ? (
              <button type="button" className="button button-secondary" onClick={onLogout}>
                Sair
              </button>
            ) : null}
          </div>
        </header>
        <main className="content">{children}</main>
      </div>
    </div>
  );
}

function PublicHomePage({ clinics }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("Todas");

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return clinics.filter((clinic) => {
      const matchesTerm =
        !term ||
        [clinic.name, clinic.city, clinic.region, clinic.address, clinic.specialties.join(" "), clinic.keywords.join(" ")]
          .join(" ")
          .toLowerCase()
          .includes(term);
      const matchesRegion = region === "Todas" || clinic.region === region;
      return matchesTerm && matchesRegion;
    });
  }, [clinics, query, region]);

  return (
    <section className="public-page">
      <header className="public-hero">
        <div className="public-hero-copy">
          <p className="eyebrow">Rede de clínicas</p>
          <h1>Encontre clínicas de fisioterapia antes de entrar no sistema</h1>
          <p>Pesquise por nome, região ou palavras-chave e veja opções para agendamento.</p>
          <div className="public-actions">
            <button type="button" className="button button-primary" onClick={() => navigate("/login")}>
              Ir para login
            </button>
            <button type="button" className="button button-secondary" onClick={() => navigate("/login")}>
              Ir para cadastro
            </button>
          </div>
        </div>
        <div className="public-searchbar card">
          <div className="field">
            <label htmlFor="search">Buscar clínicas</label>
            <input
              id="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Nome, perto de mim, região ou palavra-chave"
            />
          </div>
          <div className="field">
            <label htmlFor="region">Região</label>
            <select id="region" value={region} onChange={(event) => setRegion(event.target.value)}>
              <option value="Todas">Todas</option>
              {clinicRegions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>
      <div className="stats-grid clinic-grid">
        {filtered.map((clinic) => (
          <article className="card clinic-card" key={clinic.id}>
            <div className="card-topline">
              <div>
                <h3>{clinic.name}</h3>
                <p>
                  {clinic.city} · {clinic.region}
                </p>
              </div>
              <span className="pill pill-primary">{clinic.distance}</span>
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

function AuthPage({ users, onLogin, onRegister, currentUser }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("Fisioterapeuta Demo");
  const [email, setEmail] = useState("fisio@kinetix.com");
  const [password, setPassword] = useState("kinetix123");
  const [message, setMessage] = useState("");

  function submit(event) {
    event.preventDefault();
    const result =
      mode === "login" ? onLogin({ email, password }) : onRegister({ name, email, password });
    setMessage(result.message ?? (result.ok ? "OK" : "Erro"));
    if (result.ok && mode === "register") setMode("login");
  }

  return (
    <section className="page auth-page">
      <header className="page-hero">
        <div>
          <p className="eyebrow">Acesso</p>
          <h1>{mode === "login" ? "Login do fisioterapeuta" : "Cadastro de usuário"}</h1>
          <p>Entre para administrar pacientes, agenda e evolução clínica.</p>
        </div>
        <button className="button button-secondary" type="button" onClick={() => setMode(mode === "login" ? "register" : "login")}>
          {mode === "login" ? "Criar cadastro" : "Já tenho acesso"}
        </button>
      </header>
      <div className="split-grid">
        <form className="card form-grid" onSubmit={submit}>
          {mode === "register" ? (
            <div className="field">
              <label htmlFor="name">Nome</label>
              <input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
          ) : null}
          <div className="field">
            <label htmlFor="email">E-mail</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="password">Senha</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="button button-primary">
            {mode === "login" ? "Entrar no painel" : "Criar cadastro"}
          </button>
          {message ? <div className="inline-note">{message}</div> : null}
        </form>
        <section className="card">
          <SectionTitle title="Acesso de demonstração" action="Local" />
          <p className="muted-block">
            O login grava uma sessão local. A conta padrão é <strong>fisio@kinetix.com</strong> /{" "}
            <strong>kinetix123</strong>.
          </p>
          <div className="summary-list">
            <div>
              <span className="muted">Usuários cadastrados</span>
              <strong>{users.length}</strong>
            </div>
            <div>
              <span className="muted">Sessão</span>
              <strong>{currentUser ? currentUser.name : "Nenhuma"}</strong>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}

function SectionTitle({ title, action }) {
  return (
    <div className="section-title">
      <h2>{title}</h2>
      <span>{action}</span>
    </div>
  );
}

function DashboardPage({ patients }) {
  return (
    <section className="page">
      <header className="page-hero">
        <div>
          <p className="eyebrow">Resumo operacional</p>
          <h1>Dashboard</h1>
        </div>
      </header>
      <div className="stats-grid">
        <article className="card stat-card">
          <span>Pacientes</span>
          <strong>{patients.length}</strong>
        </article>
      </div>
    </section>
  );
}

function PatientsPage({ patients }) {
  return (
    <section className="page">
      <header className="page-hero">
        <div>
          <p className="eyebrow">Cadastro</p>
          <h1>Pacientes</h1>
        </div>
      </header>
      <div className="stack-list">
        {patients.map((patient) => (
          <article className="item-row" key={patient.id}>
            <strong>{patient.name}</strong>
            <p className="muted-block">
              {patient.condition} · {patient.city}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

function PlaceholderPage({ title, description }) {
  return (
    <section className="page">
      <header className="page-hero">
        <div>
          <p className="eyebrow">Área interna</p>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
      </header>
      <div className="card">
        <p className="muted-block">Área pronta para conectar com o restante do sistema.</p>
      </div>
    </section>
  );
}

function AppRouter() {
  const [state, setState] = usePersistedState();

  function login({ email, password }) {
    const user = state.users.find((item) => item.email.toLowerCase() === email.trim().toLowerCase());
    if (!user || user.password !== password) {
      return { ok: false, message: "E-mail ou senha inválidos." };
    }
    setState((current) => ({ ...current, currentUser: { name: user.name, email: user.email, role: user.role } }));
    return { ok: true, message: "Login realizado com sucesso." };
  }

  function register({ name, email, password }) {
    const normalizedEmail = email.trim().toLowerCase();
    if (!name.trim() || !normalizedEmail || !password.trim()) {
      return { ok: false, message: "Preencha nome, e-mail e senha." };
    }
    if (state.users.some((item) => item.email.toLowerCase() === normalizedEmail)) {
      return { ok: false, message: "Já existe um usuário com este e-mail." };
    }
    const newUser = { id: createId("user"), name: name.trim(), email: normalizedEmail, password, role: "Fisioterapeuta" };
    setState((current) => ({
      ...current,
      users: [...current.users, newUser],
      currentUser: { name: newUser.name, email: newUser.email, role: newUser.role },
    }));
    return { ok: true, message: "Cadastro criado com sucesso." };
  }

  function logout() {
    setState((current) => ({ ...current, currentUser: null }));
  }

  const isAuthed = Boolean(state.currentUser);

  return (
    <Routes>
      <Route path="/" element={<PublicHomePage clinics={state.clinics} />} />
      <Route path="/clínicas" element={<PublicHomePage clinics={state.clinics} />} />
      <Route path="/login" element={<AuthPage users={state.users} onLogin={login} onRegister={register} currentUser={state.currentUser} />} />
      <Route
        path="/dashboard"
        element={
          isAuthed ? (
            <Shell currentUser={state.currentUser} onLogout={logout}>
              <DashboardPage patients={state.patients} />
            </Shell>
          ) : (
            <PublicHomePage clinics={state.clinics} />
          )
        }
      />
      <Route
        path="/pacientes"
        element={
          isAuthed ? (
            <Shell currentUser={state.currentUser} onLogout={logout}>
              <PatientsPage patients={state.patients} />
            </Shell>
          ) : (
            <PublicHomePage clinics={state.clinics} />
          )
        }
      />
      <Route
        path="/exercicios"
        element={
          isAuthed ? (
            <Shell currentUser={state.currentUser} onLogout={logout}>
              <PlaceholderPage title="Exercícios" description="Biblioteca de exercícios e orientações." />
            </Shell>
          ) : (
            <PublicHomePage clinics={state.clinics} />
          )
        }
      />
      <Route
        path="/agendar"
        element={
          isAuthed ? (
            <Shell currentUser={state.currentUser} onLogout={logout}>
              <PlaceholderPage title="Agendar consulta" description="Fluxo de marcação de consultas." />
            </Shell>
          ) : (
            <PublicHomePage clinics={state.clinics} />
          )
        }
      />
      <Route
        path="/prescricao"
        element={
          isAuthed ? (
            <Shell currentUser={state.currentUser} onLogout={logout}>
              <PlaceholderPage title="Prescrição" description="Rotinas vinculadas ao paciente." />
            </Shell>
          ) : (
            <PublicHomePage clinics={state.clinics} />
          )
        }
      />
      <Route
        path="/evolucao"
        element={
          isAuthed ? (
            <Shell currentUser={state.currentUser} onLogout={logout}>
              <PlaceholderPage title="Evolução" description="Registro de dor e acompanhamento clínico." />
            </Shell>
          ) : (
            <PublicHomePage clinics={state.clinics} />
          )
        }
      />
      <Route path="*" element={<PublicHomePage clinics={state.clinics} />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
