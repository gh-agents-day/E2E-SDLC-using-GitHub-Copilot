# Exercise 02 — Setup & Custom Agents + Agent Orchestration

**Duration**: 8 minutes  
**Copilot Feature**: Custom Agents (`.agent.md`) + Agent Orchestration  
**Goal**: Understand custom agent creation, then build an orchestrator agent that chains BRD → TSD → FRD generation in a single run — completing Exercises 03, 04, and 05 automatically.

> **Your language is already set**: The `copilot-instructions.md` you created in Exercise 01 is active in this session and every session that follows. The TSD agent will automatically design the architecture using your chosen language and framework — no extra prompting needed.

---

## Background

A **Custom Agent** in GitHub Copilot is a specialized AI persona saved as a `.agent.md` file. When you start a Copilot Chat session using a custom agent, Copilot takes on that agent's role, follows its instructions, uses only the tools you allow it to use, and focuses only on the domain you define.

**Agent Orchestration** takes this further: one agent can invoke other specialist agents in sequence, passing the output of each as context to the next. This is how you build automated, multi-step workflows with Copilot.

The three specialist agents are pre-built in this repo. You will explore one, then create an orchestrator that chains all three:
| Agent | Role | Output |
|-------|------|--------|
| `brd` | Business Analyst | `doc/brd.md` |
| `tsd` | Software Architect | `doc/tsd.md` |
| `frd` | Functional Analyst | `doc/frd.md` |
| `sdlc-docs-orchestrator` | Orchestrator | Runs all three agents in sequence |

---

## Step 1 — Review the Starting Requirement

Open [`requirement.md`](../requirement.md) and read the project requirement. This is the **single source of truth** for everything you build in this workshop.

> Take 1 minute to read it. Notice the stakeholders, task types, and technical constraints. These will all show up in the documents Copilot generates.

---

## Step 2 — Explore the Pre-Built Agents

The three specialist agents (`brd`, `tsd`, `frd`) are already created in `.github/agents/`. Open one to understand the agent file structure before creating your own:

1. In VS Code Explorer, navigate to `.github/agents/`
2. Open `brd.agent.md`
3. Review the YAML frontmatter — notice the `name`, `description`, and `tools` fields
4. Read the system prompt — notice how it defines a role, a process, an output format, and constraints

```
.github/
└── agents/
    ├── brd.agent.md              ← Senior Business Analyst persona
    ├── tsd.agent.md              ← Senior Software Architect persona
    ├── frd.agent.md              ← Senior Functional Analyst persona
    └── sdlc-docs-orchestrator.agent.md   ← (you will create this next)
```

> **Tip**: The `name` field appears in the agent selector dropdown. The `description` helps Copilot auto-suggest the right agent. The system prompt is what makes it a specialist — role, process, output rules, and constraints all live here.

---

## Step 3 — Create the SDLC Docs Orchestrator Agent

Now you will create a new agent using the same approach — this time an **orchestrator** that calls all three specialist agents in sequence.

1. Open GitHub Copilot Chat in Visual Studio Code.
2. From the agents dropdown at the bottom of the chat view, click **Configure Custom Agents...**, then click **Create new custom agent**.
3. Choose **Workspace** as the location (creates the agent in `.github/agents/`)
4. Enter the file name: `sdlc-docs-orchestrator`
5. Replace the generated content with the agent definition below:

```markdown
---
name: SDLC Docs Orchestrator
description: "Generate BRD, TSD, and FRD scoped to POST /api/v1/tasks and GET /api/v1/tasks only."
tools: [read, agent]
---

Delegate only. Do not write documents yourself. Scope: **POST /api/v1/tasks (create task) and GET /api/v1/tasks (list tasks) only.**

1. Invoke **BRD Author** → `doc/brd.md` — scope to create-task and list-tasks only
2. Invoke **TSD Author** → `doc/tsd.md` — scope to create-task and list-tasks only
3. Invoke **FRD Author** → `doc/frd.md` — scope to create-task and list-tasks only

Wait for each file before invoking the next agent. Pass the scope constraint to each agent when invoking.

**Token rules (follow strictly):**
- Invocation prompt to each agent: scope constraint only — do NOT re-describe the agent's format, sections, or stack; the agent's own instructions already define those.
- After each agent completes, reply with one line only: `✅ [AgentName] done → [filepath]`. Do not summarise the document contents.
```

> **Tip**: Notice the pattern — `name`, `description`, `tools`, then a structured system prompt with Role, Process, and Constraints sections. This is the same pattern as the pre-built agents you explored in Step 2. The key difference: the orchestrator's system prompt delegates work to other agents instead of doing it directly.

---

## Step 4 — Run the Orchestrator

1. In Copilot Chat, click the **agent selector** and choose **SDLC Docs Orchestrator**
2. Paste the following prompt:

```
Generate BRD → TSD → FRD.
```

3. Review the plan Copilot shows before approving — confirm it shows three sequential steps (BRD → TSD → FRD)
4. Click **Continue** to start the orchestration

> **Tip**: Notice how the orchestrator delegates to each specialist agent in order. BRD Author writes `doc/brd.md`, TSD Author reads it and writes `doc/tsd.md`, FRD Author reads both and writes `doc/frd.md`. Each agent's output feeds the next.

---

## Verify

Once complete, confirm all three documents were created:

- [ ] `doc/brd.md` exists and contains BR-F01 (create task) and BR-F02 (list tasks)
- [ ] `doc/tsd.md` exists with Mermaid architecture diagram and only 2 REST endpoints
- [ ] `doc/frd.md` exists with UC-001 (Create Task) and UC-002 (List Tasks) with Gherkin criteria

In VS Code, open the Copilot Chat agent selector — you should see **BRD Author**, **TSD Author**, **FRD Author**, and **SDLC Docs Orchestrator** all listed.

---

## Key Takeaway

> Custom agents encode domain expertise once and reuse it across projects. **Agent orchestration** chains specialists into automated pipelines — the orchestrator ensures BRD → TSD → FRD runs in the correct dependency order without you switching agents manually.

---

**Next for the mandatory track**: [Exercise 06 — Plan Mode & Implementation Prompt](exercise-06-plan-mode.md)

> The orchestrator already generated `doc/brd.md`, `doc/tsd.md`, and `doc/frd.md`, so the mandatory track continues directly to Plan Mode.
>
> **Optional individual-agent path**: If you want to understand how each specialist agent works independently, continue with [Exercise 03 — Explore the BRD Agent in Isolation](exercise-03-brd.md), then Exercise 04 (TSD) and Exercise 05 (FRD), before returning to Exercise 06.
