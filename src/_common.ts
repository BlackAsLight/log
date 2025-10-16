// deno-lint-ignore-file no-fallthrough no-explicit-any
import { LogLevel, type Message, type Terminal } from "./types.ts";

export const timeStamp: () => string = "Temporal" in globalThis
  ? function (): string {
    return (globalThis as any).Temporal.Now.instant().toString();
  }
  : function (): string {
    return new globalThis.Date().toISOString();
  };

export const write: (x: string) => Promise<void> = "Deno" in globalThis
  ? function (): (x: string) => Promise<void> {
    const encoder = new TextEncoder();
    return async function (x): Promise<void> {
      await (globalThis as any).Deno.stdout.write(encoder.encode(x + "\n"));
    };
  }()
  : "process" in globalThis
  ? async function (x): Promise<void> {
    await (globalThis as any).process.stdout.write(x + "\n");
  }
  // deno-lint-ignore require-await
  : async function (x): Promise<void> {
    globalThis.console.log(x);
  };

async function getLevel(name: string, fallback: LogLevel): Promise<LogLevel> {
  let level: LogLevel;
  if ("Deno" in globalThis) {
    const { state } = await (globalThis as any)
      .Deno
      .permissions
      .query({ name: "env", variable: name });
    if (state !== "granted") return fallback;
    level = Number((globalThis as any).Deno.env.get(name));
  } else if ("process" in globalThis) {
    level = Number((globalThis as any).process.env[name]);
  } else if ("document" in globalThis) {
    level = Number(
      (globalThis as any)
        .document
        .querySelector(`meta[name="doctor/log"][data-name="${name}"]`)
        ?.dataset
        .level,
    );
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

export async function stringify(x: Message): Promise<string> {
  x = await x;
  return typeof x === "string" ? x : await x();
}
