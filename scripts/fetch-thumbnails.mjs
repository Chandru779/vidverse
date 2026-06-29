import { mkdir, writeFile, unlink } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const thumbsDir = path.join(root, "public", "images", "thumbs");

const thumbnails = [
  { file: "big-buck-bunny.jpg", youtubeId: "YE7VzlLtp-4" },
  { file: "sintel.jpg", youtubeId: "eRsGyueVLvQ" },
  { file: "tears-of-steel.jpg", youtubeId: "R6MlUcmOul8" },
  { file: "elephants-dream.jpg", youtubeId: "TLkA0RELQ1g" },
  { file: "me-at-the-zoo.jpg", youtubeId: "jNQXAC9IVRw" },
  { file: "keyboard-cat.jpg", youtubeId: "J---aiyznGQ" },
  { file: "gangnam-style.jpg", youtubeId: "9bZkp7q19f0" },
  { file: "darude-sandstorm.jpg", youtubeId: "y6120QOlsfU" },
];

const removed = [
  "full-hd-landscape.jpg",
  "hd-widescreen.jpg",
  "curious-cat.jpg",
];

await mkdir(thumbsDir, { recursive: true });

for (const { file, youtubeId } of thumbnails) {
  const url = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
  const res = await fetch(url);
  if (!res.ok) {
    console.error(`Failed: ${file} (${res.status})`);
    continue;
  }
  const buffer = Buffer.from(await res.arrayBuffer());
  await writeFile(path.join(thumbsDir, file), buffer);
  console.log(`Saved ${file}`);
}

for (const file of removed) {
  try {
    await unlink(path.join(thumbsDir, file));
    console.log(`Removed ${file}`);
  } catch {
    // already gone
  }
}
