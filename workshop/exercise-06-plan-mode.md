# Exercise 06 — Plan Mode: Generate Implementation Plan

**Duration**: 4 minutes  
**Copilot Feature**: Plan Mode (Copilot Edits)  
**Goal**: Use Plan Mode to let Copilot reason through the full implementation strategy before writing any code.

---

## Why This Matters

Without Plan Mode, Copilot jumps straight into writing code the moment you send a prompt. For a large feature that touches 10+ files, that is a gamble — you can't course-correct until after the fact.

**Plan Mode flips the order**: Copilot reads your documents, maps out every file and task it intends to touch, and shows you the plan first. You review it, adjust it if needed, and only then approve execution. Think of it as a "dry run" before any file is changed.

---

## Step 1 — Switch to Plan Mode

In Copilot Chat:
1. Click the **mode selector** at the bottom-left of the chat panel
2. Select **Plan** (this may appear as `Plan` or the pencil/plan icon)

> You should see a visual indicator that Plan mode is active.

---

## Step 2 — Send the Implementation Planning Prompt

This prompt instructs Copilot to read your FRD and TSD and produce a phased plan — **without creating any files yet**.

Copy and paste this prompt:

```
Read #frd.md and #tsd.md carefully.

Generate a complete, phased implementation plan for the Intelligent Task Management System (ITMS).

Structure the plan as:
- Phase 0: Project setup, folder structure, database migration tooling, CI skeleton

- Phase 1: Task Management (task creation, assignment, dependencies, status tracking)
- Phase 2: Task Reporting & Progress Summary (project progress, task filters, export)
- Phase 3: Notifications (email via SendGrid, Teams webhooks)
- Phase 4: Reporting (monthly reports, CSV/PDF export)
- Phase 5: Testing, security hardening, and documentation

For each phase, list tasks with:
- Task ID (T-001, T-002...)
- Title
- Effort (S/M/L where S=<4h, M=4-8h, L=8-16h)
- FRD reference (FR-ID or US-ID)
- Whether it can run in parallel or must be sequential
- Whether it's a good candidate for Background Agent (long, self-contained tasks)
```

---

## Step 3 — Review and Save the Plan

Copilot will display the full plan in chat before touching any file. Review it:

- [ ] All 5 phases are covered
- [ ] Phase 0 includes project scaffolding tasks
- [ ] Tasks reference FRD IDs
- [ ] Some tasks are flagged as Background Agent candidates
- [ ] Effort estimates seem reasonable (Phase 1 ≈ 3–5 days total)

Once satisfied, click **Open in Editor** in the Copilot response — this saves the plan as `doc/implementation-plan.md` in your workspace.

---

## Verify

Open `doc/implementation-plan.md` and confirm:

- [ ] All phases are present
- [ ] Tasks have IDs, effort estimates, and FRD references
- [ ] Background Agent candidates are flagged
- [ ] Total effort per phase is summarized

---

> This plan is the input for the next exercise — you will package it into a reusable prompt file your whole team can invoke.

**Next**: [Exercise 07 — Create Implementation Prompt File](exercise-07-implementation-prompt.md)
