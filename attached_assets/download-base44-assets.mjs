/**
 * Trio Boys — Base44 asset downloader
 * Run with: node download-base44-assets.mjs
 * Requires Node 18+ (built-in fetch). Saves a zip of all images.
 */

import fs from "fs";
import path from "path";
import https from "https";
import { createWriteStream, mkdirSync } from "fs";

const API_KEY = "e262d5e5ff35422197e63ec093fdc1e4";

const ASSETS = [
  // Navbar / Footer logo
  { url: "https://media.db.com/images/public/6a30bf87c8bc35a71d08ae5f/e003c3074_1000012074.png",           dest: "logo/logo.png" },

  // Hero member headshots (db.app URLs)
  { url: "https://db.app/api/apps/6a30bf87c8bc35a71d08ae5f/files/mp/public/6a30bf87c8bc35a71d08ae5f/29ae4fa79_2.png",   dest: "members/2.png" },
  { url: "https://db.app/api/apps/6a30bf87c8bc35a71d08ae5f/files/mp/public/6a30bf87c8bc35a71d08ae5f/16a339ffb_3.png",   dest: "members/3.png" },
  { url: "https://db.app/api/apps/6a30bf87c8bc35a71d08ae5f/files/mp/public/6a30bf87c8bc35a71d08ae5f/64de9b5d0_4.png",   dest: "members/4.png" },
  { url: "https://db.app/api/apps/6a30bf87c8bc35a71d08ae5f/files/mp/public/6a30bf87c8bc35a71d08ae5f/909838026_5.png",   dest: "members/5.png" },
  { url: "https://db.app/api/apps/6a30bf87c8bc35a71d08ae5f/files/mp/public/6a30bf87c8bc35a71d08ae5f/1287e29c5_6.png",   dest: "members/6.png" },
  { url: "https://db.app/api/apps/6a30bf87c8bc35a71d08ae5f/files/mp/public/6a30bf87c8bc35a71d08ae5f/f9befa98a_7.png",   dest: "members/7.png" },

  // Video thumbnails
  { url: "https://media.db.com/images/public/6a30bf87c8bc35a71d08ae5f/ec14d1943_generated_728bda86.png",    dest: "videos/thumb1.png" },
  { url: "https://media.db.com/images/public/6a30bf87c8bc35a71d08ae5f/236d2be9e_generated_a37a354c.png",    dest: "videos/thumb2.png" },
  { url: "https://media.db.com/images/public/6a30bf87c8bc35a71d08ae5f/edbbec220_generated_cc95369b.png",    dest: "videos/thumb3.png" },
  { url: "https://media.db.com/images/public/6a30bf87c8bc35a71d08ae5f/107ff504f_generated_469f5133.png",    dest: "videos/thumb4.png" },

  // Merch product images
  { url: "https://media.db.com/images/public/6a30bf87c8bc35a71d08ae5f/1553ea0e8_generated_50ea2045.png",    dest: "merch/merch1.png" },
  { url: "https://media.db.com/images/public/6a30bf87c8bc35a71d08ae5f/4688224f8_generated_252b84f3.png",    dest: "merch/merch2.png" },
  { url: "https://media.db.com/images/public/6a30bf87c8bc35a71d08ae5f/1c8cc0138_generated_f5c43333.png",    dest: "merch/merch3.png" },

  // Project Summer daily photos
  { url: "https://media.db.com/images/public/6a30bf87c8bc35a71d08ae5f/55dc5a1ad_PXL_20260627_1504127832.jpg",   dest: "project-summer/day1.jpg" },
  { url: "https://media.db.com/images/public/6a30bf87c8bc35a71d08ae5f/3860eee7c_PXL_20260629_022528061.jpg",   dest: "project-summer/day2.jpg" },
  { url: "https://media.db.com/images/public/6a30bf87c8bc35a71d08ae5f/8e5c97466_PXL_20260629_233024104.jpg",   dest: "project-summer/day3.jpg" },
  { url: "https://media.db.com/images/public/6a30bf87c8bc35a71d08ae5f/2c8e96232_PXL_20260630_211347082MP.jpg", dest: "project-summer/day4.jpg" },
  { url: "https://media.db.com/images/public/6a30bf87c8bc35a71d08ae5f/142414c8e_PXL_20260701_193433772MP.jpg", dest: "project-summer/day5.jpg" },
  { url: "https://media.db.com/images/public/6a30bf87c8bc35a71d08ae5f/30e085ec9_PXL_20260702_183019556MP.jpg", dest: "project-summer/day6.jpg" },
  { url: "https://media.db.com/images/public/6a30bf87c8bc35a71d08ae5f/8dee026a9_PXL_20260703_172909337MP.jpg", dest: "project-summer/day7.jpg" },
  { url: "https://media.db.com/images/public/6a30bf87c8bc35a71d08ae5f/b17defeb4_PXL_20260703_164513803.jpg",   dest: "project-summer/day8.jpg" },
  { url: "https://media.db.com/images/public/6a30bf87c8bc35a71d08ae5f/d1649a2fb_PXL_20260703_172912078MP.jpg", dest: "project-summer/day9.jpg" },
  { url: "https://media.db.com/images/public/6a30bf87c8bc35a71d08ae5f/b9a8afd28_PXL_20260703_160937532MP.jpg", dest: "project-summer/day10.jpg" },
  { url: "https://media.db.com/images/public/6a30bf87c8bc35a71d08ae5f/3a74db386_PXL_20260703_191932902.jpg",   dest: "project-summer/day11.jpg" },
  { url: "https://media.db.com/images/public/6a30bf87c8bc35a71d08ae5f/0e9e8bfee_PXL_20260703_195954468.jpg",   dest: "project-summer/day12.jpg" },
  { url: "https://media.db.com/images/public/6a30bf87c8bc35a71d08ae5f/9df0147f9_PXL_20260703_230946901MP.jpg", dest: "project-summer/day13.jpg" },
];

const OUT_DIR = "./trio-boys-assets";

async function download(url, dest) {
  const fullDest = path.join(OUT_DIR, dest);
  mkdirSync(path.dirname(fullDest), { recursive: true });

  const res = await fetch(url, {
    headers: { api_key: API_KEY },
  });

  if (!res.ok) {
    console.log(`  ✗ ${dest} — HTTP ${res.status}`);
    return false;
  }

  const buf = await res.arrayBuffer();
  fs.writeFileSync(fullDest, Buffer.from(buf));
  console.log(`  ✓ ${dest}`);
  return true;
}

async function main() {
  console.log(`Downloading ${ASSETS.length} assets to ./${OUT_DIR} ...\n`);
  mkdirSync(OUT_DIR, { recursive: true });

  let ok = 0, fail = 0;
  for (const asset of ASSETS) {
    const success = await download(asset.url, asset.dest);
    success ? ok++ : fail++;
  }

  console.log(`\nDone: ${ok} downloaded, ${fail} failed.`);
  if (ok > 0) {
    console.log(`\nNext: zip the "${OUT_DIR}" folder and upload it to Replit.`);
    console.log(`  macOS/Linux:  zip -r trio-boys-assets.zip ${OUT_DIR}`);
    console.log(`  Windows:      Right-click the folder → Send to → Compressed (zipped) folder`);
  }
}

main().catch(console.error);
