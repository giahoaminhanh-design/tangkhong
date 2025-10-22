/* ===== Config ===== */
const THRESHOLD_KEEP = 4;
const POP_AFTER_MS   = 2000;
/* =================== */
const keywordScores = {
  "gia đình":5,"cha mẹ":5,"bố mẹ":5,"anh em":4,"bạn thân":4,"sức khỏe":5,"bản thân":5,"bình yên":5,
  "tương lai":4,"ước mơ":4,"lòng tốt":5,"tử tế":5,"tự do":4,"trung thực":4,
  "học":4,"thi":3,"làm việc":4,"nỗ lực":4,"mục tiêu":4,"điểm cao":3,"thành công":3,"học bổng":4,"tự học":4,"rèn luyện":4,"kiến thức":4,
  "bạn bè":3,"người yêu":2,"tình bạn":3,"kết nối":3,
  "bị bỏ rơi":1,"bị quên":1,"một mình":2,"không ai hiểu":2,"chia tay":2,
  "like":1,"follow":1,"trend":1,"hot":1,"viral":1,"được chú ý":1,"so sánh":1,"người khác":1,"bị tụt lại":1,"thua kém":1,"đi sau":1,"fomo":1,"sự kiện":2,"đi chơi":2,
  "bình an":5,"vui vẻ":4,"hạnh phúc":5,"biết ơn":5,"thư giãn":4,"ngủ ngon":4,"thảnh thơi":4,"tự tin":5,"nhẹ nhõm":5,"an yên":5,
  "lo lắng":1,"sợ":1,"bỏ lỡ":1,"áp lực":1,"mệt mỏi":1,"kiệt sức":1,"buồn":2,"tức giận":1,"ghen tị":1,"bồn chồn":1,"stress":1
};
function getSentenceScore(s){
  s=(s||"").toLowerCase().trim();
  if(!s) return 0;
  let total=0;
  for(const [k,v] of Object.entries(keywordScores)){
    if(s.includes(k)) total+=v;
  }
  return total || 1;
}
const $=sel=>document.querySelector(sel);
const $$=sel=>Array.from(document.querySelectorAll(sel));
function createInput(){
  const row=document.createElement('div');
  row.className='row';
  const input=document.createElement('input');
  input.type='text'; input.className='inp'; input.placeholder='Nhập điều bạn đang sợ bỏ lỡ…';
  const del=document.createElement('button');
  del.className='ghost'; del.type='button'; del.textContent='Xoá'; del.onclick=()=>row.remove();
  row.appendChild(input); row.appendChild(del);
  $('.inputs').appendChild(row);
  input.focus();
}
function createBubble(text,xp,size='normal'){
  const b=document.createElement('div');
  b.className='bubble'+(size==='big'?' big':(size==='small'?' small':''));
  b.textContent=text||'...';
  b.style.left=`calc(${xp}% - ${size==='big'?'88':'69'}px)`;
  const delay=(Math.random()*1.4)+0.1;
  b.style.animationDelay=`${delay}s`;
  $('.sky').appendChild(b);
  return b;
}
function popBubble(b){
  if(!b) return Promise.resolve();
  b.classList.add('pop');
  return new Promise(res=> setTimeout(()=>{ b.remove(); res(); }, 900));
}
function markKeep(b){ if(b) b.classList.add('keep'); }
function showModal(html){
  const m=$('.modal'); $('.modal .content').innerHTML = html; m.classList.add('show');
}
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
  const inputs=readInputs();
  if(!inputs.length){ $('.result').innerHTML='<span class="tip">Hãy viết ít nhất 1 điều để Tầng Không lọc giúp bạn.</span>'; return; }
  const scored=inputs.map(t=>({text:t, score:getSentenceScore(t)}));
  const keep=[], drop=[];
  for(const it of scored){ (it.score>=THRESHOLD_KEEP? keep: drop).push(it); }
  const n=scored.length;
  const positions=Array.from({length:n},(_,i)=> 6 + (88/((n-1)||1))*i);
  const popPromises=[];
  scored.forEach((it,idx)=>{
    const size = it.score>=6 ? 'big' : (it.score<THRESHOLD_KEEP ? 'small' : 'normal');
    const b=createBubble(it.text, positions[idx], size);
    if(it.score>=THRESHOLD_KEEP){
      markKeep(b);
    }else{
      const popDelay = POP_AFTER_MS + Math.random()*1400;
      popPromises.push(new Promise(res=>{
        setTimeout(async ()=>{ await popBubble(b); res(); }, popDelay);
      }));
    }
  });
  await Promise.all(popPromises);
  await new Promise(r=>setTimeout(r, 800));
  const keptNames = keep.map(x=>`“${x.text}”`).join(", ");
  const droppedNames = drop.map(x=>`“${x.text}”`).join(", ");
  let msg = "";
  if(keep.length){
    msg += `Sau tất cả, ${keptNames} là điều quan trọng nhất dành cho bạn ngay lúc này. `;
    msg += "Mình ở đây, cứ đi chậm thôi: ghi lại, thở đều, làm điều nhỏ gần nhất trong tầm tay. ";
    msg += "Nỗi sợ không phải kẻ thù — nó là tín hiệu. Khi bạn chăm nó bằng sự kiên nhẫn, nó sẽ hoá thành sức bật. ";
  }else{
    msg += "Sau tất cả, những điều vừa thả có lẽ chỉ là lớp sương ngoài rìa — ồn ào nhiều hơn sự thật. ";
    msg += "Thử tự hỏi: nếu không cần chứng minh gì với ai, bạn còn muốn giữ điều gì lại? ";
  }
  if(drop.length){
    msg += `<br><br>Những nỗi sợ còn lại ${droppedNames?`(${droppedNames})`:""} chỉ là phù du — bạn không cần ôm hết chúng đâu.`;
  }
  msg += " Có rất nhiều người trước bạn cũng từng thả những bong bóng như vậy — và rồi họ đã vượt qua.";
  showModal(`
    <h3>Nhắn riêng cho bạn</h3>
    <p>${msg}</p>
    <p>Nếu muốn biến điều quan trọng này thành thói quen hằng ngày, thử nhắn với người bạn đồng hành này nhé.</p>
    <div class="cta">
      <a class="btn" href="https://www.facebook.com/profile.php?id=61580386329472" target="_blank" rel="noopener">Trò chuyện với FOMO Buddy</a>
      <button onclick="closeModal()">Đóng</button>
    </div>
  `);
}
function resetAll(){
  $('.inputs').innerHTML='';
  for(let i=0;i<3;i++) createInput();
  $('.sky').innerHTML=''; $('.result').textContent=''; closeModal();
}
