
/* ===== BỂ BONG BÓNG — v7 ===== */
const THRESHOLD_KEEP = 4;      // >=4 giữ (phản ánh phát triển thật)
const POP_AFTER_MS   = 2200;   // bóng yếu bể sau ~2.2s

/* Expanded keywords — nhóm GIỮ (4–6) vs TAN (1–3) */
const keywordScores = {
  // GIỮ (phát triển thật)
  "gia đình":5,"cha mẹ":5,"bố mẹ":5,"ông bà":5,"anh em":4,"bạn thân":4,"sức khỏe":5,"bản thân":5,"bình yên":5,
  "mục tiêu":5,"ước mơ":5,"đam mê":5,"tương lai":4,"kỷ luật":4,"rèn luyện":4,"tự học":4,"tập trung":4,"cải thiện":4,
  "không đủ giỏi":5,"chưa đủ giỏi":5,"không đủ tốt":5,"chưa đủ tốt":5,"đánh mất bản thân":5,"bản sắc":5,"sống đúng với mình":5,
  "nói lên ý kiến":4,"dám thử":4,"cơ hội tốt":4,"phát triển bản thân":5,"tốt hơn":4,"cố gắng":4,"nỗ lực":4,"kiên nhẫn":4,
  // TAN (FOMO độc hại)
  "điểm thấp hơn bạn":2,"không bằng người khác":2,"thua kém":2,"kém nổi bật":2,"không nổi bật":2,"không được khen":2,
  "người yêu":2,"ế":1,"không ai để ý":2,"không ai nhắn":2,"bị bỏ rơi":2,"không được rủ":2,"không có nhóm":2,
  "ít like":1,"ít follow":1,"follow ít":1,"không trend":1,"không biết trend":1,"không bắt trend":1,"không hot":1,"không viral":1,
  "xấu":1,"mập":1,"gầy":1,"đen":1,"mụn":1,"xấu trai":1,"xấu gái":1,"không đẹp":1,"không ăn mặc hợp trend":1,"mặt xấu":1,
  "không có tiền":2,"nghèo":2,"nhà không giàu":2,"không đồ hiệu":2,"không điện thoại mới":2,"không đi du lịch":2,
  "bị nói xấu":2,"bị cười":2,"bị đánh giá":2,"bị xem là kỳ lạ":2,"quê":2,"nhạt":1,
  "lo lắng":1,"bỏ lỡ":1,"áp lực":1,"bồn chồn":1,"ghen tị":1,"stress":1
};

/* Boosters: nếu câu thể hiện ý định tích cực -> +1 */
const positiveBoost = [
  "cố gắng","nỗ lực","từng bước","tốt hơn","phát triển","học thêm","rèn luyện",
  "ôn lại","luyện tập","kiên nhẫn","tự tin","tự cải thiện","kế hoạch"
];

function getSentenceScore(s){
  s=(s||"").toLowerCase().trim();
  if(!s) return 0;
  let total=0;
  for(const [k,v] of Object.entries(keywordScores)){
    if(s.includes(k)) total+=v;
  }
  if(positiveBoost.some(k=>s.includes(k))) total += 1;
  return total || 1;
}

const $=sel=>document.querySelector(sel);
const $$=sel=>Array.from(document.querySelectorAll(sel));

function createInput(){
  const row=document.createElement('div'); row.className='row';
  const input=document.createElement('input'); input.type='text'; input.className='inp'; input.placeholder='Nhập điều bạn đang sợ bỏ lỡ…';
  const del=document.createElement('button'); del.className='ghost'; del.type='button'; del.textContent='Xoá'; del.onclick=()=>row.remove();
  row.appendChild(input); row.appendChild(del); $('.inputs').appendChild(row); input.focus();
}

function createBubble(text,xp,size='normal'){
  const b=document.createElement('div');
  b.className='bubble'+(size==='big'?' big':(size==='small'?' small':''));
  b.textContent=text||'...';
  b.style.left=`calc(${xp}% - ${size==='big'?'88':'69'}px)`;
  b.style.animationDelay=`${(Math.random()*1.4+0.1).toFixed(2)}s`;
  $('.sky').appendChild(b); return b;
}

function popBubble(b){ if(!b) return Promise.resolve(); b.classList.add('pop'); return new Promise(res=>setTimeout(()=>{b.remove();res();},900)); }
function markKeep(b){ if(b) b.classList.add('keep'); }

function showModal(html){ const m=$('.modal'); $('.modal .content').innerHTML=html; m.classList.add('show'); }
function closeModal(){ $('.modal').classList.remove('show'); }

document.addEventListener('DOMContentLoaded', ()=>{
  $('#add').addEventListener('click', createInput);
  $('#go').addEventListener('click', runFilter);
  $('#reset').addEventListener('click', resetAll);
  $('#close').addEventListener('click', closeModal);
  for(let i=0;i<3;i++) createInput();
});

function readInputs(){ return $$('.inp').map(i=>i.value.trim()).filter(Boolean); }

async function runFilter(){
  $('.result').innerHTML=''; $('.sky').innerHTML=''; closeModal();
  const inputs=readInputs(); if(!inputs.length){ $('.result').innerHTML='<span class="tip">Hãy viết ít nhất 1 điều để Bể Bong Bóng lọc giúp bạn.</span>'; return; }
  const scored=inputs.map(t=>({text:t,score:getSentenceScore(t)}));
  const keep=[], drop=[]; for(const it of scored){ (it.score>=THRESHOLD_KEEP?keep:drop).push(it); }
  const n=scored.length, positions=Array.from({length:n},(_,i)=>6+(88/((n-1)||1))*i);
  const popPromises=[];
  scored.forEach((it,idx)=>{
    const size = it.score>=6?'big':(it.score<THRESHOLD_KEEP?'small':'normal');
    const b=createBubble(it.text, positions[idx], size);
    if(it.score>=THRESHOLD_KEEP){ markKeep(b); }
    else{ const delay = POP_AFTER_MS + Math.random()*1600; popPromises.push(new Promise(res=>setTimeout(async()=>{await popBubble(b);res();},delay))); }
  });
  await Promise.all(popPromises); await new Promise(r=>setTimeout(r,700));
  const keptNames = keep.map(x=>`“${x.text}”`).join(", ");
  const droppedNames = drop.map(x=>`“${x.text}”`).join(", ");
  const keptText = keep.length
    ? `Những nỗi sợ này được giữ lại vì chúng phản ánh <b>mong muốn phát triển thật</b> — không phải để được nhìn nhận. Đó là <b>năng lượng sống lành mạnh</b>, chỉ cần chuyển hướng cho đúng.`
    : `Có vẻ phần lớn điều vừa thả là lớp sương FOMO — không phải điều trái tim bạn thật sự cần giữ.`;
  const dropText = drop.length
    ? `Những điều ${droppedNames?`(${droppedNames})`:""} bị tan vì chúng <b>độc hại, xuất phát từ FOMO</b>: so sánh xã hội, áp lực nổi bật, chuẩn mực bề ngoài.`
    : `Không có điều nào cần tan hôm nay — cũng tốt. Điều quan trọng là bạn đã nhìn lại.`;
  showModal(`
    <h3>Nhắn riêng cho bạn</h3>
    <p>${keep.length?`Sau tất cả, ${keptNames} là điều quan trọng với bạn ngay lúc này.`:""}</p>
    <p>${keptText}</p>
    <p>${dropText}</p>
    <p>Cứ đi chậm thôi: ghi lại, thở đều, làm điều nhỏ gần nhất trong tầm tay. Rất nhiều người trước bạn cũng đã thả những bong bóng như vậy — và rồi họ vượt qua.</p>
    <div class="cta">
      <a class="btn" href="https://www.facebook.com/profile.php?id=61580386329472" target="_blank" rel="noopener">Trò chuyện với FOMO Buddy</a>
      <button onclick="closeModal()">Đóng</button>
    </div>
  `);
}

function resetAll(){ $('.inputs').innerHTML=''; for(let i=0;i<3;i++) createInput(); $('.sky').innerHTML=''; $('.result').textContent=''; closeModal(); }
