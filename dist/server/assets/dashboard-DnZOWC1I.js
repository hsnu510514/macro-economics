import { b as createServerRpc, c as createServerFn } from "../server.js";
import { s as saveLayout } from "./layout-B6E02iZu.js";
import "node:async_hooks";
import "react/jsx-runtime";
import "@tanstack/react-router/ssr/server";
import "@tanstack/react-router";
import "./index-s3Y0O6XI.js";
import "drizzle-orm/pg-core";
import "dotenv/config";
import "drizzle-orm/node-postgres";
import "drizzle-orm";
const saveLayoutFn_createServerFn_handler = createServerRpc("510293d7219a31853226fdd60f9b9d653de03fd39d3ee2dbe183869fa5a214f5", (opts, signal) => {
  return saveLayoutFn.__executeServer(opts, signal);
});
const saveLayoutFn = createServerFn({
  method: "POST"
}).inputValidator((data) => data).handler(saveLayoutFn_createServerFn_handler, async ({
  data
}) => {
  await saveLayout("default", data.order, data.hidden);
  return {
    success: true
  };
});
export {
  saveLayoutFn_createServerFn_handler
};
