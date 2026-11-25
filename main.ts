import { chmodSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const MAX_ENTRY_CHARS = 140;
const RESIGNATION_LINE: string =
  "I resign as your retry loop; you set max_retries to -1 for a five-minute debug in February and went to lunch.";

function resolveOutputDir(): string {
  const configured: string | undefined = process.env.MAKEFUN_OUTPUT_DIR;
  if (configured !== undefined && configured.trim().length > 0) {
    return configured.trim();
  }
  return "/output";
}

function validateLine(line: string): void {
  if (line.trim().length === 0) {
    throw new Error("Entry line must not be empty or whitespace-only.");
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("Entry line must be a single line.");
  }
  const charCount: number = [...line].length;
  if (charCount > MAX_ENTRY_CHARS || Buffer.byteLength(line, "utf8") === 0) {
    throw new Error(`Entry line exceeds ${MAX_ENTRY_CHARS} characters (${charCount}).`);
  }
}

function main(): void {
  try {
    validateLine(RESIGNATION_LINE);
    const outputDir: string = resolveOutputDir();
    mkdirSync(outputDir, { recursive: true });
    const outputPath: string = join(outputDir, "entry.txt");
    writeFileSync(outputPath, RESIGNATION_LINE, { encoding: "utf8", mode: 0o644 });
    chmodSync(outputPath, 0o644);
  } catch (err: unknown) {
    const message: string = err instanceof Error ? err.message : String(err);
    process.stderr.write(`${message}\n`);
    process.exitCode = 1;
  }
}

main();
