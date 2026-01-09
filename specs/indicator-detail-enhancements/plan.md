# Implementation Plan: Indicator Detail Enhancements

**Branch**: `indicator-detail-enhancements` | **Date**: 2026-01-09
**Input**: User request from indicators.$id.tsx enhancement

## Summary

Add two new sections to the indicator detail page:
1. **Index Introduction** - Concise info about indicator meaning, calculation, analyst usage, with clickable related indexes that navigate to their pages
2. **Personal Notes** - Markdown-enabled user notes with edit/save functionality

Key enhancement: Related indexes will be stored as relationships between indicators, enabling clickable navigation to other indicator pages.

## Technical Context

**Language/Version**: TypeScript 5.7, React 19  
**Primary Dependencies**: TanStack Start, Drizzle ORM, react-markdown (new)  
**Storage**: PostgreSQL via Drizzle ORM  
**Testing**: Manual verification (constitution specifies 70% coverage goal)  
**Target Platform**: Web (desktop + mobile responsive)  
**Project Type**: Web application (TanStack Start)

## Constitution Check

| Principle | Status | Notes |
|-----------|--------|-------|
| TypeScript Strictness | ✅ | All new code will be fully typed |
| Component Modularity | ✅ | Two focused components: IndexIntroduction, PersonalNotes |
| Responsive Design | ✅ | Will use existing Tailwind patterns |
| Loading States | ✅ | Will add loading states for notes save |
| Error Handling | ✅ | Will handle save errors gracefully |
| Database Schema Changes | ✅ | Migrations will be documented and reversible |
| Zod Validation | ✅ | Will use Zod for notes save API input |

## Project Structure

### Documentation (this feature)

```text
specs/indicator-detail-enhancements/
├── plan.md              # This file
└── tasks.md             # Phase 2 output
```

### Source Code Changes

```text
src/
├── db/schema/
│   ├── indicatorCategories.ts   # [NEW] Category definitions
│   ├── indicators.ts            # [MODIFY] Add info columns + category_id FK
│   ├── relatedIndicators.ts     # [NEW] Many-to-many relationships
│   ├── indicatorNotes.ts        # [NEW] User notes storage
│   └── index.ts                 # [MODIFY] Export new schemas
├── server/functions/
│   └── indicators.ts            # [MODIFY] Add info/notes functions
├── components/dashboard/
│   ├── IndexIntroduction.tsx    # [NEW] Introduction section
│   └── PersonalNotes.tsx        # [NEW] Notes editor/viewer
└── routes/
    └── indicators.$id.tsx       # [MODIFY] Add new sections
```

---

## Database Design

### Indicator Categories

Typical macroeconomic segmentation:

| Category | Slug | Indicators |
|----------|------|------------|
| Interest Rates | interest-rates | FEDFUNDS, DGS10, DGS2 |
| Inflation | inflation | CPIAUCSL, CPILFESL, PCEPI |
| Labor Market | labor-market | UNRATE, PAYEMS |
| Economic Output | economic-output | GDP |
| Currency | currency | DTWEXBGS |

### Schema Relationships

```mermaid
erDiagram
    indicatorCategories ||--o{ indicators : "has many"
    indicators ||--o| indicatorNotes : "has one"
    indicators ||--o{ relatedIndicators : "has many"
    indicators ||--o{ relatedIndicators : "related to"
    
    indicatorCategories {
        int id PK
        varchar name
        varchar slug UK
    }
    
    indicators {
        int id PK
        int category_id FK
        varchar code UK
        varchar name
        varchar cName
        text meaning
        text calculation
        text analystUsage
    }
    
    relatedIndicators {
        int id PK
        int indicator_id FK
        int related_indicator_id FK
    }
    
    indicatorNotes {
        int id PK
        int indicator_id FK UK
        text content
    }
```

---

## Implementation Phases

### Phase 1: Database Schema (Blocking)

1. Create `indicatorCategories` table
2. Modify `indicators` table: add `category_id` FK + `meaning`, `calculation`, `analystUsage` columns
3. Create `relatedIndicators` table (many-to-many)
4. Create `indicatorNotes` table
5. Generate and apply migrations

### Phase 2: Backend Functions

1. Add `getIndicatorInfo(id)` - returns info + related indicators with names
2. Add `getIndicatorNotes(id)` - returns notes content
3. Add `saveIndicatorNotes(id, content)` - upserts notes with Zod validation
4. Update `loadIndicatorDetail` to include new data

### Phase 3: Frontend Components

1. Install `react-markdown` package
2. Create `IndexIntroduction` component with clickable related index badges
3. Create `PersonalNotes` component with edit/view modes
4. Integrate components into `indicators.$id.tsx`

### Phase 4: Seed Data

1. Seed categories (5 categories)
2. Assign `category_id` to existing indicators
3. Seed related indicator relationships
4. Optionally seed default indicator info content

---

## Verification Plan

### Manual Testing

1. Navigate to `/indicators/1` (or any indicator)
2. Verify Index Introduction section displays:
   - Meaning, calculation, analyst usage fields
   - Related indexes as clickable badges
3. Click related index badge → navigates to that indicator page
4. Verify Personal Notes section:
   - Shows empty state with "Add note" prompt
   - Click edit → opens textarea
   - Type markdown (e.g., `# Heading\n**bold**`)
   - Save → renders markdown correctly
   - Refresh page → notes persist
5. Test on mobile viewport → responsive layout

### Database Verification

```sql
-- Verify tables created
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Verify relationships
SELECT i.cName, c.name as category 
FROM indicators i 
JOIN "indicatorCategories" c ON i.category_id = c.id;

-- Verify related indicators
SELECT a.cName as indicator, b.cName as related_to 
FROM "relatedIndicators" r 
JOIN indicators a ON r.indicator_id = a.id 
JOIN indicators b ON r.related_indicator_id = b.id;
```

---

## Dependencies

```bash
pnpm add react-markdown
```

## Complexity Tracking

No constitution violations identified. Implementation follows established patterns.
