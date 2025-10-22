const THRESHOLD_KEEP=4,POP_AFTER_MS=2200;
const keywordScores={
"gia đình":5,"cha mẹ":5,"bố mẹ":5,"ông bà":5,"anh em":4,"bạn thân":4,"sức khỏe":5,"bản thân":5,"bình yên":5,
"mục tiêu":4,"ước mơ":5,"đam mê":5,"tự do":4,"trung thực":4,"tử tế":5,"biết ơn":5,"kiên nhẫn":4,
"học":4,"thi":4,"ôn thi":4,"cải thiện":4,"rèn luyện":4,"tự học":4,"kỷ luật":4,"động lực":4,"tập trung":4,
"đánh mất bản thân":5,"bản sắc":5,"sống đúng với mình":5,"nói lên ý kiến":4,"dám thử":4,"cơ hội tốt":4,
"điểm thấp hơn bạn":2,"không bằng người khác":2,"thua kém":2,"kém nổi bật":2,"không nổi bật":2,"không được khen":2,
"người yêu":2,"ế":1,"không ai để ý":2,"không ai nhắn":2,"bị bỏ rơi":2,"không được rủ":2,"không có nhóm":2,
"ít like":1,"ít follow":1,"follow ít":1,"không trend":1,"không biết trend":1,"không bắt trend":1,"không hot":1,"không viral":1,
"xấu":1,"mập":1,"gầy":1,"đen":1,"mụn":1,"xấu trai":1,"xấu gái":1,"không đẹp":1,"không ăn mặc hợp trend":1,"mặt xấu":1,
"không có tiền":2,"nghèo":2,"nhà không giàu":2,"không đồ hiệu":2,"không điện thoại mới":2,"không đi du lịch":2,
"bị nói xấu":2,"bị cười":2,"bị đánh giá":2,"bị xem là kỳ lạ":2,"quê":2,"nhạt":1,"lo lắng":1,"bỏ lỡ":1,"áp lực":1,"bồn chồn":1,"ghen tị":1,"stress":1};
function getSentenceScore(s){s=(s||"").toLowerCase().trim();if(!s)return 0;let t=0;for(const[e,o]of Object.entries(keywordScores))s.includes(e)&&(t+=o);return t||1}
const $=e=>document.querySelector(e),$$=e=>Array.from(document.querySelectorAll(e));
function createInput(){const e=document.createElement("div");e.className="row";const t=document.createElement("input");t.type="text",t.className="inp",t.placeholder="Nhập điều bạn đang sợ bỏ lỡ…";const n=document.createElement("button");n.className="ghost",n.type="button",n.textContent="Xoá",n.onclick=()=>e.remove(),e.appendChild(t),e.appendChild(n),$(".inputs").appendChild(e),t.focus()}
function createBubble(e,t,n="normal"){const o=document.createElement("div");return o.className="bubble"+("big"===n?" big":"small"===n?" small":""),o.textContent=e||"...",o.style.left=`calc(${t}% - ${"big"===n?"88":"69"}px)`,o.style.animationDelay=`${.1+1.4*Math.random()}s`,$(".sky").appendChild(o),o}
function popBubble(e){return e?(e.classList.add("pop"),new Promise((t=>setTimeout((()=>{e.remove(),t()}),900)))):Promise.resolve()}
function markKeep(e){e&&e.classList.add("keep")}
function showModal(e){const t=$(".modal");$(".modal .content").innerHTML=e,t.classList.add("show")}function closeModal(){$(".modal").classList.remove("show")}
document.addEventListener("DOMContentLoaded",(()=>{$("#add").addEventListener("click",createInput),$("#go").addEventListener("click",runFilter),$("#reset").addEventListener("click",resetAll),$("#close").addEventListener("click",closeModal);for(let e=0;e<3;e++)createInput()}));
function readInputs(){return $$(".inp").map((e=>e.value.trim())).filter(Boolean)}
async function runFilter(){$(".result").innerHTML="",$(".sky").innerHTML="",closeModal();const e=readInputs();if(0===e.length)return void($(".result").innerHTML='<span class="tip">Hãy viết ít nhất 1 điều để Tầng Không lọc giúp bạn.</span>');const t=e.map((e=>({text:e,score:getSentenceScore(e)}))),n=[],o=[];t.forEach((e=>{(e.score>=THRESHOLD_KEEP?n:o).push(e)}));const i=t.length,r=Array.from({length:i},((e,t)=>6+88/((i-1)||1)*t)),a=[];t.forEach(((e,t)=>{const i=e.score>=6?"big":e.score<THRESHOLD_KEEP?"small":"normal",s=createBubble(e.text,r[t],i);if(e.score>=THRESHOLD_KEEP)markKeep(s);else{const e=POP_AFTER_MS+1600*Math.random();a.push(new Promise((t=>{setTimeout((async()=>{await popBubble(s),t()}),e)})))}})),await Promise.all(a),await new Promise((e=>setTimeout(e,700)));const s=n.map((e=>`“${e.text}”`)).join(", "),l=o.map((e=>`“${e.text}”`)).join(", "),c=n.length?`Những nỗi sợ được giữ lại vì chúng phản ánh <b>mong muốn phát triển thật</b> — không phải để được nhìn nhận. Đó là <b>năng lượng sống lành mạnh</b>, chỉ cần chuyển hướng cho đúng.`:`Có vẻ những điều vừa thả phần lớn là lớp sương FOMO — không phải điều trái tim bạn thật sự cần giữ.`,d=o.length?`Những điều ${l?`(${l})`:""} bị tan vì chúng <b>độc hại, xuất phát từ FOMO</b>: so sánh xã hội, áp lực nổi bật, chuẩn mực bề ngoài.`:`Hôm nay không có điều nào cần tan cả — cũng ổn. Điều quan trọng là bạn đã nhìn lại.`;showModal(`
    <h3>Nhắn riêng cho bạn</h3>
    <p>${n.length?`Sau tất cả, ${s} là điều quan trọng với bạn ngay lúc này.`:""}</p>
    <p>${c}</p>
    <p>${d}</p>
    <p>Cứ đi chậm thôi: ghi lại, thở đều, làm điều nhỏ gần nhất trong tầm tay. Rất nhiều người trước bạn cũng đã thả những bong bóng như vậy — và rồi họ vượt qua.</p>
    <div class="cta">
      <a class="btn" href="https://www.facebook.com/profile.php?id=61580386329472" target="_blank" rel="noopener">Trò chuyện với FOMO Buddy</a>
      <button onclick="closeModal()">Đóng</button>
    </div>`)}function resetAll(){$(".inputs").innerHTML="";for(let e=0;e<3;e++)createInput();$(".sky").innerHTML="";$(".result").textContent="",closeModal()}