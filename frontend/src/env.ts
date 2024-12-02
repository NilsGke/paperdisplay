import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

console.log(parseInt(import.meta.env.VITE_CANVAS_HEIGHT));

export const env = createEnv({
  isServer: false,

  /**
   * The prefix that client-side variables must have. This is enforced both at
   * a type-level and at runtime.
   */
  clientPrefix: "VITE_",

  client: {
    VITE_HOST: z.string(),
    VITE_PORT: z.number(),
    VITE_DEV_PORT: z.number(),
    VITE_URL: z.string().url(),
    VITE_CANVAS_HEIGHT: z.number(),
    VITE_CANVAS_WIDTH: z.number(),
  },

  /**
   * What object holds the environment variables at runtime. This is usually
   * `process.env` or `import.meta.env`.
   */
  runtimeEnv: {
    VITE_HOST: import.meta.env.VITE_HOST,
    VITE_PORT: parseInt(import.meta.env.VITE_PORT),
    VITE_DEV_PORT: 5173,
    VITE_URL: `http://${import.meta.env.VITE_HOST}:${
      import.meta.env.VITE_PORT
    }`,
    VITE_CANVAS_HEIGHT: parseInt(import.meta.env.VITE_CANVAS_HEIGHT),
    VITE_CANVAS_WIDTH: parseInt(import.meta.env.VITE_CANVAS_WIDTH),
  },

  /**
   * By default, this library will feed the environment variables directly to
   * the Zod validator.
   *
   * This means that if you have an empty string for a value that is supposed
   * to be a number (e.g. `PORT=` in a ".env" file), Zod will incorrectly flag
   * it as a type mismatch violation. Additionally, if you have an empty string
   * for a value that is supposed to be a string with a default value (e.g.
   * `DOMAIN=` in an ".env" file), the default value will never be applied.
   *
   * In order to solve these issues, we recommend that all new projects
   * explicitly specify this option as true.
   */
  emptyStringAsUndefined: true,
});
