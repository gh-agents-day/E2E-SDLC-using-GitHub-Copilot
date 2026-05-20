# Exercise 07 — Implementation Prompt File

> ✅ **Merged into Exercise 04** — The Implementation Prompt File exercise is now Part B of [Exercise 04 — Plan Mode & Implementation Prompt](exercise-06-plan-mode.md).

Please continue to Exercise 04 for the full merged exercise, or jump directly to:

**Next**: [Exercise 05 — Build the API](exercise-08-api-local-agent.md)

---

## Step 1 — Understand the Prompt File Format

A `.prompt.md` file looks like this:

```markdown
---
name: Prompt Name
description: "When to use this prompt"
---

# Prompt content here

Instructions for Copilot...
```

The `description` field is what appears in the Copilot Chat command palette when you type `/`.

---

## Step 2 — Inspect the Pre-Built Prompt File

Open `.github/prompts/implementation-plan.prompt.md` and notice three things:
- The **YAML frontmatter** — `name` and `description` fields that register it in the command palette
- The **FRD reference rule** — every task must cite an `FR-ID` or `US-ID`
- The **Background Agent flag** — tasks are marked when they are long and self-contained

This is the generic version. Next, you will create a project-specific one.

---

## Step 3 — Create a Project-Specific Version

In Copilot Chat, send:

```
Create .github/prompts/itms-implementation-plan.prompt.md for ITMS. It must read #frd.md and #tsd.md, use [YOUR STACK], reference src/routes/, src/services/, src/repositories/, src/models/, include data/migration and OpenAPI tasks, flag Background Agent candidates, and output H2 phases plus a table: ID | Task | Effort | FRD Ref | Parallel? | Background Agent?
```

> Replace `[YOUR STACK]` with your choice from Exercise 01.

---

## Step 4 — Use and Compare

1. In Copilot Chat, type `/` — the command palette opens
2. Type `itms` — select **itms-implementation-plan** and press Enter
3. Compare the output with `.github/prompts/implementation-plan.prompt.md`:
   - The generic file works for any project
   - Your new file targets ITMS folder conventions, stack, and tooling specifically

> This is the difference between a shared team library and a project-specific standard.

---

**Next**: [Exercise 08 — Build APIs with Local Agent](exercise-08-api-local-agent.md)

> 🟡 **Optional stop available**: If your GitHub repository and Personal Access Token are configured, try [Exercise 14 — Create GitHub Issues via MCP](exercise-14-github-issues.md) before continuing to Exercise 08.
