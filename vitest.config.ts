import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Integration specs shell out to `plugins` / native vendor CLIs, which can
    // take a while; unit specs finish well under this.
    testTimeout: 180_000,
    hookTimeout: 60_000,
    // Install specs mutate a sandboxed HOME and a shared plugin cache, so keep
    // the suite single-threaded to avoid cross-test interference.
    fileParallelism: false,
  },
});
