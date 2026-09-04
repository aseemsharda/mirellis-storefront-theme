'use strict';

const STUDIED = [
  { num:'01', id:'HST-001', from:'Sleep', to:'Wakefulness', short:'Sleep - Wake', cat:'Circadian', tool:'Morning Clarity', status:'ACTIVE', findings:3,
    signal:'First light, cool air and scent on waking',
    summary:'The day enters before attention consents. We study the re-sequencing of the waking minutes so the person precedes the obligation.' },
  { num:'02', id:'HST-002', from:'Work', to:'Recovery', short:'Work - Recovery', cat:'Autonomic', tool:'Stillness Elixir', status:'ACTIVE', findings:4,
    signal:'A closing ritual of warmth and scent at day\'s end',
    summary:'Work ends on the calendar, not in the body. We study the closing signal that releases the nervous system from the working state.' },
  { num:'03', id:'HST-003', from:'Stimulation', to:'Restoration', short:'Stimulation - Rest', cat:'Attentional', tool:'Stillness Elixir', status:'ACTIVE', findings:2,
    signal:'A sensory doorway out of the feed',
    summary:'Scrolling is not entertainment; it is a search for the exit. We study the threshold cue that ends stimulation without withdrawal.' },
  { num:'04', id:'HST-004', from:'Connection', to:'Solitude', short:'Connection - Solitude', cat:'Social', tool:'—', status:'UNDER STUDY', findings:0,
    signal:'A cue marking the shift from shared to private state',
    summary:'The passage from social presence into restorative solitude. Currently being characterised; no instrument issued.' },
  { num:'05', id:'HST-005', from:'Exertion', to:'Stillness', short:'Exertion - Stillness', cat:'Autonomic', tool:'—', status:'UNDER STUDY', findings:0,
    signal:'A down-regulation cue after physical load',
    summary:'How the body is signalled to leave a state of physical exertion. Early observation; structure not yet confirmed.' },
];

const FINDINGS = [
  { id:'F-001', title:'Scent reaches the waking brain before language does.', domain:'HST-001', date:'MAR 2025', status:'PUBLISHED', obs:214, url:'https://mirellis.in/pages/finding-001' },
  { id:'F-002', title:'Heart-rate recovery is gated by ritual closure, not clock time.', domain:'HST-002', date:'APR 2025', status:'PUBLISHED', obs:188, url:'https://mirellis.in/pages/finding-001' },
  { id:'F-003', title:'Restoration fails without a threshold; intent alone does not end stimulation.', domain:'HST-003', date:'JAN 2026', status:'PUBLISHED', obs:142, url:'https://mirellis.in/pages/finding-001' },
  { id:'F-004', title:'Coherent multi-sensory cues outperform any single channel.', domain:'CROSS-DOMAIN', date:'FEB 2026', status:'PUBLISHED', obs:301, url:'https://mirellis.in/pages/finding-001' },
  { id:'F-005', title:'The interval between intention and state-change shortens with repetition.', domain:'CROSS-DOMAIN', date:'MAY 2026', status:'IN REVIEW', obs:96, url:'https://mirellis.in/pages/finding-001' },
];

const CHIP_DEFS = ['ALL','ACTIVE','UNDER STUDY','CIRCADIAN','AUTONOMIC','ATTENTIONAL','SOCIAL'];
const CAPACITY = 20;

let filter = 'ALL';
let selIdx = 0;
let pinned = false;
let obsCount = 1284;
let oid = 1284;

let activity = [
  { t:'06:14:22', code:'OBS-1284', dom:'HST-001', msg:'Waking-sequence latency recorded', d:'Δ −3.2s' },
  { t:'05:58:09', code:'ART-0023', dom:'HST-003', msg:'Article published — The Doorway Problem', d:'' },
  { t:'05:41:55', code:'OBS-1281', dom:'HST-002', msg:'Heart-rate recovery session closed', d:'Δ −4.1s' },
  { t:'04:30:12', code:'FND-0005', dom:'CROSS', msg:'Finding moved to review', d:'' },
  { t:'03:12:47', code:'OBS-1276', dom:'HST-002', msg:'Closing-ritual signal logged', d:'Δ −2.8s' },
  { t:'01:55:30', code:'DOS-0014', dom:'HST-001', msg:'Dossier updated', d:'' },
  { t:'00:40:18', code:'OBS-1270', dom:'HST-003', msg:'Restoration threshold crossed', d:'Δ −5.6s' },
];

function pad(n){ return String(n).padStart(2,'0'); }
function timeStr(){
  const d = new Date();
  return [d.getHours(),d.getMinutes(),d.getSeconds()].map(pad).join(':');
}
function statusColor(st){
  if(st==='ACTIVE') return '#35536c';
  if(st==='UNDER STUDY') return '#a8772f';
  return '#b7ab98';
}
function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

function updateClock(){
  const t = timeStr();
  const mc = document.getElementById('mast-time');
  const ft = document.getElementById('ft-time');
  if(mc) mc.textContent = t;
  if(ft) ft.textContent = t;
}

function matchFilter(d){
  if(filter==='ALL') return true;
  if(filter==='ACTIVE') return d.status==='ACTIVE';
  if(filter==='UNDER STUDY') return d.status==='UNDER STUDY';
  return d.cat.toUpperCase()===filter;
}

function renderChips(){
  const el = document.getElementById('filter-chips');
  if(!el) return;
  el.innerHTML = CHIP_DEFS.map(c =>
    `<button class="hst-chip${c===filter?' hst-chip--on':''}" onclick="setFilter('${c}')">${esc(c)}</button>`
  ).join('');
}

function setFilter(f){ filter=f; renderChips(); renderDomains(); }

function renderDomains(){
  const el = document.getElementById('dom-rows');
  if(!el) return;
  const rows = STUDIED.filter(matchFilter);
  el.innerHTML = rows.map(d => {
    const col = statusColor(d.status);
    const idx = STUDIED.indexOf(d);
    return `<div class="dom-row" onclick="selectDomain(${idx})">
      <div class="dom-num">${esc(d.num)}</div>
      <div class="dom-main">
        <div class="dom-title">${esc(d.from)} &rarr; ${esc(d.to)}</div>
        <div class="dom-id">${esc(d.id)}</div>
        <div class="dom-sum">${esc(d.summary)}</div>
      </div>
      <div class="dom-cat">${esc(d.cat)}</div>
      <div class="dom-tool">${esc(d.tool)}</div>
      <div class="dom-find">${d.findings}</div>
      <div class="dom-stat"><span class="stat-badge" style="color:${col};"><span class="stat-dot" style="background:${col};"></span>${esc(d.status)}</span></div>
    </div>`;
  }).join('');
}

function renderDiagram(){
  const d = STUDIED[selIdx];
  const from = document.getElementById('diag-from');
  const to = document.getElementById('diag-to');
  const sig = document.getElementById('diag-sig');
  const meta = document.getElementById('diag-meta');
  const chips = document.getElementById('diag-chips');
  if(from) from.textContent = d.from;
  if(to) to.textContent = d.to;
  if(sig) sig.textContent = d.signal;
  if(meta) meta.textContent = d.id + ' · ' + d.status + ' · INSTRUMENT ' + d.tool;
  if(chips) chips.innerHTML = STUDIED.map((s,i) =>
    `<button class="hst-dchip${i===selIdx?' hst-dchip--on':''}" data-i="${i}">${esc(s.short)}</button>`
  ).join('');
}

function selectDomain(i){
  selIdx = i;
  pinned = true;
  renderDiagram();
  const s3 = document.getElementById('s3');
  if(s3) s3.scrollIntoView({behavior:'smooth',block:'start'});
}

function renderFindings(){
  const el = document.getElementById('find-list');
  if(!el) return;
  el.innerHTML = FINDINGS.map(f => {
    const sc = f.status==='PUBLISHED' ? '#6f9c7d' : '#a8772f';
    return `<a href="${f.url}" class="find-row">
      <div class="find-id">${esc(f.id)}</div>
      <div class="find-body">
        <div class="find-title">${esc(f.title)}</div>
        <div class="find-meta">${esc(f.domain)} · ${f.obs} OBSERVATIONS</div>
      </div>
      <div class="find-date">${esc(f.date)}</div>
      <div class="find-status" style="color:${sc};"><span style="width:6px;height:6px;border-radius:50%;background:${sc};display:inline-block;margin-right:6px;"></span>${esc(f.status)}</div>
    </a>`;
  }).join('');
}

function renderLog(){
  const el = document.getElementById('live-log');
  if(!el) return;
  el.innerHTML = activity.slice(0,11).map(e =>
    `<div class="log-row">
      <span class="log-t">${esc(e.t)}</span>
      <span class="log-code">${esc(e.code)}</span>
      <span class="log-dom">${esc(e.dom)}</span>
      <span class="log-msg">${esc(e.msg)}</span>
      <span class="log-d">${esc(e.d)}</span>
    </div>`
  ).join('');
}

function pushActivity(){
  oid++;
  const doms = ['HST-001','HST-002','HST-003'];
  const msgs = ['State-transition latency recorded','Recovery session closed','Signal coherence logged','Threshold crossing observed','Restoration window measured'];
  const e = {
    t: timeStr(),
    code: 'OBS-'+oid,
    dom: doms[Math.floor(Math.random()*doms.length)],
    msg: msgs[Math.floor(Math.random()*msgs.length)],
    d: 'Δ −'+(2+Math.random()*4).toFixed(1)+'s',
  };
  activity = [e,...activity].slice(0,11);
  renderLog();
}

function tick(){
  obsCount += 1+Math.floor(Math.random()*2);
  const oc = document.getElementById('obs-count');
  if(oc) oc.textContent = obsCount.toLocaleString('en-US');
  pushActivity();
}

document.addEventListener('DOMContentLoaded', function(){
  updateClock();
  renderChips();
  renderDomains();
  renderDiagram();
  renderFindings();
  renderLog();

  document.addEventListener('click', function(e){
    if(e.target.matches('[data-i]')){
      selectDomain(parseInt(e.target.getAttribute('data-i'),10));
    }
  });

  setInterval(updateClock, 1000);
  setInterval(function(){
    if(!pinned){ selIdx=(selIdx+1)%STUDIED.length; renderDiagram(); }
  }, 4200);
  setInterval(tick, 5200);
});