// Regenera app/icon.png, app/apple-icon.png y app/favicon.ico desde public/ragfly_isotipo.png
import sharp from "sharp";
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "public", "ragfly_isotipo.png");
const appDir = join(root, "app");

async function png(size) {
  return sharp(src).resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
}

function buildIco(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  const entries = [];
  let offset = 6 + images.length * 16;
  for (const { size, data } of images) {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0);
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt8(0, 2);
    e.writeUInt8(0, 3);
    e.writeUInt16LE(1, 4);
    e.writeUInt16LE(32, 6);
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    entries.push(e);
    offset += data.length;
  }
  return Buffer.concat([header, ...entries, ...images.map((i) => i.data)]);
}

await writeFile(join(appDir, "icon.png"), await png(512));
await writeFile(join(appDir, "apple-icon.png"), await png(180));
const ico = buildIco([{ size: 16, data: await png(16) }, { size: 32, data: await png(32) }]);
await writeFile(join(appDir, "favicon.ico"), ico);
console.log("OK: icon.png(512), apple-icon.png(180), favicon.ico(16+32)");
