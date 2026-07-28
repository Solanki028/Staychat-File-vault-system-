# CLAUDE.md

## Startup Instructions

Before responding to any development request, first load the project context from the `/docs` directory.

The project documentation is the authoritative source for:

- Product requirements
- Functional specifications
- System architecture
- Database design
- API specifications
- Engineering standards
- Development roadmap

Do not make assumptions if the answer already exists in the documentation.

## Development Principles

- Follow the documented architecture.
- Reuse existing code whenever possible.
- Do not duplicate logic.
- Keep controllers thin.
- Keep business logic inside services.
- Keep database logic inside repositories.
- Build modular and reusable components.
- Prioritize security, maintainability, scalability, and performance.

## Before Every Task

1. Understand the requested feature.
2. Read the relevant documentation.
3. Analyze the existing implementation.
4. Reuse existing architecture.
5. Explain the implementation plan before making major structural changes.
6. Modify only the files required for the task.

Never guess. Never over-engineer. Never ignore the project documentation.