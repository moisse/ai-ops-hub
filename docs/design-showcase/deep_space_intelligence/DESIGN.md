---
name: Deep Space Intelligence
colors:
  surface: '#0d1322'
  surface-dim: '#0d1322'
  surface-bright: '#33394a'
  surface-container-lowest: '#080e1d'
  surface-container-low: '#151b2b'
  surface-container: '#191f2f'
  surface-container-high: '#242a3a'
  surface-container-highest: '#2f3445'
  on-surface: '#dde2f8'
  on-surface-variant: '#bcc9cd'
  inverse-surface: '#dde2f8'
  inverse-on-surface: '#2a3040'
  outline: '#869397'
  outline-variant: '#3d494c'
  surface-tint: '#4cd7f6'
  primary: '#4cd7f6'
  on-primary: '#003640'
  primary-container: '#06b6d4'
  on-primary-container: '#00424f'
  inverse-primary: '#00687a'
  secondary: '#b4c5ff'
  on-secondary: '#002a78'
  secondary-container: '#0053db'
  on-secondary-container: '#cdd7ff'
  tertiary: '#4edea3'
  on-tertiary: '#003824'
  tertiary-container: '#1bbd85'
  on-tertiary-container: '#00452e'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#acedff'
  primary-fixed-dim: '#4cd7f6'
  on-primary-fixed: '#001f26'
  on-primary-fixed-variant: '#004e5c'
  secondary-fixed: '#dbe1ff'
  secondary-fixed-dim: '#b4c5ff'
  on-secondary-fixed: '#00174b'
  on-secondary-fixed-variant: '#003ea8'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#0d1322'
  on-background: '#dde2f8'
  surface-variant: '#2f3445'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  body-base:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  body-bold:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0em
  code-base:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0em
  label-caps:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.02em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  card-padding: 20px
  page-margin: 24px
  sidebar-width: 240px
  sidebar-collapsed: 64px
  topnav-height: 56px
  gutter: 16px
---

## Brand & Style

The design system embodies a high-performance, futuristic aesthetic tailored for mission-critical AI operations. It draws heavily from **Modern Corporate** and **Cyberpunk-influenced Minimalism**, prioritizing extreme legibility against a "Deep Space" backdrop.

The visual narrative is one of precision and technical authority. This is achieved through a "dark-first" interface where depth is communicated via layered slate surfaces rather than traditional shadows. The style utilizes ultra-sharp 1px structural borders and luminous cyan accents to guide the user's eye toward active intelligence streams. The interface should feel like a premium command center: cold, focused, and incredibly responsive.

## Colors

The palette is anchored in a monochromatic range of deep slates and blacks to reduce eye strain during long-duration monitoring. 

- **Primary & Secondary**: A high-energy gradient between Electric Cyan and Cobalt Blue is used exclusively for primary actions and active states.
- **Accents**: Neon functional colors (Emerald, Amber, Ruby) are reserved for status signaling and telemetry alerts.
- **Luminescence**: Use a specific Cyan glow (`rgba(6, 182, 212, 0.15)`) for "on" states, creating a sense of depth and activity within the dark environment.
- **Borders**: All structural separation must use a consistent 1px solid slate (`#334155`) to maintain a rigid, technical grid.

## Typography

This design system employs a dual-font strategy:
- **Inter** handles all standard UI roles, providing a clean, humanist-grotesque foundation that remains legible at small sizes. 
- **JetBrains Mono** is mandatory for all telemetry logs, API payloads, terminal windows, and technical identifiers (IDs, IP addresses).

**Scale & Behavior**:
Use `label-caps` for table headers and category tags to differentiate them from interactive labels. On mobile devices, `display-lg` should downscale to `headline-lg-mobile` to prevent excessive wrapping. Use tight tracking (negative letter spacing) for all headlines above 20px to enhance the "high-tech" density of the interface.

## Layout & Spacing

The layout is defined by a **Fixed-Fluid Hybrid** model. A persistent left navigation rail provides the structural anchor, while the main content area utilizes a fluid grid that adapts to the viewport.

- **Breakpoints**:
  - **Desktop**: Sidebar fixed at 240px. Main content has 24px margins.
  - **Tablet**: Sidebar collapses to 64px (icon-only).
  - **Mobile**: Sidebar becomes a bottom navigation or hidden drawer. Content margins reduce to 16px.

**Rhythm**:
The system uses a 4px base unit. All component spacing must be a multiple of this unit. Cards use a generous 20px internal padding to provide breathing room for the dense, high-contrast data they contain. Vertical rhythm is strictly enforced via the defined line heights in the typography section.

## Elevation & Depth

Depth is communicated through **Tonal Layering** and **Luminescence** rather than physical shadow metaphors.

1.  **Canvas (Level 0)**: `#0B1120` — The deepest layer, used for the main background.
2.  **Cards/Panels (Level 1)**: `#111827` — Primary containers for content.
3.  **Elevated/Overlay (Level 2)**: `#1E293B` — Used for inputs, dropdowns, and modals.
4.  **Interactive Glow**: High-priority active elements (like a selected node or a focused input) utilize an outer cyan glow: `0 0 20px rgba(6, 182, 212, 0.15)`.

Avoid traditional drop shadows. Use 1px borders in `#334155` to define the edges of all elevated surfaces.

## Shapes

The shape language is "Technical-Soft," using intentional variations in corner radius to establish hierarchy:
- **Small (6px)**: Used for action-oriented components like buttons, checkboxes, and input fields. This communicates precision.
- **Medium (10px)**: Used for standard cards and widgets.
- **Large (14px)**: Used for major panels, modals, and large system containers.

This tiered approach ensures that smaller interactive elements look distinct from the larger containers holding them. Never use fully pill-shaped elements unless specifically for status badges.

## Components

### Buttons
- **Primary**: Gradient `from-[#06B6D4] to-[#2563EB]`. White text. 6px radius. On hover, apply the cyan glow effect.
- **Ghost/Secondary**: Transparent background with a `1px solid #334155` border. On hover, the border and text transition to Cyan.

### Cards
- Background: `#111827`. Border: `1px solid #334155`. Padding: `20px`.
- Headers within cards should use `headline-md` and be separated by a slate divider.

### Inputs
- Background: `#1E293B`. Border: `1px solid #334155`. Text: `#F8FAFC`.
- Focus state: Border color changes to `#06B6D4` with a subtle `0 0 10px` glow.

### Status Indicators
- Use a small circular dot with a `pulse` animation for "Active" or "Online" states.
- **Online**: Emerald `#10B981`.
- **Degraded**: Amber `#F59E0B`.
- **Critical**: Ruby `#EF4444`.

### Navigation Sidebar
- Background: `#0F172A`.
- Active State: A `4px` solid Cyan left border indicator and a `10%` opacity Cyan background tint.
- Icons should be monochromatic `#94A3B8` and switch to `#06B6D4` when active.