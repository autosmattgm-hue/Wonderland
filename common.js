/* =========================================================
   Sunny Cloud Wonderland — shared happy magic
   Star Jar, confetti bursts, cheerful sounds, mascot bubble
   ========================================================= */
(function(){
'use strict';

var SCORE_KEY = 'scw_stars';
var WELCOME_KEY = 'scw_welcomed_v2';
var stars = 0;
try { stars = parseInt(localStorage.getItem(SCORE_KEY), 10) || 0; } catch(e){}

/* ---------- little sound maker ---------- */
var ctx = null;
function sound(type){
  try{
    if(!ctx){ ctx = new (window.AudioContext||window.webkitAudioContext)(); }
    var t0 = ctx.currentTime;
    if(type === 'win'){
      [523.25,659.25,783.99,1046.5].forEach(function(f,i){
        var o = ctx.createOscillator(), g = ctx.createGain();
        o.type='triangle'; o.frequency.value=f;
        g.gain.setValueAtTime(0.0001, t0+i*0.09);
        g.gain.exponentialRampToValueAtTime(0.22, t0+i*0.09+0.02);
        g.gain.exponentialRampToValueAtTime(0.001, t0+i*0.09+0.45);
        o.connect(g); g.connect(ctx.destination);
        o.start(t0+i*0.09); o.stop(t0+i*0.09+0.5);
      });
      return;
    }
    var o2 = ctx.createOscillator(), g2 = ctx.createGain();
    o2.type = 'triangle';
    if(type === 'pop'){
      o2.type='square';
      o2.frequency.setValueAtTime(500,t0);
      o2.frequency.exponentialRampToValueAtTime(150,t0+0.12);
      g2.gain.setValueAtTime(0.2,t0);
      g2.gain.exponentialRampToValueAtTime(0.001,t0+0.15);
    } else if(type === 'star'){
      o2.frequency.setValueAtTime(987.77,t0);
      o2.frequency.exponentialRampToValueAtTime(1318.5,t0+0.12);
      g2.gain.setValueAtTime(0.0001,t0);
      g2.gain.exponentialRampToValueAtTime(0.22,t0+0.02);
      g2.gain.exponentialRampToValueAtTime(0.001,t0+0.5);
    } else if(type === 'boing'){
      o2.frequency.setValueAtTime(220,t0);
      o2.frequency.exponentialRampToValueAtTime(660,t0+0.15);
      g2.gain.setValueAtTime(0.25,t0);
      g2.gain.exponentialRampToValueAtTime(0.001,t0+0.22);
    } else if(type === 'tada'){
      [392,523.25,659.25,783.99].forEach(function(f,i){
        var o3=ctx.createOscillator(), g3=ctx.createGain();
        o3.type='triangle'; o3.frequency.value=f;
        g3.gain.setValueAtTime(0.0001,t0+i*0.07);
        g3.gain.exponentialRampToValueAtTime(0.25,t0+i*0.07+0.02);
        g3.gain.exponentialRampToValueAtTime(0.001,t0+i*0.07+0.3);
        o3.connect(g3); g3.connect(ctx.destination);
        o3.start(t0+i*0.07); o3.stop(t0+i*0.07+0.35);
      });
      return;
    } else {
      o2.frequency.setValueAtTime(700,t0);
      g2.gain.setValueAtTime(0.15,t0);
      g2.gain.exponentialRampToValueAtTime(0.001,t0+0.08);
    }
    o2.connect(g2); g2.connect(ctx.destination);
    o2.start(t0); o2.stop(t0+0.6);
  }catch(e){}
}

/* ---------- confetti ---------- */
var confettiColors = ['#FF6FA3','#FFD34D','#58D68D','#4FC3F7','#A66BF0','#FF9F43','#FF4D6D','#37B5A3'];
function popConfetti(count){
  count = count || 60;
  count = Math.min(count, 160);
  for(var i=0;i<count;i++){
    var c = document.createElement('div');
    c.className = 'confetti-bit';
    c.style.left = (Math.random()*100)+'vw';
    c.style.background = confettiColors[Math.floor(Math.random()*confettiColors.length)];
    if(Math.random()<0.35) c.style.borderRadius = '50%';
    c.style.animationDelay = (Math.random()*0.5)+'s';
    c.style.animationDuration = (1.8+Math.random()*2.2)+'s';
    c.style.transform = 'scale('+(0.6+Math.random()*0.8)+')';
    document.body.appendChild(c);
    (function(el){ setTimeout(function(){ el.remove(); }, 4600); })(c);
  }
}

/* ---------- mascot speech bubble ---------- */
var bubbleTimer = null;
function showMascotSay(msg, ms){
  var bubble = document.getElementById('scw-bubble');
  if(!bubble){
    bubble = document.createElement('div');
    bubble.id = 'scw-bubble';
    document.body.appendChild(bubble);
  }
  bubble.textContent = msg;
  bubble.classList.add('scw-show');
  clearTimeout(bubbleTimer);
  bubbleTimer = setTimeout(function(){ bubble.classList.remove('scw-show'); }, ms || 2200);
}

/* ---------- star jar ---------- */
function drawStars(){
  var badge = document.getElementById('scw-star-badge');
  if(badge){
    var n = badge.querySelector('.scw-count');
    if(n) n.textContent = stars;
  }
}
function addStars(n){
  n = Math.max(1, Math.round(n) || 1);
  stars += n;
  try { localStorage.setItem(SCORE_KEY, String(stars)); } catch(e){}
  sound('star');
  popConfetti(12 + n*2);
  var badge = document.getElementById('scw-star-badge');
  if(badge){
    badge.classList.add('scw-bounce');
    setTimeout(function(){ badge.classList.remove('scw-bounce'); }, 700);
  }
  drawStars();
  checkStickers();
  var happy = ['⭐ +'+n+' stars for you!','🎉 Yay! +'+n+' stars!','You are amazing! 🌟','Keep it up, superstar! 💖'];
  showMascotSay(happy[Math.floor(Math.random()*happy.length)], 1800);
}
function getStars(){ return stars; }

/* ---------- sticker book (earn stickers at star milestones) ---------- */
var STICKERS = [
  [10,'⭐','First Steps'],
  [30,'🌟','Star Catcher'],
  [60,'🌈','Rainbow Rider'],
  [100,'🏅','Wonderland Champ'],
  [160,'🦄','Unicorn Ranger'],
  [250,'👑','Cloud Royalty']
];
var stickerKey = 'scw_stickers';
var stickerMap = {};
try { stickerMap = JSON.parse(localStorage.getItem(stickerKey)) || {}; } catch(e){ stickerMap = {}; }
function checkStickers(){
  var s = getStars();
  STICKERS.forEach(function(st){
    if(s >= st[0] && !stickerMap[st[0]]){
      stickerMap[st[0]] = true;
      try { localStorage.setItem(stickerKey, JSON.stringify(stickerMap)); } catch(e){}
      setTimeout(function(){
        popConfetti(30);
        showMascotSay('🏅 New sticker: ' + st[1] + ' ' + st[2] + '!', 3200);
      }, 700);
    }
  });
}
function getStickers(){
  var list = [];
  STICKERS.forEach(function(st){ if(stickerMap[st[0]]) list.push(st); });
  return list;
}

function initBadge(){
  var div = document.createElement('div');
  div.id = 'scw-star-badge';
  div.className = 'scw-badge';
  div.title = 'Your Star Jar — tap for confetti!';
  div.innerHTML = '⭐ <span class="scw-count">'+stars+'</span>';
  div.addEventListener('click', function(){ popConfetti(35); sound('pop'); });
  document.body.appendChild(div);
}

/* ---------- tiny sparkle trail when kids click anywhere ---------- */
function sparkleAt(x, y){
  var s = document.createElement('div');
  s.className = 'confetti-bit scw-sparkle';
  s.style.left = x+'px';
  s.style.top = y+'px';
  s.style.animationName = 'scwSpark';
  s.style.animationDuration = (0.6+Math.random()*0.5)+'s';
  document.body.appendChild(s);
  setTimeout(function(){ s.remove(); }, 1300);
}

/* ---------- init ---------- */
function init(){
  initBadge();
  showInstallBtn();
  checkStickers();
  if(window.scwClickSparkles !== false){
    document.addEventListener('click', function(ev){
      if(ev.target.closest && ev.target.closest('.scw-no-spark')) return;
      if(Math.random() < 0.6) sparkleAt(ev.clientX, ev.clientY);
    });
  }
  var welcomed = false;
  try { welcomed = localStorage.getItem(WELCOME_KEY) === '1'; } catch(e){}
  if(!welcomed){
    try { localStorage.setItem(WELCOME_KEY,'1'); } catch(e){}
    setTimeout(function(){
      popConfetti(45);
      sound('win');
      showMascotSay('Hi friend! I am Sunny the Unicorn! Click the ⭐ for confetti! 🎉', 3600);
    }, 800);
  }
}
if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

/* ---------- app install (download this site as an app) ---------- */
let deferredPrompt = null;
if ('serviceWorker' in navigator && /^https:/.test(location.protocol)) {
  window.addEventListener('load', function(){ navigator.serviceWorker.register('sw.js').catch(function(){}); });
}
window.addEventListener('beforeinstallprompt', function(e){
  e.preventDefault();
  deferredPrompt = e;
  const b = document.getElementById('scw-install');
  if(b) b.style.background = 'var(--grass)';
});
function showInstallBtn(){
  const b = document.createElement('button');
  b.id = 'scw-install';
  b.className = 'scw-install-btn';
  b.textContent = '📲';
  b.title = 'Download Sunny Cloud as an app';
  b.addEventListener('click', installApp);
  document.body.appendChild(b);
}
function installApp(){
  if(deferredPrompt){
    deferredPrompt.prompt();
    deferredPrompt = null;
  } else {
    showMascotSay('On a phone: open the menu and tap "Add to Home Screen". On a computer: tap the install icon in the address bar. 📲', 4400);
  }
}

window.SCW = {
  addStars: addStars,
  getStars: getStars,
  getStickers: getStickers,
  popConfetti: popConfetti,
  sound: sound,
  showMascotSay: showMascotSay,
  sparkleAt: sparkleAt,
  installApp: installApp
};

})();