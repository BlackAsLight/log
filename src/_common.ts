// deno-lint-ignore-file no-fallthrough
import { LogLevel, type Message, type Terminal } from "./types.ts";

const stdout = "Deno" in globalThis
  // deno-lint-ignore no-explicit-any
  ? (globalThis as any).Deno.stdout
  // deno-lint-ignore no-explicit-any
  : (globalThis as any).process.stdout;

async function getLevel(name: string, fallback: LogLevel): Promise<LogLevel> {
  let level: LogLevel;
  if ("Deno" in globalThis) {
    // deno-lint-ignore no-explicit-any
    const state = (await (globalThis as any)
      .Deno
      .permissions
      .query({ name: "env", variable: name }))
      .state;
    if (state !== "granted") return fallback;
    // deno-lint-ignore no-explicit-any
    level = Number((globalThis as any).Deno.env.get(name));
  } else if ("process" in globalThis) {
    // deno-lint-ignore no-explicit-any
    level = Number((globalThis as any).process.env[name]);
  } else return fallback;
  if (Number.isNaN(level) || level < LogLevel.NONE || LogLevel.TRACE < level) {
    return fallback;
  }
  return level;
}

export async function setLevel(
  name: string,
  fallback: LogLevel,
  terminal: Terminal,
): Promise<Terminal> {
  switch (await getLevel(name, fallback)) {
    case LogLevel.NONE:
      terminal.critical = undefined;
    case LogLevel.CRITICAL:
      terminal.error = undefined;
    case LogLevel.ERROR:
      terminal.warn = undefined;
    case LogLevel.WARN:
      terminal.info = undefined;
    case LogLevel.INFO:
      terminal.debug = undefined;
    case LogLevel.DEBUG:
      terminal.trace = undefined;
  }
  return terminal;
}

async function stringify(x: Message): Promise<string> {
  x = await x;
  return typeof x === "string" ? x : await x();
}

const encoder = new TextEncoder();
export async function write(
  prefix: string,
  x: Message,
): Promise<void> {
  await stdout.write(encoder.encode(
    "~[" +
      Temporal.Now.instant().toString() +
      "] " +
      prefix +
      await stringify(x) +
      "\n",
  ));
}
