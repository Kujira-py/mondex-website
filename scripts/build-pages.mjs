import { spawnSync } from "node:child_process";
import { writeFileSync, existsSync } from "node:fs";

const env = {
  ...process.env,
  GITHUB_PAGES: "true",
  NEXT_TELEMETRY_DISABLED: "1",
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "https://mondextcg.com",
  NEXT_PUBLIC_BASE_PATH: process.env.NEXT_PUBLIC_BASE_PATH ?? "",
};
const result = spawnSync(process.execPath, ["node_modules/next/dist/bin/next", "build", "--webpack"], { env, stdio: "inherit" });
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status || 1);
if (!existsSync("out/index.html") || !existsSync("out/de/index.html")) throw new Error("Static language pages were not exported.");
writeFileSync("out/.nojekyll", "");
