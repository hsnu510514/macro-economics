import { d as db, u as userLayouts } from "./index-s3Y0O6XI.js";
import { eq } from "drizzle-orm";
async function saveLayout(layoutKey, indicatorOrder, hiddenIndicators = []) {
  await db.insert(userLayouts).values({
    layoutKey,
    indicatorOrder,
    hiddenIndicators
  }).onConflictDoUpdate({
    target: userLayouts.layoutKey,
    set: {
      indicatorOrder,
      hiddenIndicators,
      updatedAt: /* @__PURE__ */ new Date()
    }
  });
}
async function getLayout(layoutKey) {
  const layout = await db.query.userLayouts.findFirst({
    where: eq(userLayouts.layoutKey, layoutKey)
  });
  return layout ? {
    indicatorOrder: layout.indicatorOrder,
    hiddenIndicators: layout.hiddenIndicators
  } : null;
}
export {
  getLayout as g,
  saveLayout as s
};
