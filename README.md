# Log

A lightweight logging library exploring a new paradigm for handling excluded
logs. It's use is designed for both application developers and library
developers. Optional chaining syntax is used to handle excluding logs, allowing
for more efficient logging, especially when dealing with expensive to compute
log messages.

The log level is set once at the beginning of the application via an environment
variable or a meta tag and cannot be changed during runtime. The default log
level for `jsr:@doctor/log/app` is `info` and the default log level for
`jsr:@doctor/log/lib` is `none`. If the environment variable is not set; set to
an invalid value; or permissions to read the variable is not granted from the
start, this library will fall back to its default log level.

This library makes optional use of the `Temporal` API if it is available for its
timestamps, otherwise falls back to `Date`.

This library works in Deno, NodeJS and the browser. To use it in the browser, a
meta tag should exist before this code runs.

## Example

### Application Usage

`LOG_LEVEL=4 deno run -E='LOG_LEVEL' --unstable-temporal main.ts`
`<meta name="doctor/log" data-name="LOG_LEVEL" data-level="4">`

```ts
import { terminal } from "@doctor/log/app";

terminal.info?.("Hello World!");
// ~[TIMESTAMP] [INFO] Hello World!
```

### Library Usage

`ABC_XYZ=4 deno run -E='ABC_XYZ' --unstable-temporal lib.ts`
`<meta name="doctor/log" data-name="ABC_XYZ" data-level="4">`

```ts
import { createTerminal } from "@doctor/log/lib";

const terminal = await createTerminal("my-app", "ABC_XYZ");
terminal.info?.("Hello World!");
// ~[TIMESTAMP] [INFO] [my-app] Hello World!
```
