/**
 * A lightweight logging library exploring a new paradigm for handling excluded
 * logs.
 * - This package writes directly to stdout so to save the logs, the application
 * developer simply needs to pipe the output to a file or process.
 * - The log level is set via an environment variable. As the library developer,
 you get to decide what the variable is called.
 * - If no environment variable is set by the application developer; it is set
 to an invalid value; or permissions to read the variable is not granted from
 the start; the log level is set to `none`.
 * - Optional chaining syntax `?.` is used to handle logs that will be excluded.
 * This allows the values that would be passed into the log function to be
 * entirely skipped over instead of calculating it and then discarding the
 * result. It also removes the need for having separate handling for expensive
 * to compute logs.
 * - This package uses the Temporal API so `--unstable-temporal` is required at
 * the time of writing this.
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

import { setLevel, write } from "./_common.ts";
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
        await write("[CRITICAL] [" + name + "] ", x);
      },
      async error(x): Promise<void> {
        await write("[ERROR] [" + name + "] ", x);
      },
      async warn(x): Promise<void> {
        await write("[WARN] [" + name + "] ", x);
      },
      async info(x): Promise<void> {
        await write("[INFO] [" + name + "] ", x);
      },
      async debug(x): Promise<void> {
        await write("[DEBUG] [" + name + "] ", x);
      },
      async trace(x): Promise<void> {
        await write("[TRACE] [" + name + "] ", x);
      },
    },
  );
}
