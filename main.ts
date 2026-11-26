// Green Tests, Nothing Works: The Excuse Contest
// Writes one line (1-140 chars) to /output/entry.txt.
import { createHash } from "node:crypto";
import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";

const ENTRY =
  "All 412 tests passed. I just forgot to write the one that checks whether the app actually works.";

function validate(line: string): void {
  if (line.length < 1 || line.length > 140) {
    throw new Error(`entry must be 1-140 chars, got ${line.length}`);
  }
  if (!line.trim()) {
    throw new Error("entry must not be only whitespace");
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  if (line.charCodeAt(0) === 0xfeff) {
    throw new Error("entry must not start with a BOM");
  }
  for (const ch of line) {
    if (ch.charCodeAt(0) < 0x20 && ch !== "\t") {
      throw new Error("entry must not contain control characters");
    }
  }
  if (Buffer.byteLength(line, "utf8") > 560) {
    throw new Error("entry exceeds the 560-byte sanity cap");
  }
}

function emptyOutputDir(): void {
  mkdirSync("/output", { recursive: true });
  for (const name of readdirSync("/output")) {
    rmSync(`/output/${name}`, { recursive: true, force: true });
  }
}

validate(ENTRY);
emptyOutputDir();
writeFileSync("/output/entry.txt", ENTRY, "utf8");
const back = readFileSync("/output/entry.txt", "utf8");
if (back !== ENTRY) {
  throw new Error("read-back mismatch");
}
const sha = createHash("sha256").update(back, "utf8").digest("hex");
console.log(`wrote /output/entry.txt (${ENTRY.length} chars, sha256 ${sha})`);
