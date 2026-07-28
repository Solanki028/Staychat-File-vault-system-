# AI Development Guide

## Overview

This guide outlines rules and best practices for AI coding assistants (Gemini, Claude, Antigravity) working on the Company Workspace codebase.

---

## Architectural Principles for AI Coding

1. **Company Workspace Priority:** Remember that every core feature belongs to a `Company` workspace. Never generate un-scoped standalone entities.
2. **Follow Layered Architecture:**
   - Frontend: `Component` ➔ `Custom Hook` ➔ `Redux Slice / API Client`
   - Backend: `Route` ➔ `Middleware` ➔ `Controller` ➔ `Service` ➔ `Repository` ➔ `Model`
3. **No Phantom Imports:** Verify all imported utilities, components, and libraries exist in the project before generating references.
4. **Preserve Code Structure:** Maintain existing docstrings, formatting standards, and export patterns.
5. **Empirical Verification:** Always run build and lint checks after generating code updates.

---

## AI Prompt Strategy

- Provide exact file locations and context when requesting changes.
- Reference relevant architectural specifications (`docs/architecture/...`) and functional specs (`docs/functional/...`).
- Require step-by-step reasoning for non-trivial refactoring tasks.
