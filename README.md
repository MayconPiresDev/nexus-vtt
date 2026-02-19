# 🎲 Nexus VTT - Sistema de RPG de Mesa Virtual

Bem-vindo ao **Nexus VTT**, uma plataforma completa para jogadores e mestres de RPG de mesa vivenciarem suas campanhas de forma interativa e em tempo real.

## 🚀 O Projeto

Este sistema foi projetado para ser um *Hub* completo de RPG. Ele permite desde a criação de contas e fichas de personagens (estilo D&D) até a gestão de mesas pelos Mestres, aprovação de jogadores e um ambiente virtual (Mesa) com mapas interativos e rolagem de dados sincronizada.

## ✨ Principais Funcionalidades

- **Gestão de Usuários:** Perfis para Jogadores e Mestres com níveis de experiência.
- **Criação de Personagens:** Fichas estruturadas com atributos e classes.
- **Hub de Campanhas:** Mestres podem criar mesas, definir requisitos e gerenciar solicitações de entrada.
- **Mesa Virtual em Tempo Real:** - Visualização de mapas.
  - Movimentação de tokens (personagens e monstros).
  - Rolagem de dados sincronizada via WebSockets.

## 🛠️ Tecnologias Utilizadas

O projeto adota uma arquitetura separada (Frontend e Backend) utilizando as seguintes tecnologias:

- **Frontend:** Next.js, React, Tailwind CSS (Hospedagem: Netlify)
- **Backend:** NestJS, Fastify, WebSockets/Socket.io (Hospedagem: Render)
- **Banco de Dados:** PostgreSQL via Prisma ORM (Nuvem: Neon/Supabase)
- **Linguagem:** TypeScript em todo o ecossistema.
- **Infraestrutura Local:** Docker para o banco de dados.

## ⚙️ Como rodar o projeto localmente (Linux/Mac/Windows)

### Pré-requisitos
- [Node.js](https://nodejs.org/) (versão 18+)
- [Docker](https://www.docker.com/) e Docker Compose

### Passos
1. Clone este repositório:
   ```bash
   git clone [https://github.com/SEU_USUARIO/nexus-vtt.git](https://github.com/SEU_USUARIO/nexus-vtt.git)
