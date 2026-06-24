#!/usr/bin/env node
/* =====================================================================
   decrypt.mjs — recover the plaintext app from the encrypted loader.
   Use this to edit the app later: decrypt -> edit -> rebuild.

   Usage:
     CANVAS_PASSWORD='your-password' node canvas/tools/decrypt.mjs [index.html] [outFile]

   Defaults: in = canvas/index.html, out = stdout
   ===================================================================== */
import { readFileSync, writeFileSync } from 'node:fs';
import { pbkdf2Sync, createDecipheriv } from 'node:crypto';

const inFile = process.argv[2] || new URL('../index.html', import.meta.url).pathname;
const outFile = process.argv[3];
const password = process.env.CANVAS_PASSWORD;
if (!password) { console.error('error: set CANVAS_PASSWORD env var'); process.exit(1); }

const html = readFileSync(inFile, 'utf8');
const grab = (name) => { const m = html.match(new RegExp(name + '="([^"]*)"')); if (!m) throw new Error('could not find ' + name); return m[1]; };
const salt = Buffer.from(grab('SALT'), 'base64');
const iv = Buffer.from(grab('IV'), 'base64');
const blob = Buffer.from(grab('PAYLOAD'), 'base64');
const tag = blob.subarray(blob.length - 16);
const enc = blob.subarray(0, blob.length - 16);

const key = pbkdf2Sync(password, salt, 200000, 32, 'sha256');
const d = createDecipheriv('aes-256-gcm', key, iv);
d.setAuthTag(tag);
let pt;
try { pt = Buffer.concat([d.update(enc), d.final()]).toString('utf8'); }
catch (e) { console.error('decrypt failed — wrong password?'); process.exit(1); }

if (outFile) { writeFileSync(outFile, pt); console.error('wrote', outFile); }
else process.stdout.write(pt);
