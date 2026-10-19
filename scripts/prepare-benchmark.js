import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";

// Generate the exact pre-optimization build without shipping a second bundle.
const source = execFileSync(
  "git",
  [
    "show",
    "e2fabee4de627259ac94779cfce2ce67ef21a58d:dist/leaflet-trackplayer.js",
  ],
  { cwd: new URL("..", import.meta.url) }
);
writeFileSync(new URL("../test/__tests__/baseline.local.js", import.meta.url), source);
