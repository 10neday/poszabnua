---
name: premium-redesign
description: Redesign an existing website with a premium/luxury visual treatment while preserving structure and functionality
---

# Premium Redesign Skill

Redesign an existing HTML/CSS/JS website to look premium, luxurious, or formally elevated — without changing the site's structure or functionality.

## When to Use

User asks for any of these (Thai or English):
- "ปรับให้ดู premium / หรูหรา / ทางการ / พรีเมียม"
- "redesign to look premium / luxury / upscale"
- "make it look more expensive / elegant / refined"

## Prerequisites

1. **Read all existing files first** — HTML, CSS, JS. Understand the full structure before touching anything.
2. **Confirm with user** what "premium" means to them — show the current state, ask for reference if available.

## Design System (Proven Pattern)

These choices have been validated across 3+ real redesign sessions:

### Typography
- **Display/headings**: Serif font — use Google Fonts `Playfair Display` or `Instrument Serif`
- **Body text**: Clean sans-serif — `Plus Jakarta Sans`, `Inter`, or `DM Sans`
- Add both via `<link>` in `<head>`:
  ```html
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  ```

### Color Palette
- **Primary dark**: Deep navy `#0f172a` or charcoal `#1a1a2e` or dark green `#14532d`
- **Accent**: Gold/amber `#d4a853` or warm gold `#b8860b`
- **Surface**: Off-white `#faf9f6` or warm stone `#f5f0eb`
- **Text**: Near-black `#1e1e1e` for body, dark gold for highlights

### Visual Effects
- **Glass morphism**: `backdrop-filter: blur(12px); background: rgba(255,255,255,0.7); border: 1px solid rgba(255,255,255,0.18);`
- **Shadows**: Two-layer — subtle ambient `0 1px 3px rgba(0,0,0,0.06)` + larger `0 8px 30px rgba(0,0,0,0.08)`
- **Borders**: Thin, refined — `border: 1px solid rgba(0,0,0,0.06)` or gold-tinted `border-color: rgba(212,168,83,0.2)`
- **Gradient accents**: Subtle gold-to-transparent for section dividers, hover states

### Spacing & Layout
- Increase padding by 20-40% from current values
- Add generous whitespace between sections
- Max-width container: `max-w-7xl mx-auto`
- Rounded corners: `rounded-2xl` (16px) or `rounded-3xl` (24px) for cards

### Hover & Motion
- Smooth transitions: `transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);`
- Subtle scale on hover: `transform: translateY(-2px);` or `transform: scale(1.02);`
- Gold glow on focus: `box-shadow: 0 0 0 3px rgba(212,168,83,0.25);`

## Workflow

### Step 1: Discovery (Read-only)
```
1. Glob **/*.{html,css,js} in the project
2. Read all HTML files — identify page structure, sections, components
3. Read all CSS files — note existing styles, variables, patterns
4. Read JS files — note any dynamic classes or theme switching
5. Summarize current state to user before making changes
```

### Step 2: Design Direction Confirmation
- Show user what you found (current structure summary)
- Ask: "Want me to apply [design system above] or do you have a reference image?"
- If user provides a reference image, adapt the system to match it

### Step 3: Implementation
```
1. Create or update styles.css with the new design system
2. Update HTML <head> with Google Fonts links
3. Add/refine semantic classes in HTML (do NOT restructure)
4. Write responsive breakpoints (mobile-first for phones, desktop for large screens)
5. Add subtle animations (entrance, hover, scroll if applicable)
```

### Step 4: Visual Validation
- Start a local server: `npx serve -p 8080 -L` or similar
- Take screenshots at desktop (1440px) and mobile (375px) widths
- Verify: font rendering, color contrast, spacing, overflow issues
- Fix any mobile layout issues (keyboard overlap, text overflow)

### Step 5: Iterate with User
- Present screenshots and ask for feedback
- Common follow-ups: "change background image", "adjust font size", "add section X"
- Each iteration: read current state → make targeted edit → re-validate

## Files Typically Modified

- `styles.css` — main stylesheet (often rewritten entirely)
- `index.html` — font links, occasional class additions
- Other HTML pages — same pattern if multi-page site

## Files NOT Modified

- JavaScript logic (unless it affects rendering)
- Data/API configuration
- File structure or deployment setup

## Stopping Condition

User confirms the visual result looks good on both desktop and mobile. Summarize all changes made.

## Notes

- The user works primarily in Thai — confirm design choices in Thai when possible
- Most projects use Tailwind CSS via CDN — the premium redesign typically adds a custom `styles.css` alongside Tailwind for the luxury overrides
- Always keep the original CSS backed up (comment or version comment at top)
