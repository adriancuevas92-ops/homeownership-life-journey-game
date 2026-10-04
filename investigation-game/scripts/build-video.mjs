// Builds a location's video from its content cards.
// Usage: node scripts/build-video.mjs <location-id>
//
// Each card is shown for the length of its narration file
// (audio/<id>/card00.mp3, card01.mp3, ...) if present, otherwise for
// DEFAULT_SECONDS. Output: videos/<id>.mp4
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const DEFAULT_SECONDS = 8;
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const id = process.argv[2];
if (!id) {
  console.error('usage: node scripts/build-video.mjs <location-id>');
  process.exit(1);
}

const { LOCATIONS } = await import(pathToFileURL(join(root, 'locations.js')).href);
const loc = LOCATIONS.find(l => l.id === id);
if (!loc || !loc.cards) {
  console.error(`no cards for location "${id}"`);
  process.exit(1);
}

const work = join(root, 'build', id);
rmSync(work, { recursive: true, force: true });
mkdirSync(work, { recursive: true });
const cardsJson = join(work, 'cards.json');
writeFileSync(cardsJson, JSON.stringify(loc.cards, null, 2), 'utf8');
execFileSync('python', [join(root, 'scripts', 'render_cards.py'), cardsJson, work], { stdio: 'inherit' });

const probe = file => Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file]).toString().trim());
const segments = [];
loc.cards.forEach((_, i) => {
  const img = join(work, `card${String(i).padStart(2, '0')}.png`);
  const audio = join(root, 'audio', id, `card${String(i).padStart(2, '0')}.mp3`);
  const seconds = existsSync(audio) ? probe(audio) + 0.6 : DEFAULT_SECONDS;
  const seg = join(work, `seg${String(i).padStart(2, '0')}.mp4`);
  const args = ['-y', '-loop', '1', '-t', String(seconds), '-i', img];
  if (existsSync(audio)) args.push('-i', audio, '-shortest', '-c:a', 'aac', '-b:a', '128k', '-ar', '44100', '-ac', '2');
  else args.push('-f', 'lavfi', '-i', 'anullsrc=r=44100:cl=stereo', '-shortest', '-c:a', 'aac');
  args.push('-vf', 'fps=30,format=yuv420p', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '24', seg);
  execFileSync('ffmpeg', args, { stdio: 'ignore' });
  segments.push(seg);
});

const list = join(work, 'list.txt');
writeFileSync(list, segments.map(s => `file '${s.replace(/\\/g, '/')}'`).join('\n') + '\n', 'utf8');
const outDir = join(root, 'videos');
mkdirSync(outDir, { recursive: true });
const out = join(outDir, `${id}.mp4`);
execFileSync('ffmpeg', ['-y', '-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', '-movflags', '+faststart', out], { stdio: 'ignore' });
console.log(`built ${out} (${probe(out).toFixed(1)}s)`);
