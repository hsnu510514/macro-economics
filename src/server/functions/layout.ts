import { db } from "@/db";
import { userLayouts } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * Save user's dashboard layout preferences
 */
export async function saveLayout(
  layoutKey: string,
  indicatorOrder: number[],
  hiddenIndicators: number[] = []
) {
  await db
    .insert(userLayouts)
    .values({
      layoutKey,
      indicatorOrder,
      hiddenIndicators,
    })
    .onConflictDoUpdate({
      target: userLayouts.layoutKey,
      set: {
        indicatorOrder,
        hiddenIndicators,
        updatedAt: new Date(),
      },
    });
}

/**
 * Get user's saved layout
 */
export async function getLayout(layoutKey: string) {
  const layout = await db.query.userLayouts.findFirst({
    where: eq(userLayouts.layoutKey, layoutKey),
  });

  return layout
    ? {
        indicatorOrder: layout.indicatorOrder,
        hiddenIndicators: layout.hiddenIndicators,
      }
    : null;
}
