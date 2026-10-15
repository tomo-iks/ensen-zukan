// ../app の Web アプリを www/ に複製する(Capacitor が www/ をアプリに取り込む)
const fs = require("fs"), path = require("path");
const SRC = path.join(__dirname, "..", "app"), DST = path.join(__dirname, "www");
fs.rmSync(DST, { recursive: true, force: true });
const skip = new Set(["sw.js", "manifest.webmanifest"]);   // ネイティブでは不要
const copy = (a, b) => { fs.mkdirSync(b, { recursive: true });
  for (const e of fs.readdirSync(a, { withFileTypes: true })) {
    if (skip.has(e.name) || e.name.startsWith("_old")) continue;
    const s = path.join(a, e.name), d = path.join(b, e.name);
    e.isDirectory() ? copy(s, d) : fs.copyFileSync(s, d);
  } };
copy(SRC, DST);
console.log("www に複製しました:", fs.readdirSync(DST).join(", "));
