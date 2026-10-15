#!/usr/bin/env node
/**
 * `npx cap add android` 직후 실행:
 *  - http/ws 평문 통신 허용 (로봇 서버가 http라서 필수)
 *  - 가로 화면 고정
 *  - 앱 아이콘 교체 (resources/android/ → android/app/src/main/res/)
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const manifestPath = path.join(root, 'android/app/src/main/AndroidManifest.xml');
const resDir = path.join(root, 'android/app/src/main/res');
const iconSrc = path.join(root, 'resources/android');

// ---- AndroidManifest.xml ----
let m = fs.readFileSync(manifestPath, 'utf8');
if (!/usesCleartextTraffic/.test(m)) {
  m = m.replace(/<application\b/, '<application\n        android:usesCleartextTraffic="true"');
}
if (!/screenOrientation/.test(m)) {
  m = m.replace(/<activity\b/, '<activity\n            android:screenOrientation="sensorLandscape"');
}
if (!/android.permission.INTERNET/.test(m)) {
  m = m.replace(/<\/manifest>/, '    <uses-permission android:name="android.permission.INTERNET" />\n</manifest>');
}
fs.writeFileSync(manifestPath, m);
console.log('patched', path.relative(root, manifestPath));

// ---- icons ----
if (fs.existsSync(iconSrc)) {
  for (const dir of fs.readdirSync(iconSrc)) {
    const from = path.join(iconSrc, dir);
    if (!fs.statSync(from).isDirectory()) continue;
    const to = path.join(resDir, dir);
    fs.mkdirSync(to, { recursive: true });
    for (const f of fs.readdirSync(from)) fs.copyFileSync(path.join(from, f), path.join(to, f));
  }
  // adaptive icon background color
  const valuesDir = path.join(resDir, 'values');
  fs.mkdirSync(valuesDir, { recursive: true });
  fs.writeFileSync(path.join(valuesDir, 'ic_launcher_background.xml'),
    '<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">#0b0f14</color>\n</resources>\n');
  console.log('icons copied');
}

// ---- app name / colors ----
const stringsPath = path.join(resDir, 'values/strings.xml');
if (fs.existsSync(stringsPath)) {
  let s = fs.readFileSync(stringsPath, 'utf8');
  s = s.replace(/<string name="app_name">[^<]*<\/string>/, '<string name="app_name">PiCar Remote</string>')
       .replace(/<string name="title_activity_main">[^<]*<\/string>/, '<string name="title_activity_main">PiCar Remote</string>');
  fs.writeFileSync(stringsPath, s);
}
console.log('done');
