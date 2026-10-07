import { mkdir, copyFile, rm } from 'node:fs/promises';

const output = new URL('./dist/', import.meta.url);
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const file of ['index.html', 'style.css', 'game.js', 'products.js', 'audio.js']) {
  await copyFile(new URL(file, import.meta.url), new URL(file, output));
}
console.log('Site estático gerado em dist/');
