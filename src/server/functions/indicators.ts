import { db } from "@/db";
import { indicators, indicatorValues, indicatorMetrics, relatedIndicators, indicatorNotes } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export interface IndicatorWithLatest {
  id: number;
  code: string;
  name: string;
  cName: string;
  category: string;
  source: string;
  unit: string;
  latestValue: string | null;
  latestDate: string | null;
  yoy: number | null;
  mom: number | null;
  qoq: number | null;
}

export interface RelatedIndicator {
  id: number;
  name: string;
  cName: string;
  code: string;
  latestValue: string | null;
  latestDate: string | null;
  yoy: number | null;
  chartData: { time: string; value: number }[];
}

/**
 * Get all indicators with their latest values and metrics
 */
export async function getAllIndicatorsWithLatest(): Promise<IndicatorWithLatest[]> {
  // Get all indicators
  const allIndicators = await db.query.indicators.findMany();

  const result: IndicatorWithLatest[] = [];

  for (const indicator of allIndicators) {
    // Get latest value
    const latestValue = await db.query.indicatorValues.findFirst({
      where: eq(indicatorValues.indicator_id, indicator.id),
      orderBy: desc(indicatorValues.date),
    });

    // Get metrics
    const metrics = await db.query.indicatorMetrics.findFirst({
      where: eq(indicatorMetrics.indicator_id, indicator.id),
    });

    result.push({
      id: indicator.id,
      code: indicator.code,
      name: indicator.name,
      cName: indicator.cName,
      category: indicator.category,
      source: indicator.source,
      unit: indicator.unit,
      latestValue: latestValue?.value ?? null,
      latestDate: latestValue?.date ?? null,
      yoy: metrics?.yoy ?? null,
      mom: metrics?.mom ?? null,
      qoq: metrics?.qoq ?? null,
    });
  }

  return result;
}

/**
 * Get metrics for a specific indicator
 */
export async function getIndicatorMetrics(indicatorId: number) {
  return await db.query.indicatorMetrics.findFirst({
    where: eq(indicatorMetrics.indicator_id, indicatorId),
  });
}

/**
 * Get historical data for an indicator
 */
export async function getIndicatorHistory(indicatorId: number, limit = 365) {
  return await db.query.indicatorValues.findMany({
    where: eq(indicatorValues.indicator_id, indicatorId),
    orderBy: desc(indicatorValues.date),
    limit,
  });
}

/**
 * Get a single indicator by ID
 */
export async function getIndicatorById(indicatorId: number) {
  return await db.query.indicators.findFirst({
    where: eq(indicators.id, indicatorId),
  });
}

/**
 * Get related indicators for a given indicator with chart data
 */
export async function getRelatedIndicators(indicatorId: number): Promise<RelatedIndicator[]> {
  const relations = await db.query.relatedIndicators.findMany({
    where: eq(relatedIndicators.indicator_id, indicatorId),
  });

  if (relations.length === 0) {
    return [];
  }

  const relatedIds = relations.map((r) => r.related_indicator_id);
  const relatedIndicatorsList = await db.query.indicators.findMany({
    where: (ind, { inArray }) => inArray(ind.id, relatedIds),
  });

  // Fetch additional data for each related indicator
  const result: RelatedIndicator[] = [];
  
  for (const ind of relatedIndicatorsList) {
    // Get latest value
    const latestValue = await db.query.indicatorValues.findFirst({
      where: eq(indicatorValues.indicator_id, ind.id),
      orderBy: desc(indicatorValues.date),
    });

    // Get metrics
    const metrics = await db.query.indicatorMetrics.findFirst({
      where: eq(indicatorMetrics.indicator_id, ind.id),
    });

    // Get recent chart data (last 30 points)
    const history = await db.query.indicatorValues.findMany({
      where: eq(indicatorValues.indicator_id, ind.id),
      orderBy: desc(indicatorValues.date),
      limit: 30,
    });

    const chartData = history
      .filter((h) => h.value !== ".")
      .map((h) => ({
        time: h.date,
        value: parseFloat(h.value),
      }))
      .reverse();

    result.push({
      id: ind.id,
      name: ind.name,
      cName: ind.cName,
      code: ind.code,
      latestValue: latestValue?.value ?? null,
      latestDate: latestValue?.date ?? null,
      yoy: metrics?.yoy ?? null,
      chartData,
    });
  }

  return result;
}

/**
 * Get notes for a specific indicator
 */
export async function getIndicatorNotes(indicatorId: number): Promise<string | null> {
  const notes = await db.query.indicatorNotes.findFirst({
    where: eq(indicatorNotes.indicator_id, indicatorId),
  });
  return notes?.content ?? null;
}

/**
 * Save or update notes for an indicator
 */
export async function saveIndicatorNotes(indicatorId: number, content: string): Promise<void> {
  const existing = await db.query.indicatorNotes.findFirst({
    where: eq(indicatorNotes.indicator_id, indicatorId),
  });

  if (existing) {
    await db
      .update(indicatorNotes)
      .set({ content })
      .where(eq(indicatorNotes.indicator_id, indicatorId));
  } else {
    await db.insert(indicatorNotes).values({
      indicator_id: indicatorId,
      content,
    });
  }
}
