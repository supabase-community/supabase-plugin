import { execFileSync } from "node:child_process";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const pluginsBin = join(repoRoot, "node_modules", ".bin", "plugins");

function hasBinary(name: string): boolean {
  try {
    execFileSync(process.platform === "win32" ? "where" : "which", [name], { stdio: "pipe" });
    return true;
  } catch {
    return false;
  }
}

/** Run a command, returning combined output; throws with output on failure. */
function run(cmd: string, args: string[], env: NodeJS.ProcessEnv): string {
  try {
    return execFileSync(cmd, args, {
      encoding: "utf-8",
      stdio: "pipe",
      env: { ...process.env, NO_COLOR: "1", DO_NOT_TRACK: "1", ...env },
    });
  } catch (err: any) {
    throw new Error(`${cmd} ${args.join(" ")} failed:\n${err.stdout ?? ""}${err.stderr ?? ""}`);
  }
}

/** Fresh isolated HOME (and Kimi store) so installs never touch the real machine. */
function sandboxEnv(): NodeJS.ProcessEnv {
  const home = mkdtempSync(join(tmpdir(), "supabase-plugin-test-"));
  return { HOME: home, KIMI_CODE_HOME: join(home, ".kimi-code") };
}

/** Force-install the supabase plugin for one vendor via the plugins CLI. */
function installViaPluginsCli(target: string): void {
  const out = run(pluginsBin, ["add", repoRoot, "--target", target, "--yes"], sandboxEnv());
  expect(out).toMatch(/Installed/);
}

describe("installable via the plugins CLI", () => {
  it("claude-code", () => installViaPluginsCli("claude-code"));

  it("cursor", () => installViaPluginsCli("cursor"));

  it("codex", () => installViaPluginsCli("codex"));

  it("kimi", () => installViaPluginsCli("kimi"));

  // Copilot installs through its native CLI; skip when absent (CI provisions
  // it, local runs without it stay green).
  it.skipIf(!hasBinary("copilot"))("github-copilot", () => installViaPluginsCli("github-copilot"));
});
