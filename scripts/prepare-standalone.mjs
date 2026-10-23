#!/usr/bin/env node
/**
 * Next.js `output: "standalone"` writes `.next/standalone/server.js` but does
 * not copy the browser bundles or `public/` into that folder. Without them the
 * server returns the HTML shell while every /_next/static/* request 404s, so
 * client components never hydrate (the map spinner never clears and all
 * interactive controls appear broken).
 *
 * This script mirrors the static assets into the standalone directory so
 * `node .next/standalone/server.js` (and `npm start`) serves a working app.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const standalone = path.join(root, ".next", "standalone");
const serverEntry = path.join(standalone, "server.js");

if (!fs.existsSync(serverEntry)) {
  console.error(
    "[prepare-standalone] .next/standalone/server.js not found. Run `next build` first."
  );
  process.exit(1);
}

function copyInto(source, destination, label) {
  if (!fs.existsSync(source)) {
    console.warn(`[prepare-standalone] Skipping ${label}: ${source} does not exist.`);
    return;
  }
  fs.rmSync(destination, { recursive: true, force: true });
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.cpSync(source, destination, { recursive: true });
  console.log(`[prepare-standalone] Copied ${label} -> ${path.relative(root, destination)}`);
}

copyInto(
  path.join(root, ".next", "static"),
  path.join(standalone, ".next", "static"),
  ".next/static"
);
copyInto(path.join(root, "public"), path.join(standalone, "public"), "public");
