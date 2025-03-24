/**
 * The `Message` type defines the possible values that can be passed to a
 * terminal. It is recommended to keep all logic in creating the message inside
 * the terminal call so it can all be skipped if the log level will not be
 * logged.
 */
export type Message =
  | string
  | Promise<string>
  | (() => string | Promise<string>);

/**
 * The `TerminalFn` type defines the function signature. It is recommended to
 * not await this.
 */
export type TerminalFn = (x: Message) => Promise<void>;

/**
 * The `Terminal` interface defines the methods that may exist on a terminal.
 */
export interface Terminal {
  critical?: TerminalFn;
  error?: TerminalFn;
  warn?: TerminalFn;
  info?: TerminalFn;
  debug?: TerminalFn;
  trace?: TerminalFn;
}

/**
 * The values of the `LogLevel` enum is used to set the log level of a given
 * terminal via the environment variables. Values greater than the log level set
 * will be excluded.
 * ```
 * LOG_LEVEL=3
 * ```
 */
export const enum LogLevel {
  NONE = 0,
  CRITICAL = 1,
  ERROR = 2,
  WARN = 3,
  INFO = 4,
  DEBUG = 5,
  TRACE = 6,
}
