# FinanceTracker

FinanceTracker is a modern, responsive web application designed for personal finance management. It provides users with the tools to track income and expenses, set monthly budgets, and visualize financial trends through interactive data visualizations.

## Key Features

- **Interactive Dashboard:** Get an at-a-glance overview of your financial health with KPI cards and real-time charts.
- **Transaction Management:** Full CRUD (Create, Read, Update, Delete) operations for tracking income and expenses.
- **Smart Filtering:** Advanced search and filtering capabilities to find specific transactions quickly.
- **Budgeting Tools:** Set monthly spending limits and monitor your progress to stay on track.
- **Data Visualizations:** Beautiful Pie, Bar, and Line charts powered by Recharts for deep financial analytics.
- **Responsive Design:** Optimized for a seamless experience across mobile (bottom navigation) and desktop (sidebar) views.

## Technical Stack

- **Framework:** [React 19](https://react.dev/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Routing:** [React Router DOM v7](https://reactrouter.com/)
- **State Management:** React Context API
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [Framer Motion](https://www.framer.com/motion/)
- **Data Visualization:** [Recharts](https://recharts.org/)
- **Forms:** [React Hook Form](https://react-hook-form.com/) & [Yup](https://github.com/jquense/yup)
- **Utilities:** date-fns, uuid, axios, react-icons, react-toastify

## Project Structure

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

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (Latest LTS recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd finance-tracker
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Available Scripts

- **Start Development Server:**
  ```bash
  npm run dev
  ```
  The app will be available at `http://localhost:5173`.

- **Build for Production:**
  ```bash
  npm run build
  ```

- **Run Linter:**
  ```bash
  npm run lint
  ```

- **Preview Production Build:**
  ```bash
  npm run preview
  ```

## Development Conventions

- **Components:** Functional components with Hooks are preferred.
- **Styling:** Utility-first approach using Tailwind CSS.
- **Logic:** Complex business logic is encapsulated within custom hooks in `src/hooks/`.
- **Imports:** Local file imports include extensions (e.g., `.jsx`) for environment compatibility.
