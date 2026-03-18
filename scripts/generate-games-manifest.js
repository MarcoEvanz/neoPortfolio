/**
 * Scans public/games/ for .swf files and public/roms/ for ROM files,
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

function generateManifest(dir, extensions, urlPrefix, extraItems = []) {
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

  // Append externally-hosted items (e.g. GitHub Release assets)
  extraItems.forEach((item, i) => {
    items.push({
      id: item.id || item.title.toLowerCase().replace(/\s+/g, "-"),
      title: item.title,
      url: item.url, // absolute URL, not prefixed with urlPrefix
      color: item.color || colors[(items.length + i) % colors.length],
    });
  });

  const outputFile = path.join(dir, "index.json");
  fs.writeFileSync(outputFile, JSON.stringify(items, null, 2));
  console.log(`Generated ${outputFile} with ${items.length} file(s)`);
}

// Flash games (.swf)
generateManifest(
  path.join(__dirname, "..", "public", "games"),
  [".swf"],
  "/games"
);

// GBA ROMs (.gba, .gb, .gbc)
generateManifest(
  path.join(__dirname, "..", "public", "roms"),
  [".gba", ".gb", ".gbc"],
  "/roms"
);

// NDS ROMs (.nds) — local files + large ROMs hosted on GitHub Releases
// Large ROMs (>100MB) are gitignored and hosted as release assets instead.
// The manifest script skips gitignored files (they won't be in the dir on CI),
// so we add them as external entries with absolute URLs.
const RELEASE_BASE = "https://github.com/MarcoEvanz/neoPortfolio/releases/download/roms-v1";
const ndsExternalRoms = [
  { title: "Pokemon Black", url: `${RELEASE_BASE}/pokemon_black.nds` },
  { title: "Pokemon White", url: `${RELEASE_BASE}/pokemon_white.nds` },
  { title: "Pokemon Heart Gold", url: `${RELEASE_BASE}/pokemon_heart_gold.nds` },
  { title: "Pokemon Soul Silver", url: `${RELEASE_BASE}/pokemon_soul_silver.nds` },
];
// Filter out external ROMs that also exist locally (dev environment) to avoid duplicates
const ndsDir = path.join(__dirname, "..", "public", "nds");
const localNdsFiles = fs.existsSync(ndsDir)
  ? fs.readdirSync(ndsDir).map((f) => f.toLowerCase())
  : [];
const ndsExtras = ndsExternalRoms.filter(
  (r) => !localNdsFiles.includes(r.url.split("/").pop().toLowerCase())
);
generateManifest(ndsDir, [".nds"], "/nds", ndsExtras);

// 3DS ROMs (.3ds, .cci, .cxi)
generateManifest(
  path.join(__dirname, "..", "public", "3ds"),
  [".3ds", ".cci", ".cxi"],
  "/3ds"
);
