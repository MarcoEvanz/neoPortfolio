/**
 * Scans public/flash/ for .swf files and public/gba/ for ROM files,
 * then writes index.json manifests for each.
 * Run this before build, or add to your build script.
 */
const fs = require("fs");
const path = require("path");

// Color palette for game cards
const colors = [
  "from-amber-600 to-red-700",
  "from-blue-500 to-indigo-600",
  "from-emerald-500 to-teal-600",
  "from-purple-500 to-pink-600",
  "from-rose-500 to-red-600",
  "from-cyan-500 to-blue-600",
  "from-orange-500 to-yellow-600",
  "from-violet-500 to-purple-600",
];

function titleFromFilename(filename) {
  return filename
    .replace(/\.[^.]+$/, "") // strip any extension
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function generateManifest(dir, extensions, urlPrefix) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const files = fs.readdirSync(dir).filter((f) =>
    extensions.some((ext) => f.toLowerCase().endsWith(ext))
  );

  const items = files.map((file, i) => ({
    id: file.replace(/\.[^.]+$/, "").toLowerCase().replace(/\s+/g, "-"),
    title: titleFromFilename(file),
    url: `${urlPrefix}/${file}`,
    color: colors[i % colors.length],
  }));

  const outputFile = path.join(dir, "index.json");
  fs.writeFileSync(outputFile, JSON.stringify(items, null, 2));
  console.log(`Generated ${outputFile} with ${items.length} file(s)`);
}

// Flash games (.swf)
generateManifest(
  path.join(__dirname, "..", "public", "flash"),
  [".swf"],
  "/flash"
);

// GBA ROMs (.gba, .gb, .gbc)
generateManifest(
  path.join(__dirname, "..", "public", "gba"),
  [".gba", ".gb", ".gbc"],
  "/gba"
);

// NDS ROMs (.nds)
generateManifest(
  path.join(__dirname, "..", "public", "nds"),
  [".nds"],
  "/nds"
);

// NES ROMs (.nes)
generateManifest(
  path.join(__dirname, "..", "public", "nes"),
  [".nes"],
  "/nes"
);

// SNES ROMs (.sfc, .smc)
generateManifest(
  path.join(__dirname, "..", "public", "snes"),
  [".sfc", ".smc"],
  "/snes"
);

// N64 ROMs (.z64, .n64, .v64)
generateManifest(
  path.join(__dirname, "..", "public", "n64"),
  [".z64", ".n64", ".v64"],
  "/n64"
);

// 3DS ROMs (.3ds, .cci, .cxi)
generateManifest(
  path.join(__dirname, "..", "public", "3ds"),
  [".3ds", ".cci", ".cxi"],
  "/3ds"
);
