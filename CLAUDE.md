# CLAUDE.md — Developer Guidelines & Standards

This document serves as the persistent memory and developer handbook for the **Biskra CS Student Helper** project. Follow these guidelines closely when maintaining or adding features to this codebase.

---

## 🛠️ Tech Stack & Architecture

- **Frontend Framework**: React 18 (Vite-based)
- **Routing**: React Router DOM v6
- **Styling**: Tailwind CSS v3 + CSS Variables & custom components (configured in `react-app/src/index.css`)
- **PWA & Caching**: Vite PWA Plugin (`vite-plugin-pwa`) with Workbox cache strategies
- **Icons**: `lucide-react`
- **Hosting / Deployments**: Vercel

---

## 🚀 Key Commands

Always run these commands from the `react-app` subdirectory:

*   **Start Local Development**:
    ```bash
    cd react-app && npm run dev
    ```
*   **Build for Production**:
    ```bash
    cd react-app && npm run build
    ```
*   **Preview Production Build**:
    ```bash
    cd react-app && npm run preview
    ```

---

## 📐 Academic Calculation Integrity (Students' Marks)

> [!IMPORTANT]
> **Zero-tolerance for calculation errors.** This app is actively used by CS students to calculate their official GPA and module credits. Any mistake directly impacts students' academic expectations.

### 1. GPA Calculation Formulas (`react-app/src/pages/Calculator.jsx`)
*   **Single-Grade Modules**: `exam`
*   **TP-Only Modules**: `exam * 0.6 + tp * 0.4`
*   **Modules with TP**: `exam * 0.6 + td * 0.2 + tp * 0.2`
*   **Standard Modules**: `exam * 0.6 + td * 0.4`
*   **Optional Modules**: Grades only contribute to the GPA if the module average is $\ge 10$. If below 10, the module grade is treated as $0$ and doesn't pull down the GPA.

### 2. Credit Compensation Rules
*   **Compensation Rule (LMD)**: If the final overall average of the semester is $\ge 10.00$, the student receives **all 30 credits** for that semester by compensation, regardless of any individual module failures.
*   **Individual Acquisition**: If the overall average is $< 10.00$, credits are earned only for modules where the individual module average is $\ge 10.00$.

---

## 🏷️ Revision & Release Management

> [!WARNING]
> **Strict version bumping rule.** Because this is a Progressive Web App (PWA) that caches resources aggressively on user devices, you MUST manually increment the revision and version before committing any changes to git.

Whenever files are modified:
1.  **Vite PWA Manifest Revision**: Increment the `revision` string in `react-app/vite.config.js` (e.g. `'v1.0.5'` $\rightarrow$ `'v1.0.6'`) to trigger immediate update propagation on clients.
2.  **Package Version**: Increment the patch version in `react-app/package.json` accordingly.

---

## 🎨 UI/UX & Design Conventions

The app utilizes a warm, grounded color palette paired with deep academic teals. It is optimized for premium, clean, high-performance interactions.

### 1. Color Palette (Tailwind theme)
*   **Surface**: `#faf9f7` (light mode body), `#0d0c0b` (dark mode body), `#1a1816` (dark card background)
*   **Primary (Teal)**: `#0d9488` (`primary-600`), `#0f766e` (`primary-700`)
*   **Accent (Amber)**: `#f59e0b` (`accent-500`)

### 2. Standard CSS Components (in `index.css`)
To keep the design professional, lightweight, and cohesive, always reuse established utility classes:
*   **Cards**: Use `.card` for standard containers, and `.card-interactive` for hoverable items.
*   **Buttons**: Use `.btn` combined with `.btn-primary`, `.btn-secondary`, or `.btn-ghost`.
*   **Inputs**: Use `.input` (fully styled with focus rings).
*   **Badges**: Use `.badge` combined with `.badge-primary`, `.badge-success`, `.badge-warning`, or `.badge-danger`.
*   **Navigation**: Use `.nav-item` and `.nav-item.active`.
*   **Typography**: Use `.section-label` for uppercase headers and metadata descriptions.

### 3. Responsive Styling
*   Ensure all components are designed mobile-first.
*   Grids, buttons, and inputs must dynamically resize to support portrait phone viewports.
*   Avoid overflow bugs by using flex wrapping and responsive truncations.
