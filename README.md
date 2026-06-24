# Grand Prix Pap — Portal Oficial

> Evento especial único no **Assetto Corsa** com o carro **Formula Grand Prix** — uma homenagem visual e sensorial ao clássico **Grand Prix 3**, com física acessível e pilotagem ágil.  
> Organizado pela comunidade **CAMPAP®**.

🌐 **[dotomasi.github.io/grand-prix-pap](https://dotomasi.github.io/grand-prix-pap)**  
📦 **[github.com/DoToMaSi/grand-prix-pap](https://github.com/DoToMaSi/grand-prix-pap)**

---

## Sobre o evento

O **Grand Prix Pap** é um evento one-off da CAMPAP: uma corrida em **Interlagos** com carro de F1 inspirado no GP3, setup fechado e regras simplificadas (10 min de qualify + 30 min de corrida).

Este repositório contém o **site oficial** do evento — página única com informações, downloads (carro e pista), regulamento e inscrição.

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Framework | Angular 20 (Standalone, Signals, Zoneless) |
| Estilos | Tailwind CSS v4 + DaisyUI v5 (`grandprixpap` theme) |
| Fonte | Michroma |
| Deploy | GitHub Pages via GitHub Actions |
| URL | `https://dotomasi.github.io/grand-prix-pap/` |

---

## Funcionalidades

- **Splash screen** com logo e botão Entrar
- **Hero animado** — backgrounds rotativos com pan, filtro CRT e crossfade
- **Carro & Pista** — grid de equipes F1 2002, preview de Interlagos, botão de download
- **Inscrição** — regulamento resumido com aceite obrigatório antes do botão de inscrição
- **Mini-player** de música (trilhas GP3) com shuffle e metadados ID3
- **SFX** de hover e clique nos botões
- **Navbar** com scroll suave para Downloads e Inscrição

---

## Desenvolvimento local

```bash
# Instalar dependências
npm ci

# Servidor de desenvolvimento (http://localhost:4200)
npm start

# Build de produção
npm run build:prod

# Testes unitários
npm test
```

---

## Deploy

O deploy é automático via **GitHub Actions** ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)) em todo push para a branch `master`:

1. `npm ci` — instala dependências
2. `npm run build:prod -- --base-href=/grand-prix-pap/` — build otimizado para GitHub Pages
3. `404.html` copiado de `index.html` (fallback SPA)
4. Publicação no ambiente `github-pages`

**Configuração única no GitHub:** Settings → Pages → Source: **GitHub Actions**.

---

## Estrutura do projeto

```
src/
├── app/
│   ├── core/config/       # Música, backgrounds, equipes, SFX
│   └── shared/
│       ├── components/    # Splash, Header, Hero, CarTrack, Signup, Footer, MiniPlayer
│       └── services/      # MusicPlayer, HeroBackground, Sfx, ButtonSfx
├── assets/
│   ├── car-previews/    # Previews das 11 equipes F1 2002
│   ├── fonts/           # Michroma
│   ├── images/          # Backgrounds do hero
│   ├── logos/           # GPPAP logo e ícone
│   ├── music/           # Trilhas do mini-player
│   ├── sfx/             # hover.wav, click.wav
│   └── track-preview/   # Interlagos preview + layout
└── index.html           # Meta tags SEO
public/
└── favicon.ico
```

---

## Repositório

| | |
|---|---|
| **GitHub** | [github.com/DoToMaSi/grand-prix-pap](https://github.com/DoToMaSi/grand-prix-pap) |
| **Issues** | [github.com/DoToMaSi/grand-prix-pap/issues](https://github.com/DoToMaSi/grand-prix-pap/issues) |
| **Site** | [dotomasi.github.io/grand-prix-pap](https://dotomasi.github.io/grand-prix-pap) |

---

## Autor

**Rockett Sally | [DoToMaSi](https://github.com/DoToMaSi)** — desenvolvido com ❤️ em Curitiba.

---

## Licença

Projeto privado / uso interno CAMPAP. Todos os direitos reservados.
