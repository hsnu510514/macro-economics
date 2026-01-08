// app/server/ingest/fredIngest.ts
import { db } from "@/db";
import { indicators, indicatorValues } from "@/db/schema/indicators";
import { and, desc, eq } from "drizzle-orm";

// 1. 查 DB 最後日期
// 2. 呼叫 API（from last_date + 1）
// 3. 驗證資料完整性
// 4. 批次 insert
// 5. 記錄 log

export interface FredObservation {
  date: string;
  value: string;
}

export async function fetchFredSeries(seriesId: string, startDate?: string) {
  const params = new URLSearchParams({
    series_id: seriesId,
    api_key: process.env.FRED_API_KEY!,
    file_type: "json",
  });

  if (startDate) {
    params.set("observation_start", startDate);
  }

  const res = await fetch(
    `https://api.stlouisfed.org/fred/series/observations?${params.toString()}`
  );

  if (!res.ok) {
    throw new Error(`FRED API error: ${res.status}`);
  }

  const json = await res.json();
  return json.observations as FredObservation[];
}

export async function ingestFredSeries(
  seriesId: string,
  indicatorName: string
) {
  // 1. 確保 indicator 存在
  let indicator = await db.query.indicators.findFirst({
    where: eq(indicators.code, seriesId),
  });

  if (!indicator) {
    const [created] = await db
      .insert(indicators)
      .values({
        code: seriesId,
        name: indicatorName,
        source: "FRED",
        category: "category_unknown",
        frequency: "frequency_unknown",
        unit: "unit_unknown",
      })
      .returning();

    indicator = created;
  }

  // 2. 找最後一筆資料日期
  const lastValue = await db.query.indicatorValues.findFirst({
    where: eq(indicatorValues.indicatorId, indicator.id),
    orderBy: desc(indicatorValues.date),
  });

  const startDate = lastValue?.date
    ? new Date(lastValue.date).toISOString().slice(0, 10)
    : undefined;

  // 3. 抓 FRED 資料
  const observations = await fetchFredSeries(seriesId, startDate);

  // 4. 清洗並轉換
  const rows = observations
    .filter((o) => o.value !== ".")
    .map((o) => ({
      indicatorId: indicator!.id,
      date: o.date,
      value: o.value,
    }));

  if (!rows.length) return { inserted: 0 };

  // 5. 批次寫入
  await db.insert(indicatorValues).values(rows);

  return { inserted: rows.length };
}
