/**
 * A lightweight logging library exploring a new paradigm for handling excluded
 * logs.
 * - This package writes directly to stdout so to save the logs, the application
 * developer simply needs to pipe the output to a file or process.
 * - The log level is set via an environment variable or meta tag. As the
 * library developer, you get to decide what the variable is called.
 * - If no environment variable or meta tag is set; it is set to an invalid
 * value; or permissions to read the variable is not granted from the start;
 * the log level is set to `none`.
 * - Optional chaining syntax `?.` is used to handle logs that will be excluded.
 * This allows the values that would be passed into the log function to be
 * entirely skipped over instead of calculating it and then discarding the
 * result. It also removes the need for having separate handling for expensive
 * to compute logs.
 * - This package makes optional use of the `Temporal` API if it is available
 * for its timestamps, otherwise falls back to `Date`.
 *
 * [!IMPORTANT]
 * This module is to be used by library developers and not application
 * developers. See `@doctor/log/app` for application usage.
 *
 * @example Basic Usage
 * ```ts
 * import { createTerminal } from "@doctor/log/lib";
 *
 * const terminal = await createTerminal("my-app", "ENV_NAME");
 * terminal.info?.("Hello World!");
 * // ~[TIMESTAMP] [INFO] [my-app] Hello World!
 * ```
 *
 * @module
 */

import { setLevel, stringify as s, timeStamp as t, write } from "./_common.ts";
import { LogLevel, type Terminal } from "./types.ts";

/**
 * The `createTerminal` function creates a terminal object is to be used by
 * library developers. Optional chaining syntax `?.` is required to be used.
 * These functions return a `Promise<void>`, and it is not recommended to await
 * them.
 *
 * @param name The name to appear in the logs.
 * @param env The environment variable used to set the log level.
 * @returns A terminal object.
 *
 * @example Basic Usage
 * ```ts
 * import { createTerminal } from "@doctor/log/lib";
 *
 * const terminal = await createTerminal("my-app", "ENV_NAME");
 * terminal.info?.("Hello World!");
 * // ~[TIMESTAMP] [INFO] [my-app] Hello World!
 * ```
 */
export async function createTerminal(
  name: string,
  env: string,
): Promise<Terminal> {
  return await setLevel(
    env,
    LogLevel.NONE,
    {
      async critical(x): Promise<void> {
        await write("~[" + t() + "] [CRITICAL] [" + name + "] " + await s(x));
      },
      async error(x): Promise<void> {
        await write("~[" + t() + "] [ERROR] [" + name + "] " + await s(x));
      },
      async warn(x): Promise<void> {
        await write("~[" + t() + "] [WARN] [" + name + "] " + await s(x));
      },
      async info(x): Promise<void> {
        await write("~[" + t() + "] [INFO] [" + name + "] " + await s(x));
      },
      async debug(x): Promise<void> {
        await write("~[" + t() + "] [DEBUG] [" + name + "] " + await s(x));
      },
      async trace(x): Promise<void> {
        await write("~[" + t() + "] [TRACE] [" + name + "] " + await s(x));
      },
    },
  );
}
