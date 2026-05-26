# 🚀 Painel Logístico de Viagens

Sistema web para gestão operacional de frota, desenvolvido para monitoramento de viagens em tempo real, controle de status de veículos/motoristas e auditoria de cancelamentos.

## 🛠 Tecnologias Utilizadas

* **Front-end:** React, TypeScript, Material UI (MUI).
* **Back-end:** C# (.NET) com Entity Framework.
* **Dados:** API RESTful e SQLite.

## 📋 Funcionalidades

- **Dashboard Operacional:** Visão centralizada das viagens em curso.
- **Filtragem Inteligente:** Filtro por status (Planejada, Em Rota, Concluída, Cancelada) e ordenação temporal.
- **Gestão de Viagens:** Interface para criação e conclusão de rotas.
- **Auditoria de Cancelamento:** Fluxo obrigatório de registro de motivo para cancelamento, garantindo rastreabilidade dos dados.

## ⚙️ Como rodar o projeto

### Pré-requisitos
- .NET 8.0+ SDK
- Node.js (v18+)

### Instalação e Execução

1. **Clone o repositório:**
   ```Bash
   git clone [link-do-seu-repo]
   cd nome-do-projeto
Configurar e executar o Back-end:

```Bash

```cd backend
```dotnet restore
```dotnet run
```
Configurar e executar o Front-end:

```Bash
```cd frontend```
```npm install```
```npm run dev```
```
💡 Observações
Este projeto foi construído focando em uma experiência de usuário (UX) intuitiva para operadores logísticos, utilizando Dark Mode para reduzir a fadiga visual e uma arquitetura separada entre front e back para facilitar a escalabilidade.
