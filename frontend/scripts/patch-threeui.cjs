const fs = require('fs');
const path = require('path');

const threeuiDir = path.resolve(__dirname, '../node_modules/@designcodeio/threeui');
if (!fs.existsSync(threeuiDir)) {
  console.log('@designcodeio/threeui not found in node_modules, skipping patch.');
  process.exit(0);
}

// 1. Patch pageRecipes.js
const pageRecipesJsPath = path.join(threeuiDir, 'lib-dist/shaders/landing-pages/pageRecipes.js');
if (fs.existsSync(pageRecipesJsPath)) {
  let content = fs.readFileSync(pageRecipesJsPath, 'utf8');
  if (!content.includes('MENG_TO_SKETCHBOOK_TYPOGRAPHY')) {
    const sketchbookRecipe = `
const INSTRUMENT_SERIF_LOADED = {
  value: "instrument-serif",
  label: "Instrument Serif",
  stack: '"Instrument Serif", Georgia, "Times New Roman", serif'
};
const NEWSREADER_LOADED = {
  value: "newsreader",
  label: "Newsreader",
  stack: '"Newsreader", Georgia, "Times New Roman", serif'
};
const GEIST = {
  value: "geist",
  label: "Geist",
  stack: '"Geist", system-ui, -apple-system, "Segoe UI", Helvetica, Arial, sans-serif',
  google: "Geist:wght@100..900"
};
const MENG_TO_SKETCHBOOK_TYPOGRAPHY = {
  headingFonts: [INSTRUMENT_SERIF_LOADED, NEWSREADER_LOADED, GEIST],
  bodyFonts: [NEWSREADER_LOADED, GEIST, INSTRUMENT_SERIF_LOADED],
  headingWeights: ["300", "400", "500", "600"],
  headingWeight: "400",
  bodyWeights: ["200", "300", "400", "500", "600"],
  bodyWeight: "400",
  primaryColor: "#2b2721",
  headingSize: [20, 30, 48],
  bodySize: [14, 20, 30],
  headingLetterSpacing: [-0.06, 0.01, 0.12],
  css: (type) => \`
:root {
  --ink: \${type.primary};
  --ink-soft: \${n(type.primary, 0.58)};
  --ink-faint: \${n(type.primary, 0.36)};
  --hairline: \${n(type.primary, 0.14)};
  --display: \${type.heading};
  --font: \${type.body};
}
body { font-family: \${type.body}; font-weight: \${type.bodyWeight}; }
.top .name, .plate .t { font-family: \${type.heading}; font-weight: \${type.headingWeight}; }
.top .name {
  font-size: clamp(\${i((type.headingSize * 24) / 30)}, calc(\${a(type.headingSize / 30)} * 2.4vw), \${i(type.headingSize)});
  letter-spacing: \${type.headingLetterSpacing}em;
}
.plate .t {
  font-size: clamp(\${i((type.headingSize * 19) / 30)}, calc(\${a(type.headingSize / 30)} * 2.1vw), \${i((type.headingSize * 26) / 30)});
  letter-spacing: \${a(type.headingLetterSpacing - 0.01)}em;
}
.top nav { font-size: \${i((type.bodySize * 15) / 20)}; font-weight: \${type.bodyWeight === "400" ? "300" : type.bodyWeight}; }
.hero-kicker { font-size: \${i((type.bodySize * 12) / 20)}; font-weight: \${type.bodyWeight}; }
.sb-caption { font-size: \${i((type.bodySize * 13) / 20)}; }
.sb-hint, .section-label, .zoom-read { font-size: \${i((type.bodySize * 11) / 20)}; }
.bio {
  font-size: clamp(\${i((type.bodySize * 17) / 20)}, calc(\${a(type.bodySize / 20)} * 1.7vw), \${i(type.bodySize)});
  font-weight: \${type.bodyWeight === "400" ? "300" : type.bodyWeight};
}
.plate .n { font-size: \${i((type.bodySize * 12) / 20)}; }
.plate .p { font-size: \${i((type.bodySize * 12.5) / 20)}; }
.foot { font-size: \${i((type.bodySize * 11.5) / 20)}; }
::selection { background: \${n(type.primary, 0.85)}; }
.bio-link { text-decoration-color: \${n(type.primary, 0.28)}; }
@media (max-width: 640px) {
  .top .name { font-size: \${i((type.headingSize * 20) / 30)}; }
  .top nav { font-size: \${i((type.bodySize * 13) / 20)}; }
  .hero-kicker { font-size: \${i((type.bodySize * 10.5) / 20)}; }
  .sb-hint { font-size: \${i((type.bodySize * 9.5) / 20)}; }
}
\`
};
`;
    content = content.replace('export {', sketchbookRecipe + '\nexport {\n  MENG_TO_SKETCHBOOK_TYPOGRAPHY,');
    fs.writeFileSync(pageRecipesJsPath, content, 'utf8');
    console.log('Patched pageRecipes.js');
  }
}

// 2. Patch pageRecipes.d.ts
const pageRecipesDtsPath = path.join(threeuiDir, 'lib-dist/shaders/landing-pages/pageRecipes.d.ts');
if (fs.existsSync(pageRecipesDtsPath)) {
  let content = fs.readFileSync(pageRecipesDtsPath, 'utf8');
  if (!content.includes('MENG_TO_SKETCHBOOK_TYPOGRAPHY')) {
    content += '\nexport declare const MENG_TO_SKETCHBOOK_TYPOGRAPHY: PageTypographyRecipe;\n';
    fs.writeFileSync(pageRecipesDtsPath, content, 'utf8');
    console.log('Patched pageRecipes.d.ts');
  }
}

// 3. Patch LandingPages.js
const landingPagesJsPath = path.join(threeuiDir, 'lib-dist/shaders/landing-pages/LandingPages.js');
if (fs.existsSync(landingPagesJsPath)) {
  let content = fs.readFileSync(landingPagesJsPath, 'utf8');
  if (!content.includes('MENG_TO_SKETCHBOOK_TYPOGRAPHY')) {
    content = content.replace(
      'import { BESTSELLERS_TYPOGRAPHY as k, COMPLETE_SHELF_TYPOGRAPHY as S, KAGE_TYPOGRAPHY as T, SYLVA_TYPOGRAPHY as b } from "./pageRecipes.js";',
      'import { BESTSELLERS_TYPOGRAPHY as k, COMPLETE_SHELF_TYPOGRAPHY as S, KAGE_TYPOGRAPHY as T, SYLVA_TYPOGRAPHY as b, MENG_TO_SKETCHBOOK_TYPOGRAPHY } from "./pageRecipes.js";'
    );
    content = content.replace(
      'function M(e) {\n  return /* @__PURE__ */ o(p, { ...e, title: "Meng To — Singapore Sketchbook", sourceUrl: "/landing-pages/meng-to-sketchbook.html" });\n}',
      'function M(e) {\n  return /* @__PURE__ */ o(t, { ...e, recipe: MENG_TO_SKETCHBOOK_TYPOGRAPHY, title: "Meng To — Singapore Sketchbook", sourceUrl: "/landing-pages/meng-to-sketchbook.html" });\n}'
    );
    fs.writeFileSync(landingPagesJsPath, content, 'utf8');
    console.log('Patched LandingPages.js');
  }
}

// 4. Patch LandingPages.d.ts
const landingPagesDtsPath = path.join(threeuiDir, 'lib-dist/shaders/landing-pages/LandingPages.d.ts');
if (fs.existsSync(landingPagesDtsPath)) {
  let content = fs.readFileSync(landingPagesDtsPath, 'utf8');
  if (content.includes('export declare function MengToSketchbookLandingPage(props: LandingPageProps):')) {
    content = content.replace(
      'export declare function MengToSketchbookLandingPage(props: LandingPageProps):',
      'export declare function MengToSketchbookLandingPage(props: LandingPageProps & PageTypographyProps):'
    );
    fs.writeFileSync(landingPagesDtsPath, content, 'utf8');
    console.log('Patched LandingPages.d.ts');
  }
}

console.log('ThreeUI patch completed.');
