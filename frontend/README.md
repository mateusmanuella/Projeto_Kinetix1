# KINETIX Frontend

Painel web do fisioterapeuta, construido com React e Vite.

## Rodar localmente

```bash
npm install
npm run dev
```

## Build de producao

```bash
npm run build
```

O build final fica em `dist/`.

## Deploy hoje

### Vercel

- Root directory: `frontend`
- Framework preset: `Vite`
- Build command: `npm run build`
- Output directory: `dist`

### Netlify

- Base directory: `frontend`
- Build command: `npm run build`
- Publish directory: `frontend/dist`

### Hospedagem estatica

Envie todo o conteudo da pasta `dist/`. O app usa `HashRouter`, entao as rotas funcionam sem configurar redirects no servidor.
