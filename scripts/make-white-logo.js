// One-off: build a white, transparent-background version of the brand logo
// for use on colored (orange/dark) headers in the mobile app.
const path = require("path");
const sharp = require("sharp");

const src = path.join(
  __dirname,
  "..",
  "React native",
  "oldcarbazar",
  "assets",
  "images",
  "logocarr.png"
);
const outWhite = path.join(
  __dirname,
  "..",
  "React native",
  "oldcarbazar",
  "assets",
  "images",
  "logo-white.png"
);
const outTrans = path.join(
  __dirname,
  "..",
  "React native",
  "oldcarbazar",
  "assets",
  "images",
  "logocarr-trans.png"
);

sharp(src)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true })
  .then(({ data, info }) => {
    const { width, height, channels } = info;
    const white = Buffer.from(data);
    const trans = Buffer.from(data);
    for (let i = 0; i < data.length; i += channels) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const m = Math.min(r, g, b);
      // Near-white background -> fully transparent.
      const bgAlpha = m >= 240 ? 0 : 255 - m;
      // White silhouette version.
      white[i] = 255;
      white[i + 1] = 255;
      white[i + 2] = 255;
      white[i + 3] = bgAlpha;
      // Colored version with background removed.
      trans[i] = r;
      trans[i + 1] = g;
      trans[i + 2] = b;
      trans[i + 3] = m >= 240 ? 0 : 255;
    }
    return Promise.all([
      sharp(white, { raw: { width, height, channels } }).png().toFile(outWhite),
      sharp(trans, { raw: { width, height, channels } }).png().toFile(outTrans),
    ]);
  })
  .then(() => console.log("done: logo-white.png + logocarr-trans.png"))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
