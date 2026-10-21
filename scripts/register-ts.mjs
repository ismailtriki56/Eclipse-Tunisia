/**
 * Registers the TypeScript resolution hook. Used as:
 *
 *   node --import ./scripts/register-ts.mjs scripts/verify-eclipse.ts
 */

import { register } from "node:module";

register("./ts-resolve-hook.mjs", import.meta.url);
