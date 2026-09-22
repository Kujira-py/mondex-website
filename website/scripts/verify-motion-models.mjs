import ts from 'typescript';
import { readFileSync, writeFileSync } from 'node:fs';
import assert from 'node:assert/strict';
const modules = {};
for (const name of ['card-motion', 'orbit-motion', 'binder-motion']) {
  const code = ts.transpileModule(readFileSync(`src/lib/${name}.ts`, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const exports = {};
  new Function('require', 'exports', code)((id) => modules[id.replace('./', '')], exports);
  modules[name] = exports;
}
const { binderState, leafPoint, PAGE_W } = modules['binder-motion'];
let samples = 0,
  minGap = Infinity,
  maxFrameTravel = 0;
let previous;
for (let f = 0; f <= 35 * 120; f++) {
  const state = binderState((f / 120) % 35),
    leaves = state.leaves;
  const frame = [];
  for (let index = 0; index < 2; index++) {
    const leaf = leaves[index],
      other = leaves[1 - index];
    for (let j = 0; j <= 48; j++) {
      const p = leafPoint(j / 48, leaf.flip, leaf.right, leaf.left);
      frame.push(p);
      // The shared bound edge belongs to the ring spine; compare the page interiors.
      if (j && leaf.flip > 0 && leaf.flip < 1 && (other.flip === 0 || other.flip === 1)) {
        if ((other.flip === 0 && p.x > 0.001) || (other.flip === 1 && p.x < -0.001)) {
          const support = other.flip === 0 ? other.right : other.left;
          const gap = p.z - support;
          minGap = Math.min(minGap, gap);
          assert(gap > 0.015, `Leaf intersection at ${f / 120}s: ${gap}`);
        }
      }
      assert(Math.abs(p.x) <= PAGE_W + 1e-8);
      samples++;
    }
  }
  if (previous)
    for (let i = 0; i < frame.length; i++)
      maxFrameTravel = Math.max(
        maxFrameTravel,
        Math.hypot(frame[i].x - previous[i].x, frame[i].z - previous[i].z),
      );
  previous = frame;
}
assert(maxFrameTravel < 0.04, 'Page geometry jumped, including at loop wrap');
const { orbitPose } = modules['orbit-motion'];
for (const mobile of [true, false])
  for (const p of [1, 2]) {
    const a = orbitPose(p - 1e-5, mobile),
      b = orbitPose(p + 1e-5, mobile);
    assert(Math.hypot(a.x - b.x, a.y - b.y, a.s - b.s) < 0.001, 'Logo pose discontinuity');
  }
const report = {
  pageSamples: samples,
  minSupportingPageGap: minGap,
  max120HzFrameTravel: maxFrameTravel,
  orbitContinuous: true,
};
writeFileSync('qa/twelve/model-report.json', JSON.stringify(report, null, 2));
console.log(report);
