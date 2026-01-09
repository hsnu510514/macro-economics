import { db } from ".";
import { indicatorCategories, indicators, relatedIndicators } from "../db/schema";
import { eq, sql } from "drizzle-orm";

// Category definitions
const categories = [
  { name: "Interest Rates", slug: "interest-rates" },
  { name: "Inflation", slug: "inflation" },
  { name: "Labor Market", slug: "labor-market" },
  { name: "Economic Output", slug: "economic-output" },
  { name: "Currency", slug: "currency" },
];

// Indicator to category mapping (by code)
const indicatorCategoryMap: Record<string, string> = {
  FEDFUNDS: "interest-rates",
  DGS10: "interest-rates",
  DGS2: "interest-rates",
  CPIAUCSL: "inflation",
  CPILFESL: "inflation",
  PCEPI: "inflation",
  UNRATE: "labor-market",
  PAYEMS: "labor-market",
  GDP: "economic-output",
  DTWEXBGS: "currency",
};

// Indicator info content
const indicatorInfo: Record<string, { meaning: string; calculation: string; analystUsage: string }> = {
  FEDFUNDS: {
    meaning: "The interest rate at which banks lend reserves to each other overnight. Set by the Federal Reserve as a monetary policy tool.",
    calculation: "Volume-weighted median of overnight federal funds transactions reported by major brokers.",
    analystUsage: "Key benchmark for monetary policy stance. Rising rates indicate tightening policy; falling rates indicate easing.",
  },
  CPIAUCSL: {
    meaning: "Measures the average change in prices paid by urban consumers for a basket of goods and services.",
    calculation: "Weighted average of prices for ~80,000 items, updated monthly by Bureau of Labor Statistics.",
    analystUsage: "Primary inflation gauge. Compare YoY change to Fed's 2% target. Watch for acceleration/deceleration trends.",
  },
  CPILFESL: {
    meaning: "CPI excluding volatile food and energy prices, providing a cleaner view of underlying inflation.",
    calculation: "Same methodology as CPI but excludes food and energy components.",
    analystUsage: "Preferred by Fed for policy decisions. More stable than headline CPI. Watch for sticky inflation.",
  },
  PCEPI: {
    meaning: "Measures price changes in personal consumption. The Fed's preferred inflation measure.",
    calculation: "Derived from GDP data, updated quarterly with monthly estimates. Accounts for substitution effects.",
    analystUsage: "Fed's official 2% inflation target uses Core PCE. Compare to CPI for divergence signals.",
  },
  UNRATE: {
    meaning: "Percentage of the labor force that is jobless and actively seeking employment.",
    calculation: "Based on monthly household survey of ~60,000 households by Bureau of Labor Statistics.",
    analystUsage: "Key labor market health indicator. Compare to natural rate (~4%). Rising rate signals recession risk.",
  },
  PAYEMS: {
    meaning: "Total number of nonfarm employees in the US economy, excluding farm workers and some government workers.",
    calculation: "Based on employer survey (establishment survey) covering ~145,000 businesses.",
    analystUsage: "Primary job creation measure. +150K/month needed to keep pace with population. Watch for revisions.",
  },
  GDP: {
    meaning: "Total market value of all goods and services produced in the US economy.",
    calculation: "Sum of consumption, investment, government spending, and net exports. Released quarterly.",
    analystUsage: "Primary economic growth measure. Two consecutive negative quarters = technical recession.",
  },
  DGS10: {
    meaning: "Yield on 10-year US Treasury bonds, representing the risk-free rate for long-term investments.",
    calculation: "Interpolated from Treasury yield curve based on actively traded securities.",
    analystUsage: "Benchmark for mortgages, corporate bonds. Compare to 2Y for yield curve shape (inversion = recession signal).",
  },
  DGS2: {
    meaning: "Yield on 2-year US Treasury bonds, reflecting near-term Fed policy expectations.",
    calculation: "Interpolated from Treasury yield curve based on actively traded securities.",
    analystUsage: "Closely tracks Fed Funds expectations. Compare to 10Y for yield curve analysis.",
  },
  DTWEXBGS: {
    meaning: "Trade-weighted value of the US dollar against a broad basket of foreign currencies.",
    calculation: "Weighted by bilateral trade flows with major trading partners.",
    analystUsage: "Strong dollar = headwind for exports/multinationals. Watch for correlation with rate differentials.",
  },
};

// Related indicators (code pairs)
const relatedPairs: [string, string][] = [
  // Interest rates are related to each other
  ["FEDFUNDS", "DGS2"],
  ["FEDFUNDS", "DGS10"],
  ["DGS2", "DGS10"],
  // Inflation measures are related
  ["CPIAUCSL", "CPILFESL"],
  ["CPIAUCSL", "PCEPI"],
  ["CPILFESL", "PCEPI"],
  // Labor market indicators
  ["UNRATE", "PAYEMS"],
  // Cross-category relationships
  ["FEDFUNDS", "CPIAUCSL"], // Fed rate responds to inflation
  ["FEDFUNDS", "UNRATE"], // Fed dual mandate
  ["GDP", "PAYEMS"], // Growth and employment
  ["DTWEXBGS", "FEDFUNDS"], // Dollar and rates
];

async function seedCategoriesAndInfo() {
  console.log("Seeding indicator categories...");
  
  // Insert categories
  const createdCategories = await db
    .insert(indicatorCategories)
    .values(categories)
    .onConflictDoNothing()
    .returning();
  
  console.log(`Created ${createdCategories.length} categories`);
  
  // Get all categories for mapping
  const allCategories = await db.query.indicatorCategories.findMany();
  const categoryIdMap = new Map(allCategories.map(c => [c.slug, c.id]));
  
  // Get all indicators
  const allIndicators = await db.query.indicators.findMany();
  const indicatorIdMap = new Map(allIndicators.map(i => [i.code, i.id]));
  
  console.log("Updating indicators with category and info...");
  
  // Update each indicator with category_id and info
  for (const indicator of allIndicators) {
    const categorySlug = indicatorCategoryMap[indicator.code];
    const categoryId = categorySlug ? categoryIdMap.get(categorySlug) : null;
    const info = indicatorInfo[indicator.code];
    
    if (categoryId || info) {
      await db
        .update(indicators)
        .set({
          category_id: categoryId,
          meaning: info?.meaning ?? "",
          calculation: info?.calculation ?? "",
          analystUsage: info?.analystUsage ?? "",
        })
        .where(eq(indicators.id, indicator.id));
    }
  }
  
  console.log("Seeding related indicators...");
  
  // Insert related indicator pairs (bidirectional)
  const relatedRows: { indicator_id: number; related_indicator_id: number }[] = [];
  
  for (const [codeA, codeB] of relatedPairs) {
    const idA = indicatorIdMap.get(codeA);
    const idB = indicatorIdMap.get(codeB);
    
    if (idA && idB) {
      // Add both directions for bidirectional relationship
      relatedRows.push({ indicator_id: idA, related_indicator_id: idB });
      relatedRows.push({ indicator_id: idB, related_indicator_id: idA });
    }
  }
  
  if (relatedRows.length > 0) {
    await db
      .insert(relatedIndicators)
      .values(relatedRows)
      .onConflictDoNothing();
  }
  
  console.log(`Created ${relatedRows.length} related indicator relationships`);
  console.log("Seed complete!");
}

seedCategoriesAndInfo()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error("💥 Seed failed:", err);
    process.exit(1);
  });
