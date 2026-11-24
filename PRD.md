# Form Template Create — Product Requirements Document

## Project Context
- **Full Project Name**: Form Template Create
- **Abbreviated Name / Path**: `ftc_v1`
- **Version**: 1
- **External API Integration**: None
- **Backend / Database**: **None.** This is a frontend-only, client-side tool. All data entry, calculation, and PDF generation happen in the browser; nothing is persisted to a server or database in v1. (If persistence, multi-user access, or saved templates are needed later, that would be a v2 addition — a Hono + MariaDB backend could be layered in at that point, but it is explicitly out of scope now.)
- **Tech Stack**: Svelte 5 (runes: `$state`, `$derived`, `$effect`), TypeScript, client-side PDF generation via **jsPDF** (chosen for lightweight, dependency-free client-side PDF drawing with precise control over text positioning — needed for the fixed form layout below).

> Note: The standard Hono/MariaDB/Swagger/Zod backend mandate does not apply to this project since there is no backend. This PRD follows the same structure as the standard template where relevant and omits backend-only sections (data model, API endpoints, Swagger files) since none exist.

---

## Problem Statement
Branch/HR staff currently fill out overtime (OT) request forms by hand or in loosely formatted documents. This is slow, error-prone (manual time-difference math, inconsistent formatting), and produces inconsistent paperwork across branches.

## Goal
Provide a simple, installable web tool where a user can:
1. Open the app and land on a dashboard.
2. Select the "Litecloud OT Form" template.
3. Fill in employee/header info once, specify how many OT slip copies are needed, optionally mark the time as repetitive across all copies.
4. Auto-generate N editable rows of OT entries.
5. Export the filled form as a print-ready, correctly formatted PDF matching the official layout.

## Expected End Result
A downloadable PDF per employee that matches the exact approved OT slip layout (header info, per-entry date/time/reason, computed hours, and signature blocks) — ready to print and physically sign.

## Data Points Captured
- Employee Name, Position, Branch, Work Schedule
- Number of copies (rows) to generate
- Per-row: Date, Time From, Time End, Reason for Overtime
- Computed per-row: Total minutes/hours between From and End
- Signature line placeholders: Employee (Requested by), Immediate Head (Verified by), Approved by + Date Approved

---

## Application Structure

### Dashboard (`/`)
- Landing route on app open.
- Displays one app card: **"Form Template Create"**.
- Clicking it opens the Form Template Create section, which currently contains exactly one template: **"Litecloud OT Form"**.

### Form Template Create → Litecloud OT Form (`/ftc/ot-form`)

**Step 1 — Header Form**
| Field | Type | Notes |
|---|---|---|
| Employee Name | text, required | |
| Position | text, required | |
| Branch | text, required | |
| Work Schedule | text, required | e.g. "8:00 AM - 5:00 PM" |
| Number of Copies | number, required | min 1, drives number of generated rows |
| Repetitive data for Time Start/End | checkbox | when checked, one shared Time From / Time End pair applies to all rows; when unchecked, each row has its own |

**Step 2 — Generate**
- Clicking **Generate** produces a list/table of N rows (N = Number of Copies).
- Each row is editable with:
  - Date (date picker)
  - Time From (time picker, AM/PM)
  - Time End (time picker, AM/PM)
  - Reason for Overtime (text)
- If the repetitive checkbox was checked: Time From / Time End render once (shared control) and apply to every row; rows still have their own Date and Reason for Overtime.
- If unchecked: Time From / Time End are per-row, independently editable.
- Total minutes/hours per row is derived reactively (`$derived`) from Time From/Time End — not manually entered.
- Changing Number of Copies after generation adjusts row count (add/remove rows, preserving already-entered data where index still applies).

**Step 3 — Generate PDF**
- A **Generate PDF** button compiles current header + row data into a PDF matching the exact layout specified below, and triggers a browser download.

---

## PDF Layout Specification

Rendered top to bottom, single column, one employee per PDF:

1. **Employee Name**
2. **Position** (directly below)
3. **Branch** (directly below)
4. **Work Schedule** (directly below)
5. For **each** generated row/entry, in order:
   - **Date**
   - Time line: `From: ___ AM/PM   To: ___ AM/PM` (values filled in, not blanks, once data is entered)
   - **Total: __ minutes / __ hours** — auto-calculated from From/To
   - **Reason for Overtime**
6. After all entries — signature block:
   - **Requested by:** ______________ (signature line) — label below: *Employee Signature*
   - **Verified by:** ______________ (signature line) — label below: *Immediate Head*
   - Two fields side by side:
     - **Approved by:** ______________ (signature line)
     - **Date Approved:** ______________ (date line)

### Time Calculation Rule
- Total = End − From, expressed in minutes, with an hours/minutes (e.g. "1 hr 30 min") display.
- If End time is earlier than From time (crosses midnight), add 24 hours before subtracting, so overnight OT still computes a positive duration.

---

## Frontend Requirements (Svelte 5)

- **Routing**: simple client-side routing (e.g. SvelteKit routes, or a minimal router) — `/` (Dashboard) → `/ftc` (Form Template Create app list) → `/ftc/ot-form` (Litecloud OT Form).
- **State**: `$state` for header form fields, number of copies, repetitive flag, and the rows array. `$derived` for per-row and per-form total duration calculations. `$effect` to sync row array length when Number of Copies changes.
- **Components**:
  - `Dashboard.svelte` — app card grid, currently one card.
  - `FormTemplateCreate.svelte` — template list, currently one template.
  - `OtFormHeader.svelte` — Step 1 fields.
  - `OtFormRows.svelte` — Step 2 generated row table, row add/edit.
  - `OtFormPdfButton.svelte` — triggers jsPDF generation using current state.
- **Validation**: required-field checks before allowing Generate (header fields filled, copies ≥ 1); required Date/Reason before allowing PDF export, with inline error messages — no backend validation needed since there's no backend.
- **PDF Generation**: `jsPDF` used directly in-browser; layout coordinates hardcoded to match the spec above; output downloaded as `OT_Form_<EmployeeName>.pdf`.

## Non-Functional
- No authentication (single-user, local/offline-friendly tool).
- No data persistence between sessions in v1 (page refresh clears form) — acceptable per scope; flaggable as a v2 "save as draft" feature if requested.
- Should work fully offline once loaded (no network calls required for core function).

## Testing Strategy
- Component tests (Vitest + @testing-library/svelte or similar) for:
  - Row count tracks Number of Copies.
  - Repetitive checkbox correctly shares/unshares Time From/End across rows.
  - Duration calculation, including overnight (End < From) case.
  - Validation blocks Generate PDF when required fields are missing.
- Manual visual check: generated PDF matches the layout spec field-by-field.

## Out of Scope (v1)
- Backend/API/database of any kind.
- Multi-user accounts, authentication, saved history of past OT forms.
- Additional form templates beyond "Litecloud OT Form" (architecture should allow adding more later under "Form Template Create", but only one ships now).
