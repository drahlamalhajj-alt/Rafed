let state = {};
function val(id){ return Number(document.getElementById(id).value) || 0; }
function analyzeBudget(){
  const income = val('income');
  const needs = val('needs');
  const wants = val('wants');
  const goalSave = val('savingGoal');
  const goal = document.getElementById('goal').value;
  if(income <= 0){ alert('الرجاء إدخال دخل شهري صحيح.'); return; }
  if(needs < 0 || wants < 0 || goalSave < 0){ alert('الرجاء إدخال أرقام موجبة فقط.'); return; }
  const total = needs + wants;
  const surplus = income - total;
  const rate = (surplus / income) * 100;
  const spendRate = (total / income) * 100;
  const wantsRate = (wants / income) * 100;
  let status = '';
  let cls = '';
  if(surplus < 0){ status = 'عجز مالي يحتاج إلى تقليل المصروفات فوراً'; cls = 'bad'; }
  else if(rate < 10){ status = 'ادخار منخفض ويحتاج إلى خطة ضبط شهرية'; cls = 'warn'; }
  else if(rate < 20){ status = 'وضع مقبول مع فرصة لتحسين الادخار'; cls = 'warn'; }
  else { status = 'ميزانية ممتازة ومتوازنة'; cls = 'good'; }
  const advice = surplus >= goalSave ? 'هدف الادخار الشهري قابل للتحقيق حالياً، ويمكن تثبيته بتحويل تلقائي بداية كل شهر.' : 'الهدف يحتاج إلى تقليل المصاريف الكمالية أو زيادة دخل جانبي بسيط.';
  state = {income, needs, wants, goalSave, total, surplus, rate, spendRate, wantsRate, goal, status, advice};
  const report = document.getElementById('report');
  report.style.display = 'block';
  report.innerHTML = '<h2>📊 تقريرك المالي الأولي</h2>' +
    '<div class="metric"><b>إجمالي المصروفات</b><br><span>' + total.toFixed(0) + ' ريال</span></div>' +
    '<div class="metric"><b>المتبقي بعد المصروفات</b><br><span class="' + (surplus < 0 ? 'bad' : 'good') + '">' + surplus.toFixed(0) + ' ريال</span></div>' +
    '<div class="metric"><b>نسبة الإنفاق</b><br><span>' + spendRate.toFixed(1) + '%</span></div>' +
    '<div class="metric"><b>نسبة الادخار المتوقعة</b><br><span class="' + (rate < 10 ? 'warn' : 'good') + '">' + rate.toFixed(1) + '%</span></div>' +
    '<b>تصنيف الميزانية:</b> <span class="' + cls + '">' + status + '</span><br>' +
    '<b>النصيحة المالية:</b> ' + advice + '<br>' +
    '<b>تخطيط BudgetAI:</b> هدفك الحالي هو "' + goal + '"، ونوصي بمراجعة المصروفات الكمالية أسبوعياً وتثبيت مبلغ الادخار أولاً.';
  report.scrollIntoView({behavior:'smooth', block:'nearest'});
}
function askAdvisor(){
  if(!state.income){ analyzeBudget(); if(!state.income) return; }
  const q = document.getElementById('question').value.trim();
  if(!q){ alert('اكتب سؤالاً للمستشار الذكي.'); return; }
  let reply = 'ابدأ بتسجيل المصروفات اليومية لمدة أسبوع، ثم صنفها إلى أساسية وكمالية، وبعدها حدد بنداً واحداً للتخفيض التدريجي دون التأثير على احتياجاتك الأساسية.';
  const text = q.toLowerCase();
  if(text.includes('ادخار') || text.includes('اوفر') || text.includes('أوفر') || text.includes('توفير')){
    reply = 'لزيادة الادخار بدون حرمان، اجعل التحويل إلى الادخار تلقائياً في بداية الشهر. بما أن المتبقي لديك ' + state.surplus.toFixed(0) + ' ريال، ابدأ بادخار ' + Math.max(100, state.surplus * 0.5).toFixed(0) + ' ريال ثم ارفع المبلغ تدريجياً.';
  } else if(text.includes('دين') || text.includes('ديون') || text.includes('قرض')){
    reply = 'رتب الديون من الأعلى تكلفة إلى الأقل، وخصص جزءاً ثابتاً للسداد قبل الكماليات. تجنب أي التزامات جديدة حتى تصل نسبة الادخار إلى 10% على الأقل.';
  } else if(text.includes('مصروف') || text.includes('كمالي') || text.includes('تقليل')){
    reply = 'المصاريف الكمالية تمثل ' + state.wantsRate.toFixed(1) + '% من دخلك. جرّب قاعدة 24 ساعة قبل الشراء، وضع سقفاً أسبوعياً للكماليات حتى لا تتجاوز الخطة.';
  } else if(text.includes('جهاز') || text.includes('سيارة') || text.includes('شراء')){
    reply = 'قسّم سعر الهدف على عدد الأشهر المتاحة، ثم اجعل هذا المبلغ بنداً ثابتاً باسم صندوق الشراء. لا تستخدم صندوق الطوارئ لهذا الهدف.';
  }
  const answer = document.getElementById('answer');
  answer.style.display = 'block';
  answer.innerHTML = '<h3>🤖 رد المستشار الذكي</h3><p>بناءً على سؤالك "' + q + '" وهدفك "' + state.goal + '"، ' + reply + '</p><span class="pill">50% أساسيات</span><span class="pill">30% كماليات</span><span class="pill">20% ادخار</span>';
  answer.scrollIntoView({behavior:'smooth', block:'nearest'});
}
document.getElementById('analyze').addEventListener('click', analyzeBudget);
document.getElementById('ask').addEventListener('click', askAdvisor);