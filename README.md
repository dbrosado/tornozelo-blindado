# Tornozelo Blindado (App)

App em Next.js para rotina de fortalecimento e progressão de tornozelo.

## Setup rápido

```bash
npm install
cp .env.example .env.local
npm run dev
```

Abra: http://localhost:3000

---

## Auth com Supabase

O projeto agora usa login/cadastro com Supabase.

Defina no `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### Fluxo
- `/` valida sessão e redireciona para:
  - `/app/today` (logado)
  - `/auth` (não logado)
- `/auth` permite:
  - criar conta (nome + email + senha)
  - login (email + senha)
- O nome do usuário é salvo no metadata (`full_name`) e usado para personalizar o app.

---

## Deploy (Vercel)

No painel da Vercel, configure as variáveis de ambiente:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Depois faça novo deploy.
