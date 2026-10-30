import fs from 'node:fs';
import path from 'node:path';
import {brotliDecompressSync} from 'node:zlib';
import {pathToFileURL} from 'node:url';

const dir=path.resolve('.marktblick-runtime');
fs.mkdirSync(dir,{recursive:true});
const chunks=[];
for(let i=0;i<7;i++)chunks.push(fs.readFileSync(new URL('./bundle/part'+i+'.txt',import.meta.url),'utf8').trim());
const files=JSON.parse(brotliDecompressSync(Buffer.from(chunks.join(''),'base64')).toString('utf8'));
for(const [name,contents] of Object.entries(files)){
  const target=path.join(dir,name);
  if(!target.startsWith(dir+path.sep))throw new Error('Unsafe bundle path: '+name);
  fs.mkdirSync(path.dirname(target),{recursive:true});
  fs.writeFileSync(target,contents,'utf8');
}
process.chdir(dir);
await import(pathToFileURL(path.join(dir,'server.mjs')).href);
