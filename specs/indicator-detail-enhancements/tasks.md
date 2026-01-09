# Tasks: Indicator Detail Enhancements

**Input**: Design documents from `/specs/indicator-detail-enhancements/`
**Prerequisites**: plan.md (complete)

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: US1=Index Introduction, US2=Personal Notes
- Include exact file paths in descriptions

---

## Phase 1: Setup

**Purpose**: Install dependencies

- [x] T001 Install `react-markdown` package via `pnpm add react-markdown`
- [x] T002 Verify `pnpm dev` runs without errors

---

## Phase 2: Database Schema (Blocking)

**Purpose**: Create new tables and modify existing schema

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 Create `src/db/schema/indicatorCategories.ts` with id, name, slug columns
- [x] T004 [P] Create `src/db/schema/relatedIndicators.ts` with indicator_id, related_indicator_id FK columns
- [x] T005 [P] Create `src/db/schema/indicatorNotes.ts` with indicator_id (unique), content columns
- [x] T006 Modify `src/db/schema/indicators.ts`:
  - Add `category_id` FK to indicatorCategories
  - Add `meaning` text column
  - Add `calculation` text column  
  - Add `analystUsage` text column
- [x] T007 Update `src/db/schema/index.ts` to export new schemas
- [x] T008 Run `pnpm db:generate` to generate migrations
- [x] T009 Run `pnpm db:push` to apply migrations to database
- [x] T010 Verify new tables and columns exist in PostgreSQL

**Checkpoint**: Schema ready - user story implementation can now begin

---

## Phase 3: Seed Data

**Purpose**: Populate categories, assign to indicators, create relationships

- [x] T011 Update `src/db/seed.ts`:
  - Add indicatorCategories seed data (5 categories)
  - Assign category_id to each indicator in indicatorArray
  - Add default meaning/calculation/analystUsage for each indicator
- [x] T012 Create `src/db/seedRelated.ts` script to seed relatedIndicators relationships
- [x] T013 Run seed scripts and verify data in database

**Checkpoint**: All reference data populated

---

## Phase 4: User Story 1 - Index Introduction (Priority: P1) 🎯 MVP

**Goal**: Display indicator meaning, calculation, analyst usage, and clickable related indexes

**Independent Test**: Navigate to `/indicators/1`, see Introduction section with related index badges that link to other pages

### Backend for US1

- [x] T014 [US1] Add `getRelatedIndicators(indicatorId)` to `src/server/functions/indicators.ts`
  - Return array of `{ id, name, cName }` for related indicators
  - Join relatedIndicators with indicators table

### Frontend for US1

- [x] T015 [US1] Create `src/components/dashboard/IndexIntroduction.tsx`
  - Props: meaning, calculation, analystUsage, relatedIndicators
  - Display info in clean card layout
  - Render related indexes as clickable `<Link to={/indicators/${id}}>` badges
  - Handle empty states for each field
- [x] T016 [US1] Update `src/routes/indicators.$id.tsx`:
  - Update `loadIndicatorDetail` to fetch related indicators
  - Add `<IndexIntroduction />` section after stats grid
  - Pass indicator.meaning, calculation, analystUsage, relatedIndicators

**Checkpoint**: Index Introduction section fully functional with clickable related links

---

## Phase 5: User Story 2 - Personal Notes (Priority: P2)

**Goal**: Allow users to save markdown notes per indicator

**Independent Test**: Navigate to indicator, add note with markdown, save, refresh, verify persists and renders

### Backend for US2

- [x] T017 [US2] Add `getIndicatorNotes(indicatorId)` to `src/server/functions/indicators.ts`
  - Return notes content or null if none exists
- [x] T018 [US2] Add `saveIndicatorNotes(indicatorId, content)` to `src/server/functions/indicators.ts`
  - Upsert into indicatorNotes table
  - Use Zod schema for input validation
- [x] T019 [US2] Create server function wrapper in route for saving notes

### Frontend for US2

- [x] T020 [US2] Create `src/components/dashboard/PersonalNotes.tsx`
  - Props: initialContent, onSave callback, indicatorId
  - View mode: Render markdown content using `react-markdown`
  - Edit mode: Textarea with Save/Cancel buttons
  - Empty state: "Add your first note" prompt with edit button
  - Loading state during save
- [x] T021 [US2] Update `src/routes/indicators.$id.tsx`:
  - Update loader to fetch notes
  - Add `<PersonalNotes />` section after chart
  - Handle save action with server function

**Checkpoint**: Personal Notes section fully functional with markdown rendering

---

## Phase 6: Polish & Verification

**Purpose**: Final testing and cleanup

- [x] T022 [P] Test Introduction section displays correctly with all fields
- [x] T023 [P] Test related index badges navigate to correct pages
- [x] T024 [P] Test notes save/load cycle with markdown content
- [x] T025 [P] Test mobile responsive layout for both sections
- [x] T026 Verify no TypeScript errors (`pnpm build`)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - start immediately
- **Schema (Phase 2)**: Depends on Setup - BLOCKS all user stories
- **Seed Data (Phase 3)**: Depends on Schema
- **US1 (Phase 4)**: Depends on Seed Data (needs categories and relationships)
- **US2 (Phase 5)**: Depends on Schema only (can run parallel to Phase 3-4)
- **Polish (Phase 6)**: Depends on Phases 4-5

### Parallel Opportunities

```
Phase 2: T003 ─┬─ T004 ─┬─ T005 (parallel - different files)
               │        │
               v        v
            T006 ─> T007 ─> T008 ─> T009 ─> T010

After Phase 2:
   ┌─────────────────────────────────────────┐
   │  Phase 3 (Seed)  │                      │
   │  T011-T013       │  Phase 5 (US2 Notes) │
   ├──────────────────┤  T017-T021           │
   │  Phase 4 (US1)   │  (can start early)   │
   │  T014-T016       │                      │
   └─────────────────────────────────────────┘
```

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story
- Total estimated tasks: 26
- Commit after each phase completion
- Test each checkpoint before proceeding
