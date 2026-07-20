import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

const BASE = 'https://www.mantis.works';
const OUT = join(process.cwd(), 'public');

// [remoteUrlPath, localRelPath]
const assets = [
  // Fonts (Denim + Graebenbach Mono)
  ['/_astro/fonts/2091321d6f284eb5.woff2', 'fonts/font-1.woff2'],
  ['/_astro/fonts/ab4a30d903de229a.woff2', 'fonts/font-2.woff2'],
  ['/_astro/fonts/83f090e9974fed94.woff2', 'fonts/font-3.woff2'],
  ['/_astro/fonts/df2e4369f52ff34e.woff2', 'fonts/font-4.woff2'],
  // 3D models
  ['/_astro/model-1.B_txL4GN.glb', 'models/model-1.glb'],
  ['/_astro/model-2.CJyUDGgt.glb', 'models/model-2.glb'],
  ['/_astro/model-3.zeNsMlvR.glb', 'models/model-3.glb'],
  ['/_astro/model-4.CykbczgT.glb', 'models/model-4.glb'],
  // Videos
  ['/real.mp4', 'videos/real.mp4'],
  ['/mob-real.mp4', 'videos/mob-real.mp4'],
  // Images
  ['/_astro/nerves-1.Cq9t-Vcs_yNCmM.webp', 'images/nerves-1.webp'],
  ['/_astro/nerves-2.Bu-kzQF__Z18ggIS.webp', 'images/nerves-2.webp'],
  ['/_astro/nerves-3.DCQ941Wz_1iywzu.webp', 'images/nerves-3.webp'],
  ['/_astro/noise.r5ZCqP0v_Zs1RTw.webp', 'images/noise.webp'],
  ['/_astro/logo-bg.ClFP2JaS_Z1ePaGY.svg', 'images/logo-bg.svg'],
  ['/_astro/nav-cta-bg.CV6qVoLY_oLToK.svg', 'images/nav-cta-bg.svg'],
  // NOTE: third-party client logos (Adidas, Google, Meta, Microsoft, …) and
  // award badges (FWA, Awwwards, Webby, CSSDA, D&AD, Cannes) were deliberately
  // removed from this manifest. They are other companies' trademarks and were
  // never Brivix clients or awards — the "Trusted By" section now runs on
  // typographic sector names instead (see src/data/content.ts). Do not
  // reintroduce them.
  // Favicon
  ['/favicon.svg', 'seo/favicon.svg'],
];

async function download([remote, local]) {
  const url = BASE + remote;
  const dest = join(OUT, local);
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    await mkdir(dirname(dest), { recursive: true });
    await writeFile(dest, buf);
    console.log(`OK  ${local}  (${(buf.length / 1024).toFixed(1)} KB)`);
  } catch (err) {
    console.error(`FAIL ${remote}: ${err.message}`);
  }
}

// batched parallel downloads, 4 at a time
for (let i = 0; i < assets.length; i += 4) {
  await Promise.all(assets.slice(i, i + 4).map(download));
}
console.log('Done.');
