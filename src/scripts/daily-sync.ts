/**
 * Daily Sync Script
 *
 * Run manually: pnpm tsx src/scripts/daily-sync.ts
 * Or add to cron: 0 6 * * * cd /path/to/project && pnpm tsx src/scripts/daily-sync.ts
 */

import "dotenv/config";
import { syncAllIndicators } from "../server/functions/sync";

async function main() {
  console.log("🚀 Starting daily sync...");
  console.log(`📅 ${new Date().toISOString()}\n`);

  try {
    const results = await syncAllIndicators();

    // Print results
    console.log("📊 Sync Results:\n");
    console.log("─".repeat(60));

    let totalSynced = 0;
    let successCount = 0;
    let errorCount = 0;

    for (const result of results) {
      if (result.status === "success") {
        successCount++;
        totalSynced += result.recordsSynced ?? 0;
        console.log(
          `✅ ${result.code.padEnd(12)} | ${result.recordsSynced ?? 0} records synced`
        );
      } else {
        errorCount++;
        console.log(`❌ ${result.code.padEnd(12)} | Error: ${result.error}`);
      }
    }

    console.log("─".repeat(60));
    console.log(`\n📈 Summary:`);
    console.log(`   Total indicators: ${results.length}`);
    console.log(`   Successful: ${successCount}`);
    console.log(`   Failed: ${errorCount}`);
    console.log(`   Records synced: ${totalSynced}`);
    console.log(`\n✨ Sync complete!`);

    process.exit(errorCount > 0 ? 1 : 0);
  } catch (error) {
    console.error("💥 Critical sync error:", error);
    process.exit(1);
  }
}

main();
