import { b as createServerRpc, c as createServerFn } from "../server.js";
import { s as saveIndicatorNotes } from "./indicators-BgiItI-J.js";
import { z } from "zod";
import "node:async_hooks";
import "react/jsx-runtime";
import "@tanstack/react-router/ssr/server";
import "@tanstack/react-router";
import "./index-s3Y0O6XI.js";
import "drizzle-orm/pg-core";
import "dotenv/config";
import "drizzle-orm/node-postgres";
import "drizzle-orm";
const saveNotes_createServerFn_handler = createServerRpc("4b31f34768336ef9aca76b7a0e1ee834c2cc009b9b2945f0c739ed1c4d90e18b", (opts, signal) => {
  return saveNotes.__executeServer(opts, signal);
});
const saveNotes = createServerFn({
  method: "POST"
}).inputValidator(z.object({
  indicatorId: z.number(),
  content: z.string()
})).handler(saveNotes_createServerFn_handler, async ({
  data
}) => {
  await saveIndicatorNotes(data.indicatorId, data.content);
  return {
    success: true
  };
});
export {
  saveNotes_createServerFn_handler
};
