const fs = require('fs');
const path = require('path');
const dir = __dirname;
const out = [];
let bad = 0;
['index.html','games.html','videos.html','stories.html','coloring.html','music.html','fun-zone.html','animals.html','space.html','experiments.html'].forEach(function(f){
  var p = path.join(dir, f);
  if (!fs.existsSync(p)) { out.push('MISSING ' + f); bad++; return; }
  var html = fs.readFileSync(p, 'utf8');
  var i = 0, m;
  var re = /<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/g;
  while ((m = re.exec(html))) {
    i++;
    try { new Function(m[1]); } catch (e) { bad++; out.push('SYNTAX ' + f + ' #' + i + ': ' + e.message); }
  }
  var o = (html.match(/<div\b/g) || []).length;
  var c = (html.match(/<\/div>/g) || []).length;
  if (o !== c) out.push('DIV ' + f + ': ' + o + '/' + c);
  if (html.indexOf('viewport-fit=cover') === -1) out.push(f + ': no viewport-fit');
});
['common.css','common.js'].forEach(function(f){
  if (fs.existsSync(path.join(dir, f))) out.push(f + ' exists');
  else { out.push('MISSING ' + f); bad++; }
});
out.push(bad === 0 ? 'ALL PASS' : bad + ' PROBLEMS');
fs.writeFileSync(path.join(dir, '_resp2.txt'), out.join('\n'), 'utf8');