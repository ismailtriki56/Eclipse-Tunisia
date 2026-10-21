/**
 * Module resolution hook that lets Node run the TypeScript sources in
 * `src/` directly, using the same extensionless import style that the
 * Next.js build uses.
 *
 * Node can execute `.ts` files natively (type stripping), but its ESM
 * resolver requires explicit file extensions. This hook restores the
 * extensionless behaviour so the verification scripts can import the very
 * same modules the application uses, with no build step and no duplicated
 * logic.
 */

import { existsSync } from "node:fs";
import { dirname, resolve as resolvePath } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const EXTENSIONS = [".ts", ".tsx", ".mts", ".js", ".mjs"];

export function resolve(specifier, context, nextResolve) {
  const isRelative = specifier.startsWith("./") || specifier.startsWith("../");
  const hasExtension = /\.[cm]?[jt]sx?$/.test(specifier);

  if (isRelative && !hasExtension && context.parentURL) {
    const parentDirectory = dirname(fileURLToPath(context.parentURL));
    for (const extension of EXTENSIONS) {
      const candidate = resolvePath(parentDirectory, `${specifier}${extension}`);
      if (existsSync(candidate)) {
        return nextResolve(pathToFileURL(candidate).href, context);
      }
    }
  }

  return nextResolve(specifier, context);
}
