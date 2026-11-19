
(()=>{'use strict';
const $=id=>document.getElementById(id);
const NS='http://www.w3.org/2000/svg';
const reduce=()=>window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const state={intro:'closed',flowers:[],openedNotes:new Set(),modal:null,lastFocus:null};
const STORE='maha.pause.bouquet.v3';
const getSaved=()=>{try{const a=JSON.parse(localStorage.getItem(STORE));return Array.isArray(a)&&a.length<=7&&a.every(n=>Number.isInteger(n)&&n>=0&&n<13)?a:[]}catch{return []}};
const persist=()=>{try{localStorage.setItem(STORE,JSON.stringify(state.flowers))}catch{}};
function nav(id){const target=$(id);if(!target)return;const active=document.activeElement;if(active&&active!==document.body&&typeof active.blur==='function')active.blur();const y=Math.max(0,Math.round(target.getBoundingClientRect().top+window.scrollY));try{window.scrollTo({top:y,left:0,behavior:reduce()?'auto':'smooth'})}catch{window.scrollTo(0,y)}}
function on(id,fn){const el=$(id);if(el)el.addEventListener('click',fn)}
const introCard=$('letter');
on('open-letter',()=>{
 if(state.intro!=='closed')return;state.intro='opening';
 const env=$('open-letter');env.disabled=true;env.setAttribute('aria-expanded','true');
 $('intro-prompt').hidden=true;$('intro-skip').hidden=true;
 // Let the envelope finish its own animation before introducing new tap targets.
 env.classList.add('opening');
 setTimeout(()=>{
   env.hidden=true;introCard.hidden=false;state.intro='open';
 },reduce()?0:480);
});
function releaseHearts(target){if(reduce())return;const rect=target.getBoundingClientRect();for(let i=0;i<9;i++){const h=document.createElement('span');h.className='confetti';h.textContent=i%2?'♡':'♥';h.style.left=(rect.left+rect.width*(.2+Math.random()*.6))+'px';h.style.top=(Math.max(40,rect.top)+rect.height*.45)+'px';document.body.appendChild(h);setTimeout(()=>h.remove(),1650)}}
function chooseHug(yes){
 if(state.intro!=='open')return;state.intro='answered';
 const main=$('letter-copy'),reply=$('hug-reply');const height=introCard.getBoundingClientRect().height;
 introCard.style.minHeight=Math.max(270,Math.ceil(height))+'px';
 main.hidden=true;reply.hidden=false;
 $('hug-title').textContent=yes?'Consider yourself hugged. ♡':'No hug? Understood.';
 $('hug-text').textContent=yes?'A gentle, very long virtual hug. No questions, no speeches. Just a little warmth arriving with the worst delivery service imaginable.':'Fair enough. Your little courier respects that. They have officially switched departments and are now responsible for delivering flowers.';
 // Debounce newly shown continue button against touch-through/ghost clicks.
 $('hug-next').disabled=true;setTimeout(()=>{$('hug-next').disabled=false},450);
 if(yes)releaseHearts(introCard);
}
on('hug-yes',()=>chooseHug(true));on('hug-no',()=>chooseHug(false));
on('hug-next',()=>nav('flowers'));on('intro-skip',()=>nav('flowers'));
const species=[
{name:'Rose',petals:8,shape:'rose',color:'#c66d80',center:'#e4b1ae'},
{name:'Daisy',petals:12,shape:'slim',color:'#fff1d9',center:'#e6b24f'},
{name:'Sunflower',petals:14,shape:'slim',color:'#e7aa46',center:'#73513d'},
{name:'Tulip',petals:3,shape:'tulip',color:'#e28b8b',center:'#f0c3a3'},
{name:'Peony',petals:11,shape:'round',color:'#daa0b0',center:'#f0c4bc'},
{name:'Lily',petals:6,shape:'long',color:'#f6e0bd',center:'#bd8958'},
{name:'Orchid',petals:5,shape:'round',color:'#ba9bc6',center:'#efc3af'},
{name:'Lavender',petals:9,shape:'slim',color:'#a58dbb',center:'#d6c2e0'},
{name:'Jasmine',petals:7,shape:'long',color:'#fff7e5',center:'#e6c17d'},
{name:'Frangipani',petals:5,shape:'round',color:'#f8dfb7',center:'#e7ae69'},
{name:'Hibiscus',petals:5,shape:'round',color:'#d66e72',center:'#efc492'},
{name:'Iris',petals:6,shape:'long',color:'#8b81b3',center:'#edbd7c'},
{name:'Lotus',petals:10,shape:'long',color:'#dca3b2',center:'#f5d0a1'}
];
const points=[[220,98],[165,121],[277,121],[119,176],[321,176],[188,196],[252,198]];
const make=(type,attrs={})=>{const el=document.createElementNS(NS,type);for(const [k,v] of Object.entries(attrs))el.setAttribute(k,String(v));return el};
function bloom(spec,x,y,r){
 const g=make('g',{transform:'translate('+x+' '+y+')'});
 if(spec.shape==='tulip'){
  g.appendChild(make('path',{d:'M -23 12 Q -34 -8 -23 -31 Q -10 -28 0 -14 Q 12 -31 24 -32 Q 33 -8 22 12 Q 13 31 0 32 Q -17 25 -23 12 Z',fill:spec.color,stroke:'#77535a55','stroke-width':1.5}));
  g.appendChild(make('path',{d:'M -13 -23 Q 0 -6 0 24 Q 5 -4 13 -23',fill:'none',stroke:'#f4c3c0','stroke-width':2}));
  return g;
 }
 if(spec.shape==='rose'){
  for(let k=spec.petals-1;k>=0;k--){const a=k*360/spec.petals;g.appendChild(make('path',{d:'M 0 -10 C -31 -47 -37 -10 -18 7 C -11 15 -2 19 0 19 C 9 7 18 -1 13 -12 Z',transform:'rotate('+a+')',fill:k%2?spec.color:'#d17c8c',stroke:'#9f566a55','stroke-width':1}))}
  g.appendChild(make('path',{d:'M -15 0 Q -4 -17 14 -3 Q 18 14 0 17 Q -17 15 -15 0Z',fill:spec.color,stroke:'#99506c','stroke-width':2}));
  g.appendChild(make('path',{d:'M -7 -4 Q 10 -11 7 4 Q 0 12 -6 5',fill:'none',stroke:'#f0b4bb','stroke-width':2.2,'stroke-linecap':'round'}));return g;
 }
 for(let k=0;k<spec.petals;k++){
  const pet=make('ellipse',{cx:0,cy:-r*.59,rx:spec.shape==='slim'?r*.22:spec.shape==='long'?r*.28:r*.38,ry:spec.shape==='slim'?r*.78:spec.shape==='long'?r*.84:r*.64,fill:spec.color,stroke:'#88666a38','stroke-width':1,transform:'rotate('+(k*360/spec.petals)+')'});
  g.appendChild(pet);
 }
 g.appendChild(make('circle',{r:r*.29,fill:spec.center,stroke:'#fff0d890','stroke-width':1.5}));
 if(spec.name==='Sunflower'){for(let j=0;j<6;j++){g.appendChild(make('circle',{cx:Math.sin(j*2.4)*r*.15,cy:Math.cos(j*2.4)*r*.15,r:1.4,fill:'#f0d0a1'}))}}
 if(spec.name==='Hibiscus'){g.appendChild(make('path',{d:'M 0 5 Q 7 21 14 27',stroke:'#eabe78','stroke-width':2,fill:'none'}));g.appendChild(make('circle',{cx:14,cy:27,r:3,fill:'#f8d88d'}))}
 return g;
}
function render(){
 const selected=state.flowers,stems=$('stems'),heads=$('blossoms');stems.replaceChildren();heads.replaceChildren();
 selected.forEach((num,i)=>{
  const [x,y]=points[i];const stem=make('path',{d:'M220 365 Q'+(x+15)+' 270 '+x+' '+(y+8),stroke:i%3?'#739267':'#638767','stroke-width':5,fill:'none','stroke-linecap':'round'});stems.appendChild(stem);
  const ly=y+62, lx=(x+220)/2;
  stems.appendChild(make('ellipse',{cx:lx,cy:ly,rx:9,ry:20,fill:i%2?'#86a577':'#719773',transform:'rotate('+(i%2?-38:38)+' '+lx+' '+ly+')'}));
  heads.appendChild(bloom(species[num],x,y,34));
 });
 const complete=selected.length===7;
 $('paper-wrap').toggleAttribute('hidden',!complete);$('gift-tag').toggleAttribute('hidden',!complete);
 $('placeholder').toggleAttribute('hidden',selected.length!==0);
 $('completion').hidden=!complete;
 $('count').textContent=selected.length+' OF 7 FLOWERS';
 $('flower-status').textContent=complete?'Wrapped, ribbon tied, and a little tag just for you. ♡':selected.length?(7-selected.length)+' more to go. Take your time.':'Choose whichever flower you like.';
 $('undo').disabled=selected.length===0;$('reset').disabled=selected.length===0;
 document.querySelectorAll('.flower-choice').forEach(b=>b.disabled=complete);
 $('bouquet-art').setAttribute('aria-label',complete?'A completed bouquet of seven flowers, wrapped and tagged for Maha':selected.length+' flowers chosen so far');
}
function finishAnimation(){
 const wrap=$('paper-wrap'),tag=$('gift-tag');
 wrap.classList.remove('wrapped');tag.classList.remove('tagged');
 void wrap.getBoundingClientRect();
 if(!reduce()){wrap.classList.add('wrapped');tag.classList.add('tagged')}
}
function pick(n){if(state.flowers.length===7)return;state.flowers.push(n);persist();render();if(state.flowers.length===7)finishAnimation()}
const grid=$('flower-grid');
species.forEach((spec,n)=>{
 const b=document.createElement('button');b.type='button';b.className='flower-choice';b.setAttribute('aria-label','Add '+spec.name+' to bouquet');
 const slot=document.createElement('span');slot.className='mini';
 const mini=make('svg',{viewBox:'-42 -44 84 88','aria-hidden':'true'});mini.appendChild(bloom(spec,0,0,29));slot.appendChild(mini);
 const name=document.createElement('span');name.className='name';name.textContent=spec.name;
 b.append(slot,name);b.addEventListener('click',()=>pick(n));grid.appendChild(b);
});
on('undo',()=>{if(!state.flowers.length)return;state.flowers.pop();persist();$('paper-wrap').classList.remove('wrapped');$('gift-tag').classList.remove('tagged');render()});
on('reset',()=>{state.flowers=[];persist();$('paper-wrap').classList.remove('wrapped');$('gift-tag').classList.remove('tagged');render()});
on('open-notes',()=>nav('notes'));
function svgDownload(){const art=$('bouquet-art').cloneNode(true);art.querySelectorAll('[hidden]').forEach(el=>el.remove());art.querySelectorAll('.wrapped,.tagged').forEach(el=>el.removeAttribute('class'));art.setAttribute('xmlns',NS);art.setAttribute('width','880');art.setAttribute('height','960');const bg=make('rect',{width:440,height:480,fill:'#fff8ee'});art.insertBefore(bg,art.firstChild);return new XMLSerializer().serializeToString(art)}
function downloadable(url,name){const a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove()}
function blobDownload(blob,name){const url=URL.createObjectURL(blob);downloadable(url,name);setTimeout(()=>URL.revokeObjectURL(url),7000)}
async function saveBouquet(){
 const button=$('save-bouquet');button.disabled=true;
 try{
  const svgText=svgDownload();const blob=new Blob([svgText],{type:'image/svg+xml;charset=utf-8'});
  const img=new Image(),url=URL.createObjectURL(blob);
  try{
   await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=()=>reject(Error('image'));img.src=url});
   const canvas=document.createElement('canvas');canvas.width=880;canvas.height=960;
   const ctx=canvas.getContext('2d');if(!ctx)throw Error('canvas');
   ctx.drawImage(img,0,0,880,960);
   const png=await new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(Error('png')),'image/png'));
   blobDownload(png,'a-little-bouquet-for-maha.png');$('flower-status').textContent='Saved as a picture. ♡';
  }catch{blobDownload(blob,'a-little-bouquet-for-maha.svg');$('flower-status').textContent='Bouquet saved as an SVG picture. ♡'}
  finally{URL.revokeObjectURL(url)}
 }catch{$('flower-status').textContent='If saving is unavailable here, take a screenshot to keep it. ♡'}
 finally{button.disabled=false}
}
on('save-bouquet',saveBouquet);
const notes=[
{title:'a quiet minute',body:'If I could arrive with something warm, sit somewhere nearby, and make the day a little less noisy, I would. We would not even have to talk. Just being there would be enough.'},
{title:'permission to do absolutely nothing',body:'No cheerful reply required. No need to explain your mood, make plans, or turn today into a productive day. You can just be here, exactly as you are.'},
{title:'no advice enclosed',body:'I know a few flowers and a silly website will not sort everything happening around you. They are not meant to. I just wanted this corner to ask nothing of you.'},
{title:'a shipping update',body:'Apparently the internet still cannot deliver an actual hug. I have filed an extremely serious complaint. Until someone fixes that, the virtual version will have to do. 🫂'},
{title:'a little reminder',body:'It is not only one person who cares about you. There are people here for the everyday moments, the difficult ones, and all the ordinary bits in between. We are with you.'},
{title:'the florist confesses',body:'The bouquet was always supposed to be yours. I thought it would mean more if you could pick each bloom yourself. And yes, I definitely spent too long thinking about the wrapping.'},
{title:'just before you go',body:'I have been making this little world for you for a while. There is more to come, but I wanted to share this tiny piece now. If it gave you one softer moment today, that is plenty.'}
];
const noteGrid=$('note-grid');let opener=null;
function openNote(i,button){
 if(state.modal!==null)return;state.modal=i;state.lastFocus=button;opener=button;
 $('note-dialog-title').textContent=notes[i].title;
 $('note-dialog-text').textContent=notes[i].body;
 const modal=$('note-modal');modal.hidden=false;document.body.classList.add('modal-open');
 $('close-note').focus({preventScroll:true});state.openedNotes.add(i);button.querySelector('.note-hint').textContent='READ AGAIN';
}
function closeNote(){if(state.modal===null)return;state.modal=null;$('note-modal').hidden=true;document.body.classList.remove('modal-open');if(opener&&opener.isConnected)opener.focus({preventScroll:true});opener=null}
notes.forEach((note,i)=>{
 const b=document.createElement('button');b.type='button';b.className='note-card';b.setAttribute('aria-haspopup','dialog');b.setAttribute('aria-label','Open note: '+note.title);
 const stamp=document.createElement('span');stamp.className='note-stamp';stamp.textContent=['✉','❧','♡','✷','✦','✿','⌁'][i];
 const label=document.createElement('span');label.className='note-title';label.textContent=note.title;
 const hint=document.createElement('span');hint.className='note-hint';hint.textContent='TAP TO OPEN';
 b.append(stamp,label,hint);b.addEventListener('click',()=>openNote(i,b));noteGrid.appendChild(b);
});
on('close-note',closeNote);on('close-note-bottom',closeNote);
$('note-modal').addEventListener('click',event=>{if(event.target===$('note-modal'))closeNote()});
document.addEventListener('keydown',event=>{
 if(state.modal===null)return;
 if(event.key==='Escape'){event.preventDefault();closeNote()}
 if(event.key==='Tab'){
  const card=$('note-modal').querySelector('.modal-card');const focusables=[...card.querySelectorAll('button:not([disabled]),a[href]')];
  if(!focusables.length)return;const first=focusables[0],last=focusables[focusables.length-1];
  if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}
  else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
 }
});
on('to-ending',()=>nav('ending'));
state.flowers=getSaved();render();
})();
