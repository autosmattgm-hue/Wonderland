const fs = require('fs');
const path = require('path');
const dir = __dirname;
const out = [];
let bad = 0;
['index.html','games.html','videos.html','stories.html','coloring.html','music.html','fun-zone.html','animals.html','space.html','experiments.html'].forEach(f => {
  const p = path.join(dir, f);
  if (!fs.existsSync(p)) { out.push('MISSING ' + f); bad++; return; }
  const html = fs.readFileSync(p, 'utf8');
  let i = 0;
  const re = /<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/g;
  let m;
  while ((m = re.exec(html))) {
    i++;
    try { new Function(m[1]); } catch (e) { bad++; out.push('SYNTAX ' + f + ' #' + i + ': ' + e.message); }
  }
  const o = (html.match(/<div\b/g) || []).length;
  const c = (html.match(/<\/div>/g) || []).length;
  if (o !== c) out.push('DIV ' + f + ': ' + o + '/' + c);
  if (!html.includes('viewport-fit=cover')) out.push(f + ': viewport missing viewport-fit');
});
['common.css','common.js'].forEach(f => {
  if (fs.existsSync(path.join(dir, f))) out.push(f + ' EXISTS (' + fs.statSync(path.join(dir, f)).size + ' bytes)');
  else { out.push('MISSING ' + f); bad++; }
});
out.push(bad === 0 ? 'ALL PASS' : bad + ' PROBLEMS');
fs.writeFileSync(path.join(dir, '_resp.txt'), out.join('\n'), 'utf8');