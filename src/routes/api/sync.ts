import { createFileRoute } from "@tanstack/react-router";
import { json } from "@tanstack/react-start";
import { syncAllIndicators } from "@/server/functions/sync";

export const Route = createFileRoute("/api/sync")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // Verify authorization
        const authHeader = request.headers.get("Authorization");
        const expectedToken = `Bearer ${process.env.CRON_SECRET}`;

        if (!process.env.CRON_SECRET || authHeader !== expectedToken) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
          });
        }

        try {
          const results = await syncAllIndicators();

          const summary = {
            total: results.length,
            success: results.filter((r) => r.status === "success").length,
            error: results.filter((r) => r.status === "error").length,
            totalRecordsSynced: results.reduce(
              (sum, r) => sum + (r.recordsSynced ?? 0),
              0
            ),
          };

          return json({ summary, results });
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          return new Response(
            JSON.stringify({ error: "Sync failed", message: errorMessage }),
            {
              status: 500,
              headers: { "Content-Type": "application/json" },
            }
          );
        }
      },
    },
  },
});
