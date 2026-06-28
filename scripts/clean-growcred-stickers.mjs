import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const inputDir = path.join(
  root,
  "public",
  "assets",
  "growcred",
  "03_genz_sticker_pack",
);
const brandInputDir = path.join(
  root,
  "public",
  "assets",
  "growcred",
  "01_first_batch_site_assets",
);
const outputDir = path.join(
  root,
  "public",
  "assets",
  "growcred",
  "processed",
  "stickers",
);
const brandOutputDir = path.join(
  root,
  "public",
  "assets",
  "growcred",
  "processed",
  "brand",
);

function isCheckerboardPixel(data, index) {
  const red = data[index];
  const green = data[index + 1];
  const blue = data[index + 2];
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);

  return max > 218 && max - min < 20;
}

function clearEdgeConnectedBackground(data, width, height) {
  const visited = new Uint8Array(width * height);
  const queue = [];

  function pushIfBackground(x, y) {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const pixel = y * width + x;
    if (visited[pixel]) return;
    const offset = pixel * 4;
    if (!isCheckerboardPixel(data, offset)) return;
    visited[pixel] = 1;
    queue.push(pixel);
  }

  for (let x = 0; x < width; x += 1) {
    pushIfBackground(x, 0);
    pushIfBackground(x, height - 1);
  }
  for (let y = 0; y < height; y += 1) {
    pushIfBackground(0, y);
    pushIfBackground(width - 1, y);
  }

  for (let cursor = 0; cursor < queue.length; cursor += 1) {
    const pixel = queue[cursor];
    const x = pixel % width;
    const y = Math.floor(pixel / width);
    pushIfBackground(x + 1, y);
    pushIfBackground(x - 1, y);
    pushIfBackground(x, y + 1);
    pushIfBackground(x, y - 1);
  }

  for (let pixel = 0; pixel < visited.length; pixel += 1) {
    if (!visited[pixel]) continue;
    const offset = pixel * 4;
    data[offset + 3] = 0;
  }
}

function clearAllCheckerboardPixels(data) {
  for (let offset = 0; offset < data.length; offset += 4) {
    if (isCheckerboardPixel(data, offset)) {
      data[offset + 3] = 0;
    }
  }
}

async function cleanImageFile({
  fileName,
  sourceDir,
  targetDir,
  width,
  backgroundMode = "edge",
}) {
  const inputPath = path.join(sourceDir, fileName);
  const baseName = path.basename(fileName, path.extname(fileName));
  const source = sharp(inputPath)
    .resize({ width, height: width, fit: "inside", withoutEnlargement: true })
    .ensureAlpha();
  const { data, info } = await source.raw().toBuffer({ resolveWithObject: true });
  const cleanData = Buffer.from(data);

  if (backgroundMode === "all") {
    clearAllCheckerboardPixels(cleanData);
  } else {
    clearEdgeConnectedBackground(cleanData, info.width, info.height);
  }

  const cleanImage = sharp(cleanData, {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4,
    },
  }).trim({
    background: { r: 0, g: 0, b: 0, alpha: 0 },
    threshold: 1,
  });

  await Promise.all([
    cleanImage
      .clone()
      .png({ compressionLevel: 9, palette: true })
      .toFile(path.join(targetDir, `${baseName}.png`)),
    cleanImage
      .clone()
      .webp({ quality: 88, alphaQuality: 90 })
      .toFile(path.join(targetDir, `${baseName}.webp`)),
  ]);
}

async function createDarkWordmarkVariant() {
  const inputPath = path.join(brandOutputDir, "01_growcred_full_logo_wordmark.png");
  const source = sharp(inputPath).ensureAlpha();
  const { data, info } = await source.raw().toBuffer({ resolveWithObject: true });
  const output = Buffer.from(data);
  const emblemGuardX = Math.round(info.width * 0.255);

  for (let offset = 0; offset < output.length; offset += 4) {
    const pixel = offset / 4;
    const x = pixel % info.width;
    if (x < emblemGuardX) continue;

    const red = output[offset];
    const green = output[offset + 1];
    const blue = output[offset + 2];
    const alpha = output[offset + 3];
    if (alpha === 0) continue;

    const luminance = 0.2126 * red + 0.7152 * green + 0.0722 * blue;
    if (luminance < 98 && green < 126) {
      output[offset] = 246;
      output[offset + 1] = 255;
      output[offset + 2] = 244;
    }
  }

  const darkImage = sharp(output, {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4,
    },
  });

  await Promise.all([
    darkImage
      .clone()
      .png({ compressionLevel: 9, palette: true })
      .toFile(path.join(brandOutputDir, "01_growcred_full_logo_wordmark_dark.png")),
    darkImage
      .clone()
      .webp({ quality: 90, alphaQuality: 94 })
      .toFile(path.join(brandOutputDir, "01_growcred_full_logo_wordmark_dark.webp")),
  ]);
}

await fs.mkdir(outputDir, { recursive: true });
await fs.mkdir(brandOutputDir, { recursive: true });

const files = (await fs.readdir(inputDir))
  .filter((fileName) => fileName.toLowerCase().endsWith(".png"))
  .sort();

await Promise.all(
  files.map((fileName) =>
    cleanImageFile({ fileName, sourceDir: inputDir, targetDir: outputDir, width: 640 }),
  ),
);

const brandFiles = [
  "01_growcred_full_logo_wordmark.png",
  "02_growcred_logo_emblem.png",
  "03_treecoin_gold_medallion.png",
];

await Promise.all(
  brandFiles.map((fileName) =>
    cleanImageFile({
      fileName,
      sourceDir: brandInputDir,
      targetDir: brandOutputDir,
      width: fileName.startsWith("01_") ? 1600 : 640,
      backgroundMode: "all",
    }),
  ),
);

await createDarkWordmarkVariant();

console.log(
  `Cleaned ${files.length} GrowCred stickers into ${outputDir} and ${brandFiles.length} brand assets plus dark logo variants into ${brandOutputDir}`,
);
