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

  // Build a set of filenames that have external URLs (e.g. Google Drive)
  const externalFilenames = new Set(
    extraItems.map((item) => (item.localFile || item.url.split("/").pop()).toLowerCase())
  );

  const files = fs.readdirSync(dir).filter((f) =>
    extensions.some((ext) => f.toLowerCase().endsWith(ext))
  );

  // Only include local entries for files that DON'T have an external URL
  const items = files
    .filter((f) => !externalFilenames.has(f.toLowerCase()))
    .map((file, i) => ({
      id: file.replace(/\.[^.]+$/, "").toLowerCase().replace(/\s+/g, "-"),
      title: titleFromFilename(file),
      url: `${urlPrefix}/${file}`,
      color: colors[i % colors.length],
    }));

  // Always append externally-hosted items (e.g. GitHub Release assets)
  extraItems.forEach((item, i) => {
    items.push({
      id: item.id || item.title.toLowerCase().replace(/\s+/g, "-"),
      title: item.title,
      url: item.url,
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

// NDS ROMs (.nds) — local files + large ROMs hosted on Google Drive
// Large ROMs (>100MB) are gitignored and hosted on Google Drive instead.
// Google Drive usercontent URLs support CORS (Access-Control-Allow-Origin: *).
function gdriveUrl(fileId) {
  return `https://drive.usercontent.google.com/download?id=${fileId}&export=download&confirm=t`;
}
const ndsExternalRoms = [
  { title: "Pokemon Platinum", url: gdriveUrl("1ZLBFr_k9A65nSpPLS7QJK7HVzJbbMkbN"), localFile: "pokemon_platinum.nds" },
  { title: "Pokemon Black", url: gdriveUrl("1UqtuIxlMr85CrFVjWrNUYv6EWW7IBaOc"), localFile: "pokemon_black.nds" },
  { title: "Pokemon White", url: gdriveUrl("1gndesKw46YORQdsIJA5o2DZI6ckENPlE"), localFile: "pokemon_white.nds" },
  { title: "Pokemon Heart Gold", url: gdriveUrl("13d_gVOIi7_55DzptzGpPoMMN733V0MnW"), localFile: "pokemon_heart_gold.nds" },
  { title: "Pokemon Soul Silver", url: gdriveUrl("1VLkPZbNdnTlSIzs4FpIPGovJzbgjlIDA"), localFile: "pokemon_soul_silver.nds" },
  { title: "Pokemon Black 2", url: gdriveUrl("19B7l-dBnGt4rZFKba7rbJjDZKOWZEfwt"), localFile: "pokemon_black_2.nds" },
  { title: "Pokemon White 2", url: gdriveUrl("1tuk22YT_rzeWpMPmxY1gQhb5b0YoqzTa"), localFile: "pokemon_white_2.nds" },
];
generateManifest(
  path.join(__dirname, "..", "public", "nds"),
  [".nds"],
  "/nds",
  ndsExternalRoms
);

// 3DS ROMs (.3ds, .cci, .cxi)
generateManifest(
  path.join(__dirname, "..", "public", "3ds"),
  [".3ds", ".cci", ".cxi"],
  "/3ds"
);
