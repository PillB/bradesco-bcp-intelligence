# Ursa Coffee Dossier — Manual Interaction Specifications

## Testing Protocol
All interactions use ONLY:
- Mouse movement, clicks, double-clicks, hover
- Scrolling
- Keyboard typing, Tab/Shift+Tab, Enter, Space, Escape, arrow keys
- Touch/mobile pointer emulation

NO page.evaluate, injected JS, direct React state manipulation, artificial DOM events,
localStorage mutation, direct API requests, programmatic form submission, hidden clicks,
forced clicks, direct URL changes during journeys, CSS/DOM modifications.

## Test Entry Point
- URL: https://pillb.github.io/AIMarket-Design-Consulting-Reports/
- All subsequent navigation via visible controls only

## Route Inventory (25 routes)
1. Dashboard (#/)  2. Brand Audit (#/brand)  3. Market (#/market)
4. Menu (#/menu)  5. Growth (#/growth)  6. Viral (#/viral)
7. Creative (#/creative)  8. Roadmap (#/roadmap)  9. Sources (#/sources)
10. Calculator (#/calculator)  11. Menu Studio (#/menu-studio)
12. Competitors (#/competitors)  13. Content Calendar (#/content-calendar)
14. Experiments (#/experiments)  15. Style Guide (#/style-guide)
16. Budget (#/budget)  17. Origin Atlas (#/origin-atlas)
18. ROI (#/roi)  19. Campaign Builder (#/campaign-builder)
20. Spirit Checker (#/spirit-checker)  21. SWOT (#/swot)
22. Pilot (#/pilot)  23. Scorecard (#/scorecard)
24. Landing (#/landing)  25. Loyalty (#/loyalty)

## Feature Specs (abbreviated — full format per feature in sections below)

### Dashboard Navigation
- Feature: Navigate between all 25 sections using only mouse clicks
- User: Coffee shop owner
- Controls: Nav buttons (Dashboard, Sources, Ursa Mañana), Dossier dropdown, Tools dropdown
- Expected: Each click navigates to correct route, H1 updates, 0 errors

### Calculator (Subscription Economics)
- Feature: Edit inputs and see live calculation results
- Controls: Number inputs, sliders, sensitivity table
- Expected: Inputs accept numeric values, results update without NaN/Infinity

### SWOT Matrix
- Feature: Click competitor dots to see SWOT detail
- Controls: 14 clickable dots on 2x2 plot
- Expected: Click shows detail panel with strength/weakness/opportunity/threat

### Spirit Checker
- Feature: Answer 8 yes/no questions
- Controls: Yes/No buttons per question
- Expected: Answers update verdict display

### Campaign Builder
- Feature: 6-step wizard navigation
- Controls: Next/Back buttons, form inputs
- Expected: Steps advance/retreat, summary generates

### Creative Tabs
- Feature: Switch between Social/Print/Packaging/Digital
- Controls: 4 tab buttons
- Expected: Tab content changes on click

### Scorecard
- Feature: Print and copy buttons
- Controls: PRINT SCORECARD, COPY AS TEXT buttons
- Expected: Print triggers window.print, Copy copies text to clipboard

### Landing Form
- Feature: Email input and submit
- Controls: Text input, submit button
- Expected: Input accepts text, submit processes form

### Competitors Table
- Feature: Sort and filter competitor data
- Controls: Column header sort buttons
- Expected: Table re-sorts on header click

### Experiments Tracker
- Feature: Change experiment status
- Controls: Status buttons (Proposed/Running/Passed/Killed)
- Expected: Status changes update tracker counts

### Language Toggle
- Feature: Switch EN↔ES
- Controls: ES/EN button in header
- Expected: All visible text switches language

### Theme Toggle
- Feature: Switch light↔dark
- Controls: Sun/Moon button in header
- Expected: Theme changes, persists across navigation
