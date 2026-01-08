import { fetchFredSeries, ingestFredSeries } from "@/server/indicator/fred";
import { db } from ".";
import { indicators, indicatorValues } from "../db/schema";
type indicatorType = typeof indicators.$inferInsert;

const indicatorArray: indicatorType[] = [
  {
    code: "FEDFUNDS",
    name: "Federal Funds Effective Rate",
    cName: "聯邦基金利率",
    category: "",
    source: "FRED",
    unit: "Percent",
  },
  {
    code: "CPIAUCSL",
    name: "Consumer Price Index for All Urban Consumers: All Items",
    cName: "CPI",
    category: "",
    source: "FRED",
    unit: "Index",
  },
  {
    code: "CPILFESL",
    name: "Consumer Price Index for All Urban Consumers: All Items Less Food and Energy",
    cName: "核心 CPI",
    category: "",
    source: "FRED",
    unit: "Index",
  },
  {
    code: "PCEPI",
    name: "Personal Consumption Expenditures: Chain-type Price Index",
    cName: "PCE",
    category: "",
    source: "FRED",
    unit: "Index",
  },
  {
    code: "UNRATE",
    name: "Unemployment Rate",
    cName: "失業率",
    category: "",
    source: "FRED",
    unit: "Percent",
  },
  {
    code: "PAYEMS",
    name: "All Employees, Total Nonfarm",
    cName: "非農就業",
    category: "",
    source: "FRED",
    unit: "Thousands of Persons",
  },
  {
    code: "GDP",
    name: "Gross Domestic Product",
    cName: "GDP",
    category: "",
    source: "FRED",
    unit: "Billions of Dollars",
  },
  {
    code: "DGS10",
    name: "Market Yield on U.S. Treasury Securities at 10-Year Constant Maturity",
    cName: "10Y 美債",
    category: "",
    source: "FRED",
    unit: "Percent",
  },
  {
    code: "DGS2",
    name: "Market Yield on U.S. Treasury Securities at 2-Year Constant Maturity",
    cName: "2Y 美債",
    category: "",
    source: "FRED",
    unit: "Percent",
  },
  {
    code: "DTWEXBGS",
    name: "Trade Weighted U.S. Dollar Index: Broad, Goods",
    cName: "美元指數",
    category: "",
    source: "FRED",
    unit: "Index",
  },
];

async function seed() {
  // fetch data and populate the database
  const createdIndicators = await db
    .insert(indicators)
    .values(indicatorArray)
    .onConflictDoUpdate({
      target: indicators.code,
      set: {
        name: indicators.name,
        cName: indicators.cName,
        category: indicators.category,
        source: indicators.source,
        unit: indicators.unit,
      },
    })
    .returning();

  createdIndicators.forEach(async (item) => {
    const observations = await fetchFredSeries(item.code);
    const rows = observations
      .filter((o) => o.value !== ".")
      .map((o) => ({
        indicator_id: item!.id,
        date: o.date,
        value: o.value,
      }));

    if (!rows.length) return { inserted: 0 };

    // 5. 批次寫入
    await db.insert(indicatorValues).values(rows);

    return { inserted: rows.length };
  });
}

seed();
