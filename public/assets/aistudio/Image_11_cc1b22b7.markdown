---
name: Academic Editorial Modernism
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#45464d'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#4059aa'
  on-secondary: '#ffffff'
  secondary-container: '#8fa7fe'
  on-secondary-container: '#1d3989'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#00201d'
  on-tertiary-container: '#0c9488'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#dce1ff'
  secondary-fixed-dim: '#b6c4ff'
  on-secondary-fixed: '#00164e'
  on-secondary-fixed-variant: '#264191'
  tertiary-fixed: '#89f5e7'
  tertiary-fixed-dim: '#6bd8cb'
  on-tertiary-fixed: '#00201d'
  on-tertiary-fixed-variant: '#005049'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.015em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: '600'
    lineHeight: 38px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 30px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 30px
    letterSpacing: -0.003em
  body-md:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: '0'
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: '0'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.03em
  code-mono:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: '0'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system expresses rigorous scholarship, institutional integrity, and modern editorial authority. Designed for a multidisciplinary scientific publishing portal, it balances academic gravitas with the fluid efficiency of modern digital tools, deliberately departing from cluttered legacy portals and consumer startup gimmicks.

The design movement synthesizes **Minimalism** with **Modern Institutional Design**:
- High-density information architecture that retains clarity through white space and strict grid alignments.
- Subtle structural discipline reminiscent of archival journals (Elsevier, Nature, IEEE Xplore), modernized with crisp digital craftsmanship.
- Subdued surfaces that prioritize reading comprehension, abstract scanning, and metadata digestion.
- Visual authority conveyed through typographic precision, subdued lines, and contextual status markers rather than decorative assets.

## Colors

The palette establishes an authoritative, calm environment calibrated for long reading sessions and dense catalog scanning.

- **Primary Canvas & Surfaces**: Background surfaces range from Pure White (`#FFFFFF`) to Off-White Slate Canvas (`#F8FAFC`), supported by subtle surface dividers in Slate 200 (`#E2E8F0`).
- **Primary Ink (`#0F172A`)**: A deep slate navy providing authoritative contrast for primary headings, body copy, and primary action controls.
- **Academic Accent (`#1E3A8A`) & Digital Focus (`#0284C7`)**: Classic navy for institutional markers and metadata tags, balanced with high-clarity cerulean for interactive links, citations, and active states.
- **Editorial Sub-Accent (`#0D9488`)**: Deep teal reserved for disciplinary categorization, special collections, and metrics highlights.
- **Editorial Workflow Signals**:
  - Published / Accepted: Emerald Green (`#059669`) with subtle tint background (`#ECFDF5`).
  - Peer Review / Revision Required: Amber (`#D97706`) with warm tint background (`#FFFBEB`).
  - Declined / Withdrawn: Rose (`#E11D48`) with soft tint background (`#FFF1F2`).
  - Neutral Metadata / Drafts: Slate (`#64748B`) with neutral tint background (`#F1F5F9`).

## Typography

The typographic hierarchy combines **Plus Jakarta Sans** for structure and title display with **Inter** for sustained technical and abstract legibility.

- **Title Hierarchy**: Uses Plus Jakarta Sans with subtle negative tracking (-0.01em to -0.02em) to maintain crispness at scale.
- **Article Abstract & Body**: Inter set at generous line-heights (1.6x - 1.7x) ensures fatigue-free reading of dense scientific methodology, chemical notations, and quantitative data.
- **Metadata & Labels**: Inter Medium and Semi-bold in uppercase or title-case for DOI strings, ISSN references, ORCID badges, and review status labels.
- **Scientific Identifiers**: `code-mono` powered by JetBrains Mono handles DOIs, citation syntax, and mathematical code blocks with tabular figures.

## Layout & Spacing

The structural layout utilizes a strict 12-column grid system capped at a maximum reading and indexing width of 1280px (`max-w-7xl`), centered with symmetrical exterior gutters.

- **Desktop (1024px and above)**: 12-column layout. Standard article views dedicate 8 columns to the core manuscript / abstract feed, and 4 columns to metadata (author credentials, citation metrics, issue archives, and download actions).
- **Tablet (768px - 1023px)**: 8-column layout. Metadata collapses below the abstract or into a dedicated tabbed structure. Margins scale to 1.5rem (`24px`).
- **Mobile (Below 768px)**: Single-column linear flow. Spacers drop to compact values (`margin-mobile: 1rem`) to ensure maximum screen real estate for abstract previews and indexing filters.
- **Rhythm**: All paddings and vertical gaps follow an absolute 4px/8px incremental base, preventing irregular vertical jitter across dense manuscript indices.

## Elevation & Depth

Visual separation relies on **1px hairline borders** paired with **subtle, diffused neutral shadows**. The portal rejects loud layered drops in favor of quiet institutional composure:

- **Base Layer (Level 0)**: Page canvas set to `#F8FAFC`. No elevation or stroke.
- **Card & Container Layer (Level 1)**: Flat `#FFFFFF` surface bounded by a crisp 1px stroke of `#E2E8F0`. Shadow: `0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.02)`.
- **Interactive Hover & Dropdowns (Level 2)**: Elevated card state when hovering over manuscript listings. Shadow transitions to: `0 4px 6px -1px rgba(15, 23, 42, 0.06), 0 2px 4px -2px rgba(15, 23, 42, 0.03)`, with border shifting to `#CBD5E1`.
- **Modals & Filter Overlays (Level 3)**: Persistent navigation headers, citation generator modals, and floating PDF viewers use a deep soft diffusion: `0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.03)` with a neutral 20% slate backdrop overlay.

## Shapes

The design system standardizes on a **Soft (Level 1)** shape language to maintain a disciplined, document-centric aesthetic that feels contemporary without veering into overly playful geometry:

- **Base Radius (`0.25rem` / `4px`)**: Applied to inline status tags, metadata badges, input textboxes, button groups, and checkboxes.
- **Medium Radius (`0.5rem` / `8px`)**: Applied to standard content cards, article panels, navigation toolbars, search bars, and dropdown menus.
- **Large Radius (`0.75rem` / `12px`)**: Strictly reserved for macro containers, modal windows, and hero banner enclosures.
- **Pill Shape**: Prohibited except for circular author avatar indicators and count indicators.

## Components

### Buttons
- **Primary Action (Download PDF, Submit Manuscript)**: Solid `#0F172A` background, `#FFFFFF` text, `border: 1px solid transparent`, font-weight 500, height 40px, rounded-sm (`4px`). Hover state: `#1E293B`. Focus state: 2px offset ring in `#0284C7`.
- **Secondary Action (Cite, Share, Filter)**: White `#FFFFFF` background, `#0F172A` text, `border: 1px solid #CBD5E1`. Hover: `#F8FAFC` background with border `#94A3B8`.
- **Ghost Action (Text links, table expanders)**: Transparent background, `#1E3A8A` text. Hover: `#F1F5F9` background.

### Status Chips & Badges
- **Editorial State Badges**: 24px height, uppercase 11px font weight 600, tracking 0.03em, 4px rounded radius.
  - *Published*: Background `#ECFDF5`, text `#065F46`, border `1px solid #A7F3D0`.
  - *Under Review*: Background `#FFFBEB`, text `#92400E`, border `1px solid #FDE68A`.
  - *Revisions Required*: Background `#FEF3C7`, text `#B45309`, border `1px solid #FCD34D`.
  - *Declined*: Background `#FFF1F2`, text `#9F1239`, border `1px solid #FECDD3`.
- **Metadata Tags (Open Access, Peer Reviewed, DOI)**: Background `#F1F5F9`, text `#334155`, border `1px solid #E2E8F0`.

### Manuscript Cards
- Structured white surface with a continuous 1px `#E2E8F0` border.
- Layout flow:
  1. Top metadata row: Journal Volume / Issue / Date / Status Chip.
  2. Main manuscript title (Plus Jakarta Sans 18px Semi-bold) with hover transition to `#0284C7`.
  3. Author list with linked ORCID iconography.
  4. Truncated 2-line abstract preview (`body-md` in Slate 600).
  5. Footer row: DOI monospace link, download count, citation count metrics, and direct action triggers.

### Form Inputs & Search Fields
- 40px base height, `#FFFFFF` surface, `1px solid #CBD5E1` border, 4px border radius.
- Placeholder text in `#94A3B8`. Active focus ring: `ring-2 ring-[#0284C7]/20 border-[#0284C7]`.
- Specialized faceted search bars integrate inline dropdown selectors for multidisciplinary filtering (e.g., Computer Science, Medicine, Social Sciences).

### Citation & Metric Blocks
- Dedicated callout container with `#F8FAFC` background, left border 3px solid `#1E3A8A`.
- One-click export triggers formatted for APA, MLA, Chicago, and BibTeX standards with monospace previews.