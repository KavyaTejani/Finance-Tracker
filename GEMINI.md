# GEMINI.md - FinanceTracker Project Context

This file provides the necessary technical context and instructions for AI agents working on the **FinanceTracker** project.

## 1. Project Overview
**FinanceTracker** is a modern, responsive web application designed for personal finance management. It allows users to track income, expenses, set budgets, and visualize financial trends through interactive charts.

### Key Features
- **Dashboard:** At-a-glance overview of financial health with KPI cards and charts.
- **Transaction Management:** Full CRUD operations for income and expenses with filtering and search capabilities.
- **Budgeting:** tools to set and monitor monthly spending limits.
- **Analytics:** Data-driven visualizations (Pie, Bar, Line charts) using Recharts.
- **Responsive Design:** Optimized for both mobile (bottom navigation) and desktop (sidebar) views.

## 2. Technical Stack
- **Framework:** React 19
- **Build Tool:** Vite
- **Routing:** React Router DOM v7
- **State Management:** React Context API (`FinanceContext`)
- **Styling:** Tailwind CSS (Custom Theme) & CSS Variables
- **Animations:** Framer Motion
- **Data Visualization:** Recharts
- **Forms:** React Hook Form & Yup
- **Utilities:** date-fns, uuid, axios, react-icons, react-toastify

## 3. Project Structure
The codebase follows a modular React architecture:
```text
src/
├── assets/      # Static assets (images, icons)
├── components/  # Reusable UI components (Cards, Nav, Charts)
├── constants/   # Configuration constants (Categories, Theme colors)
├── context/     # Global state management (FinanceContext)
├── hooks/       # Custom React hooks (useTransactions, useBudget)
├── pages/       # High-level page components (Dashboard, Analytics, etc.)
├── services/    # API and external data services
├── utils/       # Helper functions (Formatting, Calculations)
├── App.jsx      # Root component & Routing configuration
└── main.jsx     # Application entry point
```

## 4. Building and Running
The following commands are defined in `package.json`:

- **Development:** `npm run dev` (Starts Vite server at `http://localhost:5173`)
- **Build:** `npm run build` (Compiles optimized assets to `dist/`)
- **Linting:** `npm run lint` (Runs ESLint check)
- **Preview:** `npm run preview` (Serves the production build locally)

## 5. Development Conventions
### Code Style
- **Functional Components:** Always use functional components with hooks.
- **Explicit Imports:** Local file imports MUST include extensions (e.g., `import MyComponent from "./MyComponent.jsx"`) to ensure compatibility with the build environment.
- **Naming:** PascalCase for components and folders, camelCase for variables and hooks.

### Styling
- **Utility-First:** Prefer Tailwind CSS utility classes.
- **Custom Theme:** Use the extended Tailwind theme colors (e.g., `bg-bg-primary`, `text-accent-red`) defined in `tailwind.config.js`.
- **Responsive Breakpoints:** The desktop layout triggers at `768px` (`md:` breakpoint).

### State & Logic
- **Global State:** Access transactions and budget data via the `useFinance()` hook.
- **Encapsulation:** Keep complex logic inside custom hooks (`src/hooks/`) or utility functions (`src/utils/`).
