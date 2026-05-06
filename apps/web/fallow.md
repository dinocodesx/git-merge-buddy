── Unused Code ─────────────────────────────────────

● Unused type exports (1)
  src/types/Waitlist.ts
    :9 WaitlistStep
  Type exports with no known consumers — https://docs.fallow.tools/explanations/dead-code#unused-types

■ Metrics: 2,409 LOC · dead files 0.0% · dead exports 2.4% · avg cyclomatic 1.5 · p90 cyclomatic 3 · maintainability 94.8 (good) · 0 churn hotspots

  Function size: 68% low · 15% medium · 14% high · 3% very high  (1-15 / 16-30 / 31-60 / >60 LOC)

● Large functions (4)
  src/components/sections/Waitlist.tsx
    :216 Waitlist  103 lines
  src/hooks/useWaitlistForm.ts
    :5 useWaitlistForm   98 lines
  src/components/docs/TableOfContents.tsx
    :35 TableOfContents   67 lines
  src/components/sections/Waitlist.tsx
    :88 Step3   62 lines
  Functions exceeding 60 lines of code (very high risk): https://docs.fallow.tools/explanations/health#unit-size

● High complexity functions (2)
  src/components/sections/Waitlist.tsx
    :216 Waitlist HIGH
           8 cyclomatic    5 cognitive  103 lines
          72.0 CRAP
  src/hooks/useKeyboardShortcut.ts
    :9 handleKeyDown
           5 cyclomatic    4 cognitive   10 lines
          30.0 CRAP
  Functions exceeding cyclomatic, cognitive, or CRAP thresholds (https://docs.fallow.tools/explanations/health#complexity-metrics)

● File health scores (25 files)

   89.0    src/hooks/useWaitlistForm.ts
            103 LOC    1 fan-in    2 fan-out    0% dead  0.22 density  20.0 risk

   89.2    src/app/docs/page.tsx
             94 LOC    0 fan-in    5 fan-out    0% dead  0.12 density  12.0 risk

   91.5    src/app/pricing/page.tsx
            103 LOC    0 fan-in    3 fan-out    0% dead  0.10 density  20.0 risk

   91.6    src/app/page.tsx
             20 LOC    0 fan-in    6 fan-out    0% dead  0.05 density  2.0 risk

   91.8    src/components/docs/DocsSidebar.tsx
             69 LOC    1 fan-in    3 fan-out    0% dead  0.09 density  6.0 risk

   92.9    src/components/layout/Navbar.tsx
            113 LOC    1 fan-in    2 fan-out    0% dead  0.09 density  6.0 risk

   93.2    src/components/sections/Waitlist.tsx
            319 LOC    1 fan-in    2 fan-out    0% dead  0.08 density  72.0 risk

   93.3    src/components/docs/TableOfContents.tsx
            102 LOC    1 fan-in    1 fan-out    0% dead  0.13 density  20.0 risk

   93.6    src/components/docs/MarkdownRenderer.tsx
            296 LOC    1 fan-in    1 fan-out    0% dead  0.12 density  20.0 risk

   93.8    src/app/actions/waitlist.ts
             37 LOC    1 fan-in    2 fan-out    0% dead  0.08 density  12.0 risk

  ... and 15 more files (--format json for full list)

  Composite file quality scores based on complexity, coupling, and dead code. Risk: low <15, moderate 15-30, high >=30. CRAP estimated from export references (85% direct, 40% indirect, 0% untested). Use --coverage for exact scores. https://docs.fallow.tools/explanations/health#file-health-scores
