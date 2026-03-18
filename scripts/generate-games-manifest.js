/**
 * Scans public/games/ for .swf files and writes public/games/index.json
 * Run this before build, or add to your build script.
 */
const fs = require("fs");
const path = require("path");

const gamesDir = path.join(__dirname, "..", "public", "games");
const outputFile = path.join(gamesDir, "index.json");

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
    .replace(/\.swf$/i, "")
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// Ensure directory exists
if (!fs.existsSync(gamesDir)) {
  fs.mkdirSync(gamesDir, { recursive: true });
}

const files = fs.readdirSync(gamesDir).filter((f) => f.toLowerCase().endsWith(".swf"));

const games = files.map((file, i) => ({
  id: file.replace(/\.swf$/i, "").toLowerCase().replace(/\s+/g, "-"),
  title: titleFromFilename(file),
  url: `/games/${file}`,
  color: colors[i % colors.length],
}));

fs.writeFileSync(outputFile, JSON.stringify(games, null, 2));
console.log(`Generated ${outputFile} with ${games.length} game(s)`);
