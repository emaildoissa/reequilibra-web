---
name: Reequilibra CRM
description: CRM financeiro for lead and pipeline management
colors:
  brand-50: "#eef2ff"
  brand-100: "#e0e7ff"
  brand-200: "#c7d2fe"
  brand-300: "#a5b4fc"
  brand-400: "#6366f1"
  brand-500: "#635bff"
  brand-600: "#4f46e5"
  brand-700: "#4338ca"
  brand-800: "#3730a3"
  brand-900: "#312e81"
  brand-950: "#1e1b4b"
  surface-primary: "#09090b"
  surface-secondary: "#12121a"
  surface-tertiary: "#1c1c24"
  surface-card: "#18181b"
  surface-elevated: "#1f1f23"
  neutral-200: "#e4e4e7"
  neutral-300: "#d4d4d8"
  neutral-400: "#a1a1aa"
  neutral-500: "#71717a"
  neutral-600: "#52525b"
  neutral-700: "#3f3f46"
  neutral-800: "#27272a"
  border-default: "#2a2a35"
  border-light: "#3f3f46"
  accent-pink: "#f472b6"
  accent-violet: "#a78bfa"
  accent-sky: "#38bdf8"
  accent-emerald: "#34d399"
  accent-amber: "#fbbf24"
  accent-rose: "#fb7185"
typography:
  display:
    fontFamily: "Inter, system-ui, sans-serif"
    fontWeight: 700
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontWeight: 400
  mono:
    fontFamily: "JetBrains Mono, monospace"
rounded:
  sm: "0.5rem"
  md: "0.75rem"
  lg: "1rem"
  xl: "1.25rem"
  full: "9999px"
spacing:
  xs: "0.25rem"
  sm: "0.5rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"
---

# Design System: Reequilibra CRM

## 1. Overview

**Creative North Star: "The Midnight Studio"**

This is a workspace designed for focus, not for display. Like a recording studio at night — every surface is deliberately low-emission so the work itself takes center stage. The near-black background (`#09090b`) is not a default dark mode; it is a conscious choice to reduce visual noise and create a sense of depth and professionalism.

The system uses tonal layering rather than drop shadows to convey hierarchy — each surface tier (primary, secondary, tertiary, card) has its own distinct value in the near-black range. The violet brand accent (`#635bff`) is reserved for interactive elements and key data highlights, never applied as a decorative wash. It acts as a signal, not a wallpaper.

This system explicitly rejects: legacy CRM density, decorative glassmorphism, gradient text, and the "premium SaaS" glow-for-glow's-sake aesthetic.

### Key Characteristics:
- **Dark-by-design**, not dark-mode-toggle. The near-black body is the canvas.
- **Tonal depth through surface colors**, not box-shadows.
- **One voice accent** — violet is the primary signal color; other hues (pink, emerald, amber) earn their place for semantic status (lead temperature, stage indicators).
- **Tactile, confident interactions** — buttons scale and glow on hover; cards lift subtly with a border glow.
- **Mobile parity** — the layout and navigation are designed equally for desktop sidebar and mobile bottom-nav use.

## 2. Colors

### Primary (Brand)
- **Violet Signal** (`#635bff`): Primary interactive accent — buttons, active nav items, link highlights, focus rings. This is the one voice for user-initiated actions. Not for decorative backgrounds or text gradients.
- **Violet Deep** (`#4f46e5`): Hover state for primary actions. Gradient partner in button backgrounds.
- **Violet Light** (`#6366f1`): Active nav item text color. Subtle tint variant for the same hue family.

### Accent (Semantic)
- **Emerald** (`#34d399`): Closed-won / positive states. The "faturamento fechado" stage color. Success signals.
- **Amber** (`#fbbf24`): Warning / intermediate states. Proposal stage indicator.
- **Rose** (`#fb7185`): High urgency / hot lead signals (alongside red semantic family).
- **Red** (`#ef4444`): Hot lead classification, destructive actions, notification badges.
- **Orange** (`#f97316`): Warm lead classification.
- **Cyan** (`#06b6d4`): Cold lead classification.

### Surface (Tonal Layers)
- **Primary** (`#09090b`): Body background. The canvas.
- **Secondary** (`#12121a`): Sidebar, desktop header, mobile nav base.
- **Tertiary** (`#1c1c24`): Input backgrounds, list item hover, secondary containers.
- **Card** (`#18181b`): Card and container backgrounds.
- **Elevated** (`#1f1f23`): Elevated surfaces above cards.

### Neutral
- **Text Primary** (`#ffffff`): High-emphasis body text and headings on surface backgrounds.
- **Text Secondary** (`#d4d4d8` — neutral-300): Lower-emphasis text, secondary labels.
- **Text Muted** (`#71717a` — neutral-500): Placeholder text, metadata, timestamps, disabled states.
- **Border Default** (`#2a2a35`): Card borders, dividers, input strokes.
- **Border Light** (`#3f3f46`): Lighter border variant for hover or elevated states.

### The One Voice Rule
The violet brand accent appears on ≤10% of any given screen. Its rarity is the point — when violet appears, the user knows it is interactive or selected. Diluting it across backgrounds, decorative elements, and non-interactive surfaces undermines its signaling power.

## 3. Typography

**Display Font:** Inter (with system-ui fallback)
**Body Font:** Inter (with system-ui fallback)
**Mono Font:** JetBrains Mono (monospace fallback)

**Character:** A single-family system (Inter at 400/500/600/700) keeps the interface calm and predictable. Inter's moderate x-height and open apertures ensure readability at small sizes on dark backgrounds. There is no display face — the weight contrast (400 body, 600 subheadings, 700 headings) provides the hierarchy without a typeface change.

### Hierarchy
- **Display** (700, `clamp(1.5rem, 4vw, 2.5rem)`, 1.2): Page-level headings (Dashboard "Olá, Marcos"). One per page.
- **Headline** (600, `1.25rem`, 1.3): Section headings ("Leads Recentes", "Distribuição por Qualidade").
- **Title** (600, `1rem`, 1.4): Card titles, sidebar nav labels, list item names.
- **Body** (400, `0.875rem`, 1.5): Primary reading text. Max line length 65–75ch.
- **Small** (500, `0.75rem`, 1.4): Labels, metadata, timestamps, tab labels.
- **Caption/Mono** (400, `0.75rem`, 1.4): Numeric data, codes, IDs. JetBrains Mono.

### The Weight-Only Rule
Headings never use uppercase tracking or all-caps styling. Hierarchy is communicated through weight (600/700) and size alone. The one exception: stage labels in the funnel visualization and badge text, which use uppercase at 0.05em letter-spacing for brevity.

## 4. Elevation

Depth is conveyed through **surface color tiers**, not drop shadows. Each nesting level has a distinct background value: body (`#09090b`) → sidebar (`#12121a`) → card (`#18181b`) → elevated (`#1f1f23`). The card background is lighter than the body — the opposite of the physical "card casts a shadow" model — because in a dark UI the elevated surface should feel closer by being brighter, not darker.

### Shadow Vocabulary
- **Glow** (`0 0 40px rgba(99, 91, 255, 0.15)`): Reserved for the brand accent on primary buttons and selected interactive elements. Not a general elevation shadow.
- **Card** (`0 4px 24px rgba(0, 0, 0, 0.3)`): Soft ambient shadow behind cards. Optional — the color tier already provides separation.
- **Inner Glow** (`inset 0 1px 0 rgba(255, 255, 255, 0.05)`): Subtle top-edge highlight on surfaces, giving them a faint bevel without a visible shadow.

### The Layered-By-Color Rule
No element uses a box-shadow for depth unless it is interactive (hover) or decorative (brand glow). Static hierarchy is always resolved through surface color alone. If a card needs to feel closer, use `surface-elevated` — not a larger shadow.

## 5. Components

### Buttons
- **Shape:** Gently rounded corners (0.75rem / 12px radius).
- **Primary:** Violet gradient (`#635bff` → `#4f46e5`), white text, 600 weight. Padding: 0.625rem 1rem.
- **Hover:** Slight scale-up (1.02), brand glow appears. Transition: 0.2s ease.
- **Active:** Scale-down (0.98). Instant feedback.
- **Secondary:** Glass background (`rgba(255,255,255,0.08)`), neutral text (`#d4d4d8`), 1px border (`#2a2a35`). Hover raises opacity to 0.1 and border to `#52525b`.

### Cards
- **Shape:** Rounded corners (1.25rem / 20px radius).
- **Background:** `#18181b` (surface-card).
- **Border:** 1px solid `#2a2a35`.
- **Shadow:** Optional card shadow (0 4px 24px rgba(0,0,0,0.3)).
- **Hover:** Border shifts to violet-tinted (`rgba(99,91,255,0.3)`), brand glow appears, card lifts 2px.
- **Internal Padding:** 1.25rem.

### Inputs / Fields
- **Shape:** Rounded corners (0.75rem / 12px radius).
- **Background:** `#1c1c24` (surface-tertiary).
- **Border:** 1px solid `#2a2a35`.
- **Text:** White. Placeholder: `#71717a`.
- **Focus:** Border shifts to violet-tinted (`rgba(99,91,255,0.5)`), 3px violet glow ring appears. Transition: 0.2s ease.

### Badges
- **Shape:** Fully rounded (9999px pill).
- **Typography:** 0.75rem, 700 weight, uppercase, 0.05em letter-spacing.
- **Variants:**
  - **Hot** (`badge-hot`): Red-tinted background, red text.
  - **Warm** (`badge-warm`): Amber-tinted background, amber text.
  - **Cold** (`badge-cold`): Neutral-tinted background, neutral text.

### Avatars
- **Shape:** Fully rounded (circle).
- **Size:** 2.5rem (40px).
- **Typography:** 0.875rem, 700 weight, single initial.
- **Variants:** Same semantic colors as badges (hot/warm/cold) plus default for uncategorized.

### Navigation (Sidebar)
- **Shape:** Items use rounded-xl (0.75rem / 12px radius).
- **Default:** Neutral text (`#71717a`), no background.
- **Hover:** White text, `#2a2a35` background appears.
- **Active:** Violet text (`#6366f1`), violet-tinted background (`rgba(99,91,255,0.1)`).
- **Icons:** Material Symbols Outlined, 22px, same color treatment as text.
- **Logo:** Violet gradient icon box + gradient text wordmark.
- **Mobile:** Bottom navigation bar with 5 items, same active treatment as desktop.

### Glass Surfaces
- **Background:** `rgba(255, 255, 255, 0.05)`.
- **Border:** 1px solid `rgba(255, 255, 255, 0.1)`.
- **Backdrop Blur:** 12px.
- **Usage:** Mobile header, sidebar (with backdrop-blur over background blobs). Not applied to cards or static containers.

## 6. Do's and Don'ts

### Do:
- **Do** use the surface color tiers for depth — body → secondary → card → elevated. Let the value do the work.
- **Do** reserve violet (`#635bff`) for interactive elements and active states. It signals "you can click this."
- **Do** use semantic accent colors for their named purpose: emerald for closed-won, amber for proposals, red/orange/cyan for lead temperature.
- **Do** use Inter across all headings and body text. Hierarchy comes from weight (400 / 600 / 700), not from a second typeface.
- **Do** prefer the bottom navigation for mobile. The sidebar is a desktop-only pattern.
- **Do** keep card radii at 1.25rem (20px). Going beyond 1.5rem (24px) reads as over-rounded.
- **Do** animate interactions with 0.2s–0.3s ease-out transitions. Buttons scale, cards lift, borders shift.

### Don't:
- **Don't** apply the violet brand color as a decorative background wash, gradient text, or non-interactive surface tint. The One Voice Rule applies.
- **Don't** use box-shadows for static elevation. Surface color tiers are the depth system.
- **Don't** use glass-card patterns as a default container. Glass is for transient overlays (mobile header, sidebar) only.
- **Don't** add numbered section markers (01 / 02 / 03) as section scaffolding. The funnel stages are the only numbered sequence in the app.
- **Don't** use all-caps for body text or headings. Uppercase is reserved for short labels and badges (≤4 words).
- **Don't** use gradient text (`background-clip: text`). Use solid white text with weight contrast instead.
- **Don't** create dense, information-overloaded views. Progressive disclosure: surface the essential, reveal detail on demand.
- **Don't** hide content behind class-triggered reveal animations. Content must be visible at rest; animation enhances, it does not gate.
