#!/usr/bin/env node
/* =====================================================================
   build.mjs — encrypt the canvas app into a self-contained loader.
   The plaintext app is NEVER committed; only the encrypted loader
   (canvas/index.html) goes to the public repo. Decrypting it requires
   the password, so a visitor without it cannot render the page at all.

   Usage:
     CANVAS_PASSWORD='your-password' node canvas/tools/build.mjs <appFile> [outFile]

   Defaults: outFile = canvas/index.html
   Crypto matches the browser WebCrypto used by the loader + app:
     PBKDF2(SHA-256, 200000 iters, 16-byte salt) -> AES-256-GCM(12-byte iv)
   ===================================================================== */
import { readFileSync, writeFileSync } from 'node:fs';
import { pbkdf2Sync, randomBytes, createCipheriv } from 'node:crypto';

const appFile = process.argv[2];
const outFile = process.argv[3] || new URL('../index.html', import.meta.url).pathname;
const password = process.env.CANVAS_PASSWORD;

if (!appFile) { console.error('usage: CANVAS_PASSWORD=... node build.mjs <appFile> [outFile]'); process.exit(1); }
if (!password) { console.error('error: set CANVAS_PASSWORD env var'); process.exit(1); }

const plaintext = readFileSync(appFile, 'utf8');
const salt = randomBytes(16);
const iv = randomBytes(12);
const key = pbkdf2Sync(password, salt, 200000, 32, 'sha256');
const cipher = createCipheriv('aes-256-gcm', key, iv);
const enc = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
const tag = cipher.getAuthTag();
const payload = Buffer.concat([enc, tag]).toString('base64'); // ciphertext||tag, matches WebCrypto

const SALT = salt.toString('base64'), IV = iv.toString('base64');

const loader = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="robots" content="noindex, nofollow" />
<title>Locked</title>
<style>
  html,body{margin:0;height:100%;background:#0e1014;color:#e7eaf0;
    font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,system-ui,sans-serif;}
  .wrap{height:100%;display:grid;place-items:center}
  form{background:#171a21;border:1px solid #2a2f3a;border-radius:14px;padding:28px;width:300px;
    box-shadow:0 10px 40px rgba(0,0,0,.5);text-align:center}
  .lock{font-size:30px;margin-bottom:6px}
  h1{font-size:15px;font-weight:600;margin:0 0 4px}
  p{font-size:12px;color:#8b93a3;margin:0 0 18px}
  input{width:100%;padding:11px 12px;border-radius:9px;border:1px solid #2a2f3a;background:#0c0e13;
    color:#e7eaf0;font-size:14px;outline:none}
  input:focus{border-color:#5b8cff}
  button{width:100%;margin-top:10px;padding:11px;border:0;border-radius:9px;background:#5b8cff;color:#fff;
    font-size:14px;font-weight:600;cursor:pointer}
  button:disabled{opacity:.6;cursor:default}
  .err{color:#ff7a7a;font-size:12px;height:14px;margin-top:8px}
</style>
</head>
<body>
  <div class="wrap">
    <form id="f" autocomplete="off">
      <div class="lock">🔒</div>
      <h1>Private workspace</h1>
      <p>Enter the password to unlock.</p>
      <input id="pw" type="password" placeholder="Password" autofocus />
      <button id="go" type="submit">Unlock</button>
      <div class="err" id="err"></div>
    </form>
  </div>
<script>
(function(){
const SALT="${SALT}", IV="${IV}", PAYLOAD="${payload}";
const dec=s=>{const b=atob(s),u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i);return u;};
const f=document.getElementById('f'),pw=document.getElementById('pw'),err=document.getElementById('err'),go=document.getElementById('go');
f.addEventListener('submit',async e=>{
  e.preventDefault(); err.textContent=''; go.disabled=true; go.textContent='Unlocking…';
  try{
    const base=await crypto.subtle.importKey('raw',new TextEncoder().encode(pw.value),'PBKDF2',false,['deriveKey']);
    const key=await crypto.subtle.deriveKey({name:'PBKDF2',salt:dec(SALT),iterations:200000,hash:'SHA-256'},
      base,{name:'AES-GCM',length:256},false,['decrypt']);
    const pt=await crypto.subtle.decrypt({name:'AES-GCM',iv:dec(IV)},key,dec(PAYLOAD));
    const html=new TextDecoder().decode(pt);
    window.__CANVAS_PW__=pw.value;
    document.open(); document.write(html); document.close();
  }catch(ex){
    err.textContent='Wrong password.'; go.disabled=false; go.textContent='Unlock'; pw.select();
  }
});
})();
</script>
</body>
</html>
`;

writeFileSync(outFile, loader);
console.log('wrote', outFile, '(' + (loader.length/1024).toFixed(1) + ' KB, payload ' + (payload.length/1024).toFixed(1) + ' KB)');
