# Form Template Create — Task Checklist

## Phase 1: Project Scaffold
- [ ] Init Svelte 5 project (SvelteKit recommended) with TypeScript
- [ ] Install `jspdf`
- [ ] Set up basic client-side routes: `/`, `/ftc`, `/ftc/ot-form`

## Phase 2: Dashboard & Template List
- [ ] `Dashboard.svelte` — card grid, one card: "Form Template Create"
- [ ] `FormTemplateCreate.svelte` — template list, one entry: "Litecloud OT Form"

## Phase 3: OT Form — Header & Row Generation
- [ ] `OtFormHeader.svelte` — Employee Name, Position, Branch, Work Schedule, Number of Copies, Repetitive checkbox
- [ ] Form validation (required fields, copies ≥ 1)
- [ ] `OtFormRows.svelte` — generates N editable rows (Date, Time From, Time End, Reason for Overtime)
- [ ] Repetitive-time logic: shared Time From/End control when checkbox is on, per-row when off
- [ ] `$derived` total duration per row (minutes/hours), handle overnight (End < From) case
- [ ] `$effect` to resize rows array when Number of Copies changes, preserving existing row data

## Phase 4: PDF Export
- [ ] `OtFormPdfButton.svelte` — assembles jsPDF document per layout spec in PRD.md
- [ ] Render header block (Employee Name, Position, Branch, Work Schedule)
- [ ] Render per-entry block (Date, From/To line, Total, Reason)
- [ ] Render signature block (Requested by/Employee Signature, Verified by/Immediate Head, Approved by + Date Approved side by side)
- [ ] Trigger download as `OT_Form_<EmployeeName>.pdf`
- [ ] Validation gate: block PDF export until required row fields are filled

## Phase 5: Testing & Polish
- [ ] Vitest component tests: row count tracking, repetitive toggle behavior, duration calc (incl. overnight), validation gating
- [ ] Manual visual check: generated PDF matches layout spec field-by-field
- [ ] Responsive/basic styling pass
- [ ] ESLint clean
