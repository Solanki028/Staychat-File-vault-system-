# Frontend Architecture

## Technology Stack

- **Framework:** React 19
- **Build Tool:** Vite
- **Routing:** React Router (v6+)
- **State Management:** Redux Toolkit
- **HTTP Client:** Axios
- **Styling:** Tailwind CSS
- **Form Handling:** React Hook Form
- **Schema Validation:** Zod
- **Icons:** Lucide Icons

---

## Directory Layout (`frontend/src/`)

```
src/
├── api/          # Axios instance and API call definitions
├── assets/       # Static media, icons, and image assets
├── components/   # Atomic & reusable UI components (Buttons, Cards, Modals)
├── constants/    # App-wide constants, menu configs, error codes
├── contexts/     # React Context providers (Theme, Global UI)
├── hooks/        # Custom reusable React hooks
├── layouts/      # Layout containers (AuthLayout, DashboardLayout, WorkspaceLayout)
├── modules/      # Feature modules (Documents, Employees, Vehicles, Invoices)
├── pages/        # Page-level route views
├── redux/        # Redux Toolkit store, slices, and selectors
├── routes/       # Route definitions and Guarded/Protected routes
├── services/     # Client-side business logic and helper services
├── styles/       # Global CSS and custom Tailwind directives
├── types/        # TypeScript interfaces and type declarations (Future)
└── utils/        # Helper utility functions (formatting, validation, storage)
```

---

## UI Architecture & Components

### Layout Containers
- **AuthLayout:** Full-height centered layout for Login/Register.
- **DashboardLayout:** Header navbar, side drawer, main content area for main landing pages.
- **WorkspaceLayout:** Persistent company-level sidebar navigation for active company workspace context.

### Reusable UI Component Library
- Buttons, Cards, Inputs, Selects, Checkboxes
- Data Tables with sorting & pagination
- Modals, Dialogs, Drawer Overlays
- File Uploaders (Drag & Drop) & File Viewers (PDF, Image, Document)
- Breadcrumbs, Search Bars, Filter Chips, Pagination Controls

---

## State Management Strategy

Centralized state management powered by **Redux Toolkit**.

### Slices
- `auth`: Active user session, JWT token, user roles
- `companies`: Active company list, selected company context
- `documents`: Document list, active preview state, upload queue
- `employees`: Employee directory state & filters
- `partners`: Partner ownership data
- `vehicles`: Vehicle registry & expiry flags
- `invoices`: Invoice draft & preview state
- `notifications`: Active toast alerts & system notifications
- `ui`: Modals state, sidebar collapse, active theme

*(Future upgrade: Integration of RTK Query for automated server state caching and revalidation).*

---

## Responsive Design Strategy

- **Approach:** Desktop-First with full responsive adaptability
- **Breakpoint Targets:** Desktop (1280px+), Laptop (1024px), Tablet (768px), Mobile (down to 320px)
- **Browser Compatibility:** Chrome, Edge, Firefox, Safari
