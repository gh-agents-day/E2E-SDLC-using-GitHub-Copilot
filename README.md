# E2E SDLC with GitHub Copilot — Workshop

> **Audience**: Developers, Tech Leads, Architects  
> **Total Duration**: ~40 min mandatory + ~30 min optional + separate CLI/Cloud Agent tracks  
> **Pre-requisites**: VS Code with GitHub Copilot Chat extension, Node/Python/Java/.NET runtime, Git CLI, GitHub Copilot access

---

## What You Will Build

An **Intelligent Task Management System (ITMS)** — focused on two core endpoints and their UI:

| # | Feature | Endpoint |
|---|---------|----------|
| 1 | Create a task | `POST /api/v1/tasks` |
| 2 | List tasks with filters | `GET /api/v1/tasks` |

You also build the UI: a **Task List page** (browse and filter tasks) and a **Create Task page** (form to submit a new task).

> The full system requirement is in [`requirement.md`](requirement.md). The workshop focuses on these two features to keep the SDLC cycle complete, token-efficient, and achievable in a single session.

---

## Prerequisites

- [VS Code](https://code.visualstudio.com/download) with the GitHub Copilot Chat extension
- Node / Python / Java runtime / .NET SDK (depending on your language choice)
- GitHub Copilot access (VS Code extension signed in)
- [Git CLI](https://git-scm.com/install/)
- **For CLI Track only**: [Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/set-up-copilot-cli/install-copilot-cli)
- **For Cloud Agent Track only**: GitHub MCP + GitHub Personal Access Token (`repo`, `issues` scopes)
- [Mermaid Preview extension](https://marketplace.visualstudio.com/items?itemName=MermaidChart.vscode-mermaid-chart) for VS Code (recommended)

---

## Workshop Structure

The workshop has three tracks. Complete the **VS Code Mandatory Track** first, then pick any optional exercises or alternate tracks based on your time and interests.

---

### 🔵 VS Code — Mandatory Track (~40 minutes)

All exercises use VS Code + GitHub Copilot Chat. Complete them in order — each artifact feeds the next.

| # | Exercise | Copilot Feature | Duration |
|---|----------|----------------|----------|
| 01 | [Custom Instructions](workshop/exercise-01-custom-instructions.md) | Workspace Instructions (`copilot-instructions.md`) | 3 min |
| 02 | [Setup & Custom Agents](workshop/exercise-02-setup-agents.md) | Custom Agents + Agent Orchestration | 8 min |
| 03 | [SDLC Documentation — BRD + TSD + FRD](workshop/exercise-03-brd.md) | SDLC Docs Orchestrator | 5 min |
| 04 | [Plan Mode & Implementation Prompt](workshop/exercise-06-plan-mode.md) | Plan Mode + Prompt Files | 5 min |
| 05 | [Build the API](workshop/exercise-08-api-local-agent.md) | Local Agent + Skills | 15 min |
| 06 | [Build the UI](workshop/exercise-09-ui-design.md) | Local Agent — UI Scaffolding | 10 min |
| 07 | [Write Tests](workshop/exercise-11-testing.md) | Local Agent + Agent Orchestration | 5 min |
| 08 | [Build & Debug](workshop/exercise-13-build-debug.md) | Local Agent + Terminal | 5 min |

> **Time-saving tip**: Exercise 02 includes an **SDLC Docs Orchestrator** that chains BRD → TSD → FRD in one run. If you run it there, Exercise 03 is a quick verification — the orchestrator already created all three documents.

---

### 🟡 VS Code — Optional Track (~30 minutes — pick any, in any order)

Self-contained exercises. No mandatory exercise depends on them.

| # | Exercise | Copilot Feature | Duration | Best After |
|---|----------|----------------|----------|------------|
| 09 | [Context Map Skill](workshop/exercise-15-context-map.md) | Skills (`SKILL.md`) | 4 min | Ex 05 |
| 10 | [GitHub Issues via MCP](workshop/exercise-14-github-issues.md) | GitHub MCP + Prompt File | 5 min | Ex 04 |
| 11 | [Security Review](workshop/exercise-12-security.md) | Security Prompt File | 4 min | Ex 08 |
| 12 | [Database & SQL](workshop/exercise-16-database-sql.md) | Local Agent + Instructions | 5 min | Ex 09 |
| 13 | [IaC & CI/CD](workshop/exercise-17-iac-cicd.md) | DevOps Agent + Prompt File | 5 min | Ex 08 |

> **Optional deep dives** (individual SDLC agents):
> - [TSD Agent in Isolation](workshop/exercise-04-tsd.md)
> - [FRD Agent in Isolation](workshop/exercise-05-frd.md)

---

### 🟣 Alternate Tracks (Independent — same features, different tools)

These tracks implement the same ITMS features (POST + GET tasks, Task List + Create Task UI) using different Copilot surfaces. Complete the VS Code Mandatory Track first to understand the features, then try an alternate track.

| Track | Tool | Duration | Link |
|-------|------|----------|------|
| **CLI Track** | Copilot CLI (`/plan` + `/fleet`) | ~20 min | [cli-track.md](workshop/cli-track.md) |
| **Cloud Agent Track** | Copilot Coding Agent via GitHub Issues | ~25 min | [cloud-agent-track.md](workshop/cloud-agent-track.md) |

---

## Key GitHub Copilot Features Covered

| Feature | Description |
|---------|-------------|
| **Workspace Instructions** | Always-on coding standards in every Copilot conversation |
| **Custom Agents** | Scoped AI personas — BRD Author, TSD Author, FRD Author, Test Orchestrator |
| **Agent Orchestration** | Chains specialist agents in sequence (BRD → TSD → FRD) |
| **Plan Mode** | Pre-execution planning — see what Copilot will do before it acts |
| **Prompt Files** | Reusable, team-wide prompt templates (`.prompt.md`) |
| **Skills** | On-demand workflow bundles (`SKILL.md`) — build-api, context-map |
| **Local Agent** | Default interactive coding agent in VS Code |
| **Copilot CLI** | `/plan` and `/fleet` for terminal-native parallel implementation |
| **Copilot Coding Agent** | Async agent that opens PRs from GitHub Issues |
| **GitHub MCP** | Model Context Protocol server for GitHub project management |

---

## Getting Started

1. Clone this repository and open it in VS Code
2. Install the **GitHub Copilot** and **GitHub Copilot Chat** extensions and sign in
3. Open the Copilot Chat panel (`Ctrl+Alt+I`)
4. Start with [Exercise 01 — Custom Instructions](workshop/exercise-01-custom-instructions.md)

---

> **Instructor Note**: Exercises are designed so attendees copy **prompts**, not code. Every piece of code, document, and configuration is generated by Copilot. The workshop teaches how to direct Copilot effectively through each SDLC phase.
