/* ---------- رسم الكرة ---------- */
function poly(cx, cy, r, start) {
  let pts = [];
  for (let k = 0; k < 5; k++) {
    const a = start + k * 72 * Math.PI / 180;
    pts.push((cx + r * Math.cos(a)).toFixed(1) + ',' + (cy + r * Math.sin(a)).toFixed(1));
  }
  return pts.join(' ');
}

function drawBall(svg) {
  let s = '<defs><clipPath id="clip' + svg.id + '"><circle cx="100" cy="100" r="94"/></clipPath>' +
    '<radialGradient id="sh' + svg.id + '" cx="35%" cy="30%" r="75%">' +
    '<stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/>' +
    '<stop offset="1" stop-color="#000" stop-opacity=".28"/></radialGradient></defs>';
  s += '<circle cx="100" cy="100" r="94" fill="var(--c1)"/>';
  s += '<g clip-path="url(#clip' + svg.id + ')" stroke="var(--c2)" stroke-width="2" stroke-linejoin="round">';
  s += '<polygon points="' + poly(100, 100, 26, -Math.PI / 2) + '" fill="var(--c2)"/>';
  for (let k = 0; k < 5; k++) {
    const a = (-90 + k * 72) * Math.PI / 180;
    const cx = 100 + 80 * Math.cos(a), cy = 100 + 80 * Math.sin(a);
    s += '<polygon points="' + poly(cx, cy, 25, a + Math.PI) + '" fill="var(--c2)"/>';
    s += '<line x1="' + (100 + 26 * Math.cos(a)).toFixed(1) + '" y1="' + (100 + 26 * Math.sin(a)).toFixed(1) +
         '" x2="' + (100 + 55 * Math.cos(a)).toFixed(1) + '" y2="' + (100 + 55 * Math.sin(a)).toFixed(1) + '" fill="none"/>';
  }
  s += '</g><circle cx="100" cy="100" r="94" fill="url(#sh' + svg.id + ')"/>';
  s += '<circle cx="100" cy="100" r="94" fill="none" stroke="var(--c2)" stroke-width="2"/>';
  svg.innerHTML = s;
}

document.querySelectorAll('.ball').forEach((b, i) => { if (!b.id) b.id = 'b' + i; drawBall(b); });

/* ---------- تصميم الكرة ---------- */
const designBall = document.getElementById('designBall');
const c1 = document.getElementById('c1'), c2 = document.getElementById('c2');
function applyColors(a, b) {
  designBall.style.setProperty('--c1', a);
  designBall.style.setProperty('--c2', b);
  c1.value = a; c2.value = b;
}
c1.addEventListener('input', () => applyColors(c1.value, c2.value));
c2.addEventListener('input', () => applyColors(c1.value, c2.value));
document.querySelectorAll('.presets button').forEach(btn =>
  btn.addEventListener('click', () => applyColors(btn.dataset.a, btn.dataset.b)));
applyColors('#ffffff', '#15211b');

/* ---------- الاختبار ---------- */
const questions = [
  { q: 'ما المادة التي تحبس الهواء داخل الكرة؟', o: ['المثانة المطاطية', 'الخيط', 'الحبر'], a: 0 },
  { q: 'كم قطعة في الكرة التقليدية؟', o: ['١٢ قطعة', '٣٢ قطعة', '٦٤ قطعة'], a: 1 },
  { q: 'ما فائدة طبقات القماش داخل الكرة؟', o: ['تغيير اللون', 'إعطاء القوة والشكل', 'تقليل الوزن فقط'], a: 1 },
  { q: 'أي كرة لا تحتاج إلى خيوط؟', o: ['الكرة الملصقة بالحرارة', 'الكرة المخاطة يدويًا', 'كلتاهما'], a: 0 },
  { q: 'متى نُدخل المثانة؟', o: ['بعد النفخ', 'قبل إغلاق الغرزة الأخيرة', 'قبل القص'], a: 1 },
  { q: 'من اختبارات الجودة:', o: ['قياس المحيط والوزن والارتداد', 'عدّ الألوان فقط', 'قياس طول الخيط'], a: 0 }
];
const box = document.getElementById('quizBox');
let i = 0, score = 0;

function showQ() {
  const q = questions[i];
  box.innerHTML = '<div class="meta">السؤال ' + (i + 1) + ' من ' + questions.length + '</div><h3></h3><div class="opts"></div>';
  box.querySelector('h3').textContent = q.q;
  const opts = box.querySelector('.opts');
  q.o.forEach((t, idx) => {
    const b = document.createElement('button');
    b.className = 'opt'; b.textContent = t;
    b.onclick = () => answer(b, idx);
    opts.appendChild(b);
  });
}

function answer(btn, idx) {
  const q = questions[i];
  const all = box.querySelectorAll('.opt');
  all.forEach(b => b.disabled = true);
  all[q.a].classList.add('right');
  if (idx === q.a) score++; else btn.classList.add('wrong');
  const next = document.createElement('button');
  next.className = 'btn';
  next.textContent = i === questions.length - 1 ? 'شاهد النتيجة' : 'السؤال التالي';
  next.onclick = () => { i++; i < questions.length ? showQ() : showResult(); };
  box.appendChild(next);
}

function showResult() {
  const msg = score >= 5 ? 'ممتاز! أنت خبير صناعة كرات.' : score >= 3 ? 'جيد! راجع المراحل وأعد المحاولة.' : 'حاول مرة أخرى بعد قراءة المراحل.';
  box.innerHTML = '<h3>نتيجتك: ' + score + ' من ' + questions.length + '</h3><p>' + msg + '</p>';
  const r = document.createElement('button');
  r.className = 'btn'; r.textContent = 'أعد الاختبار';
  r.onclick = () => { i = 0; score = 0; showQ(); };
  box.appendChild(r);
}
showQ();
