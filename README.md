# 🚀 Painel Logístico de Viagens — Central Operacional & Gestão de Frota

Este projeto é um dashboard operacional de nível corporativo desenvolvido para atuar como uma central inteligente de monitoramento logístico. O sistema foi projetado para gerenciar viagens em tempo real, acompanhar o status operacional de veículos e motoristas, além de garantir auditoria completa em processos críticos de cancelamento de rotas.

---

### 📊 Stack Tecnológica & Status da Aplicação

![Status da Aplicação](https://img.shields.io/badge/Status-Em_Opera%C3%A7%C3%A3o-32D74B?style=for-the-badge)
![.NET 8](https://img.shields.io/badge/.NET-8.0-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)
![React 18](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Material UI](https://img.shields.io/badge/Material_UI-MUI-007FFF?style=for-the-badge&logo=mui&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)

---

## 💡 Arquitetura & Conceitos de Engenharia

O sistema foi arquitetado seguindo princípios modernos de separação de responsabilidades, escalabilidade e experiência operacional, visando atender cenários reais de gestão logística.

- **Arquitetura Separada (Front-end & Back-end):** A aplicação utiliza uma estrutura desacoplada entre interface e API, permitindo escalabilidade independente entre as camadas e facilitando futuras integrações corporativas.
- **Consumo de API RESTful:** Toda comunicação entre cliente e servidor é realizada através de endpoints REST, garantindo padronização e interoperabilidade.
- **Tipagem Estrita com TypeScript:** A camada front-end utiliza contratos fortemente tipados para reduzir falhas em tempo de execução e melhorar a manutenção do código.
- **Persistência Leve com SQLite:** O banco SQLite foi adotado para simplificar o desenvolvimento local sem comprometer a confiabilidade da aplicação.
- **Dark Mode Operacional:** Toda a experiência visual foi construída em modo escuro para reduzir fadiga visual em operadores que utilizam o sistema continuamente.

---

## 📋 Funcionalidades Principais

### 📊 Dashboard Operacional
Visualização centralizada das viagens em andamento, permitindo acompanhamento rápido da operação logística.

### 🔍 Filtragem Inteligente
Sistema de filtragem por status operacional:
- Planejada
- Em Rota
- Concluída
- Cancelada

Além disso, a interface permite ordenação temporal dinâmica das viagens.

### 🚛 Gestão de Viagens
Fluxo completo para:
- Criação de viagens
- Atualização de status
- Conclusão operacional de rotas

### 🛡 Auditoria de Cancelamentos
Toda viagem cancelada exige obrigatoriamente:
- Registro de motivo
- Validação do operador
- Persistência histórica para rastreabilidade

---

## 📂 Estrutura do Projeto

```text
painel-logistico/
├── backend/                     # API REST (.NET + Entity Framework)
│   ├── Controllers/             # Endpoints da aplicação
│   ├── Models/                  # Entidades e contratos
│   ├── Data/                    # Contexto do banco SQLite
│   └── Program.cs               # Configuração principal da API
│
├── frontend/                    # Interface Web React
│   ├── src/
│   │   ├── pages/               # Páginas principais do sistema
│   │   ├── components/          # Componentes reutilizáveis
│   │   ├── services/            # Comunicação com API
│   │   └── types/               # Interfaces TypeScript
│   │
│   ├── package.json             # Dependências Node.js
│   └── vite.config.ts           # Configuração Vite
│
└── README.md                    # Documentação do projeto
```

---

## 🚀 Guia de Inicialização

<details>

<summary><b>💻 Clique aqui para visualizar as instruções completas</b></summary>

---

## 📋 Pré-requisitos

Antes de iniciar, certifique-se de possuir instalado:

- .NET SDK 8.0+
- Node.js v18+
- NPM
- Git

---

## ⚙️ Passo 1 — Clonar o Repositório

```bash
git clone [link-do-seu-repo]
cd nome-do-projeto
```

---

## 🔧 Passo 2 — Inicializar o Back-end

Abra o terminal na pasta do servidor:

```bash
cd backend
dotnet run
```

A API será iniciada localmente através do endereço:

👉 `http://localhost:5000`

---

## ⚡ Passo 3 — Inicializar o Front-end

Abra um novo terminal paralelo:

```bash
cd frontend
npm install
npm run dev
```

A interface estará disponível em:

👉 `http://localhost:5173`

---

</details>

---

# 🎨 Experiência Visual & Interface

- **Design Responsivo:** Interface otimizada para diferentes tamanhos de tela.
- **Dark Mode Nativo:** Redução de fadiga visual para uso prolongado em ambientes operacionais.
- **Componentização com Material UI:** Padronização visual moderna utilizando o ecossistema MUI.
- **Fluxo Intuitivo:** Navegação simplificada focada em produtividade operacional.
- **Feedback Visual de Status:** Indicadores visuais dinâmicos para identificação rápida da situação de cada viagem.

---

# 📈 Objetivos do Projeto

Este sistema foi desenvolvido com foco em:
- Organização operacional de frotas
- Monitoramento eficiente de viagens
- Redução de falhas operacionais
- Rastreabilidade de eventos críticos
- Facilidade de manutenção e expansão futura

---

# 🧠 Tecnologias Utilizadas

| Camada | Tecnologias |
| :--- | :--- |
| Front-end | React • TypeScript • Material UI |
| Back-end | C# • .NET 8 • Entity Framework |
| Banco de Dados | SQLite |
| Comunicação | API RESTful |
| Build Tool | Vite |

---

# 📌 Observações Técnicas

O projeto segue uma arquitetura moderna baseada em separação entre cliente e servidor, permitindo futuras implementações como:

- Autenticação JWT
- Integração com GPS em tempo real
- WebSockets para atualização instantânea
- Controle avançado de permissões
- Relatórios operacionais
- Integração com sistemas ERP

---

# 👨‍💻 Autor

Desenvolvido com foco em engenharia de software, experiência operacional e escalabilidade de sistemas logísticos.
