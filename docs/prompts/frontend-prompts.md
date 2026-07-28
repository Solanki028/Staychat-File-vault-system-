# Frontend Development Prompts

## Template 1: Creating a New Reusable UI Component

```markdown
Role: Senior Frontend Developer
Task: Create a reusable UI component [ComponentName] in `src/components/ui/` using React 19 and Tailwind CSS.
Requirements:
1. Support standard props (children, className, disabled, variant, size).
2. Follow modern design aesthetics (glassmorphism/subtle borders, smooth transitions).
3. Ensure accessibility (aria attributes, focus ring styling).
4. Include prop validation / default values.
```

---

## Template 2: Building a Feature Module Component

```markdown
Role: Senior React Developer
Task: Implement the UI view for [FeatureName] inside `src/modules/[FeatureName]/`.
Requirements:
1. Connect state to Redux Toolkit slice (`src/redux/slices/[FeatureName]Slice.js`).
2. Implement form validation using React Hook Form + Zod.
3. Include loading states (skeletons/spinners), error toast alerts, and empty states.
4. Keep the component clean: move complex async logic to custom hooks or Redux thunks.
```
