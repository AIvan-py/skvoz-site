import { copyFile, mkdir, stat } from "node:fs/promises";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";

const source = new URL("../presentation/index.html", import.meta.url);
const targetDir = new URL("../downloads/", import.meta.url);
const target = new URL("../downloads/skvoz-orders-2026-07.html", import.meta.url);

await mkdir(targetDir, { recursive: true });
await copyFile(source, target);

const bytes = await readFile(target);
const info = await stat(target);
const hash = createHash("sha256").update(bytes).digest("hex");

console.log(`presentation: ${info.size} bytes`);
console.log(`sha256: ${hash}`);
