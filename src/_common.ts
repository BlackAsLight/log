// deno-lint-ignore-file no-fallthrough
import { LogLevel, type Message, type Terminal } from "./types.ts";

async function getLevel(name: string, fallback: LogLevel): Promise<LogLevel> {
  if (
    (await Deno.permissions.query({ name: "env", variable: name })).state !==
      "granted"
  ) return fallback;
  const level = Number(Deno.env.get(name));
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
  const buffer = encoder.encode(
    "~[" + Temporal.Now.instant().toString() + "] " + prefix +
      await stringify(x) + "\n",
  );
  for (let i = 0; i < buffer.length;) {
    i += await Deno.stdout.write(buffer.subarray(i));
  }
}
