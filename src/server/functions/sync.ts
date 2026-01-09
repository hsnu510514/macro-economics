import { db } from "@/db";
import { indicators, indicatorValues, indicatorMetrics, syncLogs } from "@/db/schema";
import { desc, eq, asc, sql } from "drizzle-orm";
import { fetchFredSeries } from "@/server/indicator/fred";

export interface SyncResult {
  code: string;
  status: "success" | "error";
  recordsSynced?: number;
  latestDate?: string;
  error?: string;
}

/**
 * Sync data for a single indicator
 */
export async function syncIndicatorData(
  indicatorId: number,
  seriesId: string
): Promise<{ synced: number; latestDate: string | null }> {
  // 1. Get the latest date we have
  const lastValue = await db.query.indicatorValues.findFirst({
    where: eq(indicatorValues.indicator_id, indicatorId),
    orderBy: desc(indicatorValues.date),
  });

  // Calculate next day after last date
  let startDate: string | undefined;
  if (lastValue?.date) {
    const lastDate = new Date(lastValue.date);
    lastDate.setDate(lastDate.getDate() + 1);
    startDate = lastDate.toISOString().slice(0, 10);
  }

  // 2. Fetch new data from FRED
  const observations = await fetchFredSeries(seriesId, startDate);

  // 3. Get existing dates to prevent duplicates
  const existingValues = await db.query.indicatorValues.findMany({
    where: eq(indicatorValues.indicator_id, indicatorId),
    columns: { date: true },
  });
  const existingDates = new Set(existingValues.map((v) => v.date));

  // 4. Filter and prepare new rows
  const newRows = observations
    .filter((o) => o.value !== "." && !existingDates.has(o.date))
    .map((o) => ({
      indicator_id: indicatorId,
      date: o.date,
      value: o.value,
    }));

  // 5. Insert new data
  if (newRows.length > 0) {
    await db.insert(indicatorValues).values(newRows);
  }

  const latestDate = newRows.length > 0 ? newRows[newRows.length - 1].date : null;

  return { synced: newRows.length, latestDate };
}

/**
 * Calculate and update metrics for an indicator
 */
export async function updateIndicatorMetrics(indicatorId: number): Promise<void> {
  // Get recent values for calculation
  const values = await db.query.indicatorValues.findMany({
    where: eq(indicatorValues.indicator_id, indicatorId),
    orderBy: desc(indicatorValues.date),
    limit: 400, // ~1 year of daily data + buffer
  });

  if (values.length < 2) return;

  const latest = parseFloat(values[0].value);
  const latestDate = new Date(values[0].date);

  // Find values from ~30 and ~365 days ago
  const monthAgoValue = values.find((v) => {
    const daysDiff =
      (latestDate.getTime() - new Date(v.date).getTime()) / (1000 * 60 * 60 * 24);
    return daysDiff >= 28 && daysDiff <= 35;
  });

  const yearAgoValue = values.find((v) => {
    const daysDiff =
      (latestDate.getTime() - new Date(v.date).getTime()) / (1000 * 60 * 60 * 24);
    return daysDiff >= 360 && daysDiff <= 370;
  });

  const quarterAgoValue = values.find((v) => {
    const daysDiff =
      (latestDate.getTime() - new Date(v.date).getTime()) / (1000 * 60 * 60 * 24);
    return daysDiff >= 85 && daysDiff <= 95;
  });

  const calcChange = (current: number, previous: number | undefined): number => {
    if (previous === undefined || previous === 0) return 0;
    return ((current - previous) / Math.abs(previous)) * 100;
  };

  const yoy = calcChange(latest, yearAgoValue ? parseFloat(yearAgoValue.value) : undefined);
  const mom = calcChange(latest, monthAgoValue ? parseFloat(monthAgoValue.value) : undefined);
  const qoq = calcChange(latest, quarterAgoValue ? parseFloat(quarterAgoValue.value) : undefined);

  // Upsert metrics
  const existing = await db.query.indicatorMetrics.findFirst({
    where: eq(indicatorMetrics.indicator_id, indicatorId),
  });

  if (existing) {
    await db
      .update(indicatorMetrics)
      .set({ yoy, mom, qoq, updatedAt: new Date() })
      .where(eq(indicatorMetrics.indicator_id, indicatorId));
  } else {
    await db.insert(indicatorMetrics).values({
      indicator_id: indicatorId,
      yoy,
      mom,
      qoq,
    });
  }
}

/**
 * Sync all indicators and log results
 */
export async function syncAllIndicators(): Promise<SyncResult[]> {
  const allIndicators = await db.query.indicators.findMany();
  const results: SyncResult[] = [];

  for (const indicator of allIndicators) {
    try {
      const { synced, latestDate } = await syncIndicatorData(
        indicator.id,
        indicator.code
      );

      // Update metrics after syncing
      await updateIndicatorMetrics(indicator.id);

      const result: SyncResult = {
        code: indicator.code,
        status: "success",
        recordsSynced: synced,
        latestDate: latestDate ?? undefined,
      };
      results.push(result);

      // Log success
      await db.insert(syncLogs).values({
        indicatorCode: indicator.code,
        status: "success",
        recordsSynced: synced,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      const result: SyncResult = {
        code: indicator.code,
        status: "error",
        error: errorMessage,
      };
      results.push(result);

      // Log error
      await db.insert(syncLogs).values({
        indicatorCode: indicator.code,
        status: "error",
        errorMessage: errorMessage.slice(0, 1000),
      });
    }
  }

  return results;
}
