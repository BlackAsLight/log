/**
 * A lightweight logging library exploring a new paradigm for handling excluded
 * logs.
 * - This package writes directly to stdout so to save the logs, simply pipe the
 * output to a file or another process.
 * - To set the log level, set the environment variable `LOG_LEVEL` to a
 * number of {@link LogLevel}, and all levels greater than the log level will be
 * excluded.
 * - If no environment variable or meta tag is set; it is set to an invalid
 * value; or permissions to read the variable is not granted from the start;
 * the log level is set to `info`.
 * - Optional chaining syntax `?.` is used to handle logs that will be excluded.
 * This allows the values that would be passed into the log function to be
 * entirely skipped over instead of calculating it and then discarding the
 * result. It also removes the need for having separate handling for expensive
 * to compute logs.
 * - This package makes optional use of the `Temporal` API if it is available
 * for its timestamps, otherwise falls back to `Date`.
 *
 * [!IMPORTANT]
 * This module is to be used by application developers and not library
 * developers. See `@doctor/log/lib` for library usage.
 *
 * @example Basic Usage
 * ```ts
 * import { terminal } from "@doctor/log/app";
 *
 * terminal.info?.("Hello World!");
 * // ~[TIMESTAMP] [INFO] Hello World!
 * ```
 *
 * @module
 */

import { setLevel, stringify as s, timeStamp as t, write } from "./_common.ts";
import { LogLevel, type Terminal } from "./types.ts";

/**
 * The `terminal` object is to be used by application developers. Optional
 * chaining syntax `?.` is required to be used. These functions return a
 * `Promise<void>`, and it is not recommended to await them.
 *
 * @example Basic Usage
 * ```ts
 * import { terminal } from "@doctor/log/app";
 *
 * terminal.info?.("Hello World!");
 * // ~[TIMESTAMP] [INFO] Hello World!
 * ```
 */
export const terminal: Terminal = await setLevel(
  "LOG_LEVEL",
  LogLevel.INFO,
  {
    async critical(x): Promise<void> {
      await write("~[" + t() + "] [CRITICAL] " + await s(x));
    },
    async error(x): Promise<void> {
      await write("~[" + t() + "] [ERROR] " + await s(x));
    },
    async warn(x): Promise<void> {
      await write("~[" + t() + "] [WARN] " + await s(x));
    },
    async info(x): Promise<void> {
      await write("~[" + t() + "] [INFO] " + await s(x));
    },
    async debug(x): Promise<void> {
      await write("~[" + t() + "] [DEBUG] " + await s(x));
    },
    async trace(x): Promise<void> {
      await write("~[" + t() + "] [TRACE] " + await s(x));
    },
  },
);
