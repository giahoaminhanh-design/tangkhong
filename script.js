
const keywordScores = {
  "gia đình":5,"cha mẹ":5,"bố mẹ":5,"anh em":4,"bạn thân":4,"sức khỏe":5,"bản thân":5,"bình yên":5,"tương lai":4,"ước mơ":4,"lòng tốt":5,"tử tế":5,"tự do":4,"trung thực":4,
  "học":4,"thi":3,"làm việc":4,"nỗ lực":4,"mục tiêu":4,"điểm cao":3,"thành công":3,"học bổng":4,"tự học":4,"rèn luyện":4,"kiến thức":4,"thời gian":3,"cải thiện":3,
  "bạn bè":3,"người yêu":3,"tình bạn":3,"kết nối":3,"gia sư":3,"bị bỏ rơi":1,"bị quên":1,"một mình":2,"không ai hiểu":2,"chia tay":2,
  "like":1,"follow":1,"trend":1,"hot":1,"viral":1,"được chú ý":1,"so sánh":1,"người khác":1,"bị tụt lại":1,"thua kém":1,"đi sau":1,"fomo":1,"sự kiện":2,"đi chơi":2,
  "bình an":5,"vui vẻ":4,"hạnh phúc":5,"biết ơn":5,"thư giãn":4,"ngủ ngon":4,"thảnh thơi":4,"tự tin":5,"nhẹ nhõm":5,"an yên":5,
  "lo lắng":1,"sợ":1,"bỏ lỡ":1,"áp lực":1,"mệt mỏi":1,"kiệt sức":1,"buồn":2,"tức giận":1,"ghen tị":1,"bồn chồn":1,"stress":1
};

function getSentenceScore(s){
  s=(s||"").toLowerCase();
  let total=0;
  for(const [k,v] of Object.entries(keywordScores)){
    if(s.includes(k)) total+=v;
  }
  if(s.length>=30) total+=1;
  return total||2;
}

const $=sel=>document.querySelector(sel);
const $$=sel=>Array.from(document.querySelectorAll(sel));

function createBubble(text,xp){
  const b=document.createElement('div');
  b.className='bubble';
  b.textContent=text||'...';
  b.style.left=`calc(${xp}% - 90px)`;
  const delay=(Math.random()*0.8)+0.2;
  b.style.animationDelay=`${delay}s`;
  $('.sky').appendChild(b);
  return b;
}

function popBubble(b){
  if(!b) return;
  b.classList.add('pop');
  setTimeout(()=>b.remove(),700);
  try{
    const ctx=new (window.AudioContext||window.webkitAudioContext)();
    const o=ctx.createOscillator(); const g=ctx.createGain();
    o.type='triangle'; o.frequency.value=520;
    g.gain.setValueAtTime(0.08, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime+0.12);
    o.connect(g).connect(ctx.destination); o.start(); o.stop(ctx.currentTime+0.13);
  }catch{}
}
function keepBubble(b){ if(b) b.classList.add('keep'); }

document.addEventListener('DOMContentLoaded', ()=>{
  $('#go').addEventListener('click', runFilter);
  $('#reset').addEventListener('click', resetAll);
});

function readInputs(){
  const vals=$$('.inp').map(i=>i.value.trim()).filter(Boolean);
  while(vals.length<5) vals.push('...');
  return vals.slice(0,5);
}

function runFilter(){
  $('.result').textContent='';
  $('.sky').innerHTML='';

  const inputs=readInputs();
  const scored=inputs.map(t=>({text:t, score:getSentenceScore(t)}));
  const sorted=[...scored].sort((a,b)=>b.score-a.score);
  const keepSet=new Set(sorted.slice(0,2).map(x=>x.text));

  const positions=[12,30,50,70,88];
  inputs.forEach((text,idx)=>{
    const b=createBubble(text,positions[idx]);
    if(keepSet.has(text)){
      setTimeout(()=>keepBubble(b), 1600+Math.random()*600);
    }else{
      setTimeout(()=>popBubble(b), 1800+Math.random()*1200);
    }
  });

  setTimeout(()=>{$('.result').textContent="Những điều còn lại — có lẽ là điều bạn thật sự cần chăm sóc.";},2600);
}

function resetAll(){
  $$('.inp').forEach(i=>i.value='');
  $('.sky').innerHTML='';
  $('.result').textContent='';
}
