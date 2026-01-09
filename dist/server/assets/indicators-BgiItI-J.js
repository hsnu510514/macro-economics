import { d as db, b as indicators, i as indicatorValues, a as indicatorMetrics, r as relatedIndicators, c as indicatorNotes } from "./index-s3Y0O6XI.js";
import { eq, desc } from "drizzle-orm";
async function getAllIndicatorsWithLatest() {
  const allIndicators = await db.query.indicators.findMany();
  const result = [];
  for (const indicator of allIndicators) {
    const latestValue = await db.query.indicatorValues.findFirst({
      where: eq(indicatorValues.indicator_id, indicator.id),
      orderBy: desc(indicatorValues.date)
    });
    const metrics = await db.query.indicatorMetrics.findFirst({
      where: eq(indicatorMetrics.indicator_id, indicator.id)
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
      qoq: metrics?.qoq ?? null
    });
  }
  return result;
}
async function getIndicatorMetrics(indicatorId) {
  return await db.query.indicatorMetrics.findFirst({
    where: eq(indicatorMetrics.indicator_id, indicatorId)
  });
}
async function getIndicatorHistory(indicatorId, limit = 365) {
  return await db.query.indicatorValues.findMany({
    where: eq(indicatorValues.indicator_id, indicatorId),
    orderBy: desc(indicatorValues.date),
    limit
  });
}
async function getIndicatorById(indicatorId) {
  return await db.query.indicators.findFirst({
    where: eq(indicators.id, indicatorId)
  });
}
async function getRelatedIndicators(indicatorId) {
  const relations = await db.query.relatedIndicators.findMany({
    where: eq(relatedIndicators.indicator_id, indicatorId)
  });
  if (relations.length === 0) {
    return [];
  }
  const relatedIds = relations.map((r) => r.related_indicator_id);
  const relatedIndicatorsList = await db.query.indicators.findMany({
    where: (ind, { inArray }) => inArray(ind.id, relatedIds)
  });
  const result = [];
  for (const ind of relatedIndicatorsList) {
    const latestValue = await db.query.indicatorValues.findFirst({
      where: eq(indicatorValues.indicator_id, ind.id),
      orderBy: desc(indicatorValues.date)
    });
    const metrics = await db.query.indicatorMetrics.findFirst({
      where: eq(indicatorMetrics.indicator_id, ind.id)
    });
    const history = await db.query.indicatorValues.findMany({
      where: eq(indicatorValues.indicator_id, ind.id),
      orderBy: desc(indicatorValues.date),
      limit: 30
    });
    const chartData = history.filter((h) => h.value !== ".").map((h) => ({
      time: h.date,
      value: parseFloat(h.value)
    })).reverse();
    result.push({
      id: ind.id,
      name: ind.name,
      cName: ind.cName,
      code: ind.code,
      latestValue: latestValue?.value ?? null,
      latestDate: latestValue?.date ?? null,
      yoy: metrics?.yoy ?? null,
      chartData
    });
  }
  return result;
}
async function getIndicatorNotes(indicatorId) {
  const notes = await db.query.indicatorNotes.findFirst({
    where: eq(indicatorNotes.indicator_id, indicatorId)
  });
  return notes?.content ?? null;
}
async function saveIndicatorNotes(indicatorId, content) {
  const existing = await db.query.indicatorNotes.findFirst({
    where: eq(indicatorNotes.indicator_id, indicatorId)
  });
  if (existing) {
    await db.update(indicatorNotes).set({ content }).where(eq(indicatorNotes.indicator_id, indicatorId));
  } else {
    await db.insert(indicatorNotes).values({
      indicator_id: indicatorId,
      content
    });
  }
}
export {
  getIndicatorHistory as a,
  getIndicatorById as b,
  getIndicatorMetrics as c,
  getRelatedIndicators as d,
  getIndicatorNotes as e,
  getAllIndicatorsWithLatest as g,
  saveIndicatorNotes as s
};
