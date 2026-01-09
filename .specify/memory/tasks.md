# Tasks: Macro Economics Dashboard

**Input**: Design documents from implementation plan
**Prerequisites**: implementation_plan.md (complete), constitution.md (complete)

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1=Dashboard, US2=Detail, US3=Sync)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install dependencies and verify project builds

- [x] T001 Install `lightweight-charts` package via `pnpm add lightweight-charts`
- [x] T002 [P] Install dnd-kit packages via `pnpm add @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities`
- [x] T003 Verify `pnpm dev` runs without errors

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Database schema and core server functions that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Create `src/db/schema/userLayouts.ts` with layoutKey, indicatorOrder, hiddenIndicators columns
- [x] T005 [P] Create `src/db/schema/syncLogs.ts` with indicatorCode, status, recordsSynced, errorMessage columns
- [x] T006 Update `src/db/schema/index.ts` to export new schemas
- [x] T007 Run `pnpm db:generate` to generate migrations
- [x] T008 Run `pnpm db:push` to apply migrations to database
- [x] T009 Verify new tables exist in PostgreSQL

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Dashboard View (Priority: P1) 🎯 MVP

**Goal**: Display all indicators in a draggable grid with real-time data

**Independent Test**: Navigate to `/dashboard`, see all indicators with values, drag to reorder

### Server Functions for US1

- [x] T010 [US1] Create `src/server/functions/indicators.ts` with `getAllIndicatorsWithLatest()` function
- [x] T011 [US1] Add `getIndicatorMetrics(id)` function to return YoY/MoM/QoQ for indicator
- [x] T012 [US1] Create `src/server/functions/layout.ts` with `saveLayout(layoutKey, order)` function
- [x] T013 [P] [US1] Add `getLayout(layoutKey)` function to retrieve saved order

### UI Components for US1

- [x] T014 [US1] Create `src/components/dashboard/IndicatorChart.tsx` - TradingView wrapper for mini sparkline
  - Initialize chart on mount
  - Handle data updates via props
  - Cleanup on unmount
  - Responsive width/height
- [x] T015 [US1] Create `src/components/dashboard/IndicatorCard.tsx` - Draggable card component
  - Display name (English + Chinese)
  - Display latest value with unit
  - Display YoY/MoM badges with color coding (green/red)
  - Embed mini IndicatorChart
  - Add drag handle from lucide-react
- [x] T016 [US1] Create `src/components/dashboard/DashboardGrid.tsx` - @dnd-kit sortable grid
  - Implement DndContext and SortableContext
  - Handle onDragEnd to reorder items
  - Call saveLayout on order change
  - Responsive grid (1 col mobile, 2 tablet, 3/4 desktop)
- [x] T017 [US1] Create `src/components/dashboard/IndicatorPicker.tsx` - Sheet for show/hide
  - Use existing Sheet from shadcn
  - Checkbox list of all indicators
  - Group by category
  - Save hidden state to layout

### Route for US1

- [x] T018 [US1] Create `src/routes/dashboard.tsx`
  - Server function loader: getAllIndicatorsWithLatest + getLayout
  - Render DashboardGrid with IndicatorCards
  - Add Button to open IndicatorPicker Sheet
  - Handle loading and error states
- [x] T019 [US1] Modify `src/routes/index.tsx` to redirect to `/dashboard`

**Checkpoint**: Dashboard should be fully functional - indicators display, drag works, order persists

---

## Phase 4: User Story 2 - Indicator Detail View (Priority: P2)

**Goal**: View detailed chart and statistics for a single indicator

**Independent Test**: Click indicator card, navigate to detail page, see full chart and data

### Server Functions for US2

- [x] T020 [US2] Add `getIndicatorHistory(id, limit)` to `src/server/functions/indicators.ts`
  - Return historical data ordered by date desc
  - Support limit parameter for pagination

### UI Components for US2

- [x] T021 [US2] Create full-size chart variant in `IndicatorChart.tsx`
  - Accept `fullSize` prop for larger dimensions
  - Add crosshair interaction
  - Enable zoom/pan controls

### Route for US2

- [x] T022 [US2] Create `src/routes/indicators.$id.tsx`
  - Server function loader: getIndicatorHistory + getIndicatorMetrics
  - Render full-size IndicatorChart
  - Display statistics: latest value, YoY, MoM, QoQ
  - Display historical data table (last 20 values)
  - Back button to dashboard

**Checkpoint**: Detail page should show full chart with all historical data and statistics

---

## Phase 5: User Story 3 - Data Synchronization (Priority: P3)

**Goal**: Keep indicator data up-to-date with daily sync from FRED API

**Independent Test**: Run sync script, verify new data added to database

### Sync Service

- [x] T023 [US3] Enhance `src/server/indicator/fred.ts`
  - Add `syncIndicatorData(indicatorId, seriesId)` with gap-filling logic
  - Query existing dates to prevent duplicates
  - Insert only new observations
- [x] T024 [US3] Add `updateIndicatorMetrics(indicatorId)` to `src/server/indicator/fred.ts`
  - Calculate YoY from value 365 days ago
  - Calculate MoM from value 30 days ago
  - Upsert into indicatorMetrics table
- [x] T025 [US3] Create `src/server/functions/sync.ts`
  - `syncAllIndicators()` - iterate all indicators, call syncIndicatorData
  - `logSyncResult()` - insert into syncLogs table
  - Handle errors per indicator, continue with others

### API Endpoint for US3

- [x] T026 [US3] Create `src/routes/api/sync.ts`
  - POST endpoint accepting `Authorization: Bearer ${CRON_SECRET}`
  - Return 401 if secret invalid
  - Call syncAllIndicators and return results as JSON

### Script for US3

- [x] T027 [US3] Create `src/scripts/daily-sync.ts`
  - Import syncAllIndicators from sync.ts
  - Log results to console
  - Exit with code 0 on success, 1 on failure
- [x] T028 [US3] Add npm script `"sync": "tsx src/scripts/daily-sync.ts"` to package.json

**Checkpoint**: Sync runs successfully, new data added, no duplicates created

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: UX improvements that affect multiple user stories

- [x] T029 [P] Add loading Skeleton components to dashboard and detail pages
- [x] T030 [P] Add empty state when no indicators exist
- [x] T031 [P] Add error boundary with retry button
- [x] T032 Update `src/components/app-sidebar.tsx` with Dashboard link
- [x] T033 [P] Verify mobile responsive layout
- [x] T034 [P] Verify touch drag-and-drop works

### Design System & Theming
- [x] T035 Install `next-themes` and create `src/components/theme-provider.tsx`
- [x] T036 Update `src/styles/app.css` to use refined Zinc color palette and CSS variables
- [x] T037 Create `src/components/ThemeToggle.tsx` and add to header
- [x] T040 Update `AppSidebar` and `DashboardGrid` layout
  - Refined spacing and responsive grid
  - Collapsible sidebar styles
- [x] T041 Polish `IndicatorDetail` page structure and typographydd to header

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - start immediately
- **Foundational (Phase 2)**: Depends on Setup - BLOCKS all user stories
- **US1 Dashboard (Phase 3)**: Depends on Phase 2 completion
- **US2 Detail (Phase 4)**: Can run parallel to Phase 3 after Phase 2
- **US3 Sync (Phase 5)**: Can run parallel to Phases 3-4 after Phase 2
- **Polish (Phase 6)**: Depends on Phases 3-5 completion

### Parallel Opportunities

```
Phase 2: T004 ─┬─ T005 (parallel - different files)
               │
               v
           T006 ─> T007 ─> T008 ─> T009

Phase 3+: After Phase 2 completes:
   ┌─────────────────────────────────────────┐
   │  US1 (Dashboard)    │                   │
   │  T010-T019          │  US2 (Detail)     │
   │                     │  T020-T022        │
   │  US3 (Sync)         │                   │
   │  T023-T028          │                   │
   └─────────────────────────────────────────┘
   (All user stories can proceed in parallel)
```

---

## Implementation Strategy

### MVP First (Dashboard Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: US1 (Dashboard)
4. **STOP and VALIDATE**: Test dashboard independently
5. Deploy/demo if ready

### Full Implementation

1. Phases 1-2: Setup + Foundation
2. Phase 3: Dashboard (MVP!)
3. Phases 4-5 in parallel: Detail View + Sync
4. Phase 6: Polish

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story
- Commit after each task or logical group
- Test each phase checkpoint before proceeding
- Total estimated tasks: 34
