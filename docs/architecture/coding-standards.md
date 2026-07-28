# Coding Standards

## General Conventions

- **Naming:**
  - Variables & Functions: `camelCase`
  - React Components & Files: `PascalCase.jsx`
  - Models & Classes: `PascalCase.js`
  - Routes & CSS Classes: `kebab-case`
  - Constants & Environment Variables: `UPPER_SNAKE_CASE`

---

## Code Quality Rules

1. **No Inline Business Logic:** Keep React components focused purely on rendering and UI state. Business logic belongs in services or custom hooks.
2. **Thin Controllers:** Express controllers must only unpack HTTP requests, call service methods, and format HTTP responses.
3. **Repository Pattern:** Direct database queries (Mongoose calls) belong exclusively inside repository modules.
4. **Single Responsibility Principle (SRP):** Every module, component, and utility function should do one thing well.
5. **No Code Duplication (DRY):** Extract repetitive UI logic into custom components and shared utility functions.
6. **Centralized State:** Shared application state must be stored in Redux slices rather than passed through excessive prop drilling.
7. **Explicit Error Handling:** Never swallow exceptions silently in try/catch blocks; log and format user-friendly errors.
