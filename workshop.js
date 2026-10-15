/* Kolejne odsłony jednej planszy odpowiadają rytmowi scenariusza zajęć. */
const counts = [2,1,1,1,2,3,3,2,4,2,3,1,2,2,12,5,4,3,1,2];
let phase = 0;
let timerId = null;
let remaining = 0;
let deadline = 0;
const phaseNames = {
  0:['Otwarcie','Kontrakt'], 4:['Głosowanie','Pierwszy odruch'],
  5:['Szkoła jako mózg','Film o stresie','Po filmie'],
  6:['Film o FUD','FUD w 3 krokach','Wniosek'],
  7:['Kazus','Granica'], 8:['Film o złości','Głosowanie','Odpowiedź','Rozłóż oburzenie'],
  9:['Kazus','Granica'], 10:['Film o lojalności','Kiedy fakt brzmi jak atak','Wniosek'],
  12:['Kazus','Granica'], 13:['Sekwencja','Przerwa'],
  15:['Co było naprawdę','Narzędzia','Podobny kazus','Ola a anonimowe konto','Alergeny'],
  16:['Podział na podgrupy','Runda 1 · lęk','Runda 2 · złość','Runda 3 · lojalność'],
  17:['Porządkowanie karteczek','Co się powtórzyło?','Test granicy'],
  19:['Wspólny finał','Zakończenie']
};
function label(){return current===14 ? `Cytat ${Math.floor(phase/2)+1} · ${phase%2?'odpowiedź':'rozpoznaj'}` : phaseNames[current]?.[phase] || slides[current].title;}
function frame(title,body,{eye='',pic=slides[current].image,red=false}={}){
  return `<div class="slide-inner">${eye?`<p class="eyebrow">${eye}</p>`:''}<h1 class="title mid">${title}</h1><div class="split"><div class="work-content">${body}</div>${image(pic)}</div></div>`;
}
function call(text){return `<div class="callout">${text}</div>`;}
function cards(items){return `<div class="cards">${items.map(c=>`<article class="card"><strong>${c[0]}</strong>${c[1]}</article>`).join('')}</div>`;}
function timer(seconds){return `<div class="work-timer" data-seconds="${seconds}"><output aria-label="Pozostały czas">${formatTime(seconds)}</output><button class="work-button" id="timerToggle">Start ${seconds===10?'10 sekund':seconds/60+' minut'}</button><button class="work-button secondary" id="timerReset" aria-label="Wyzeruj odliczanie">Od nowa</button><p id="timerNotice" role="status"></p></div>`;}
function formatTime(s){return `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;}
function film(s,prompt=''){
  return `<div class="slide-inner"><p class="eyebrow">${s.eye}</p><h1 class="title mid">${s.mediaLabel}</h1>${prompt?`<p class="lead">${prompt}</p>`:''}<div class="film-stage">${media(s.media,s.mediaLabel)}</div></div>`;
}
function analysisCards(s){return frame(s.title,cards(s.cards)+call(s.call),{eye:s.eye.replace(/ · film .*/,'' )});}
const debrief = [
  ['Jak rozbroić FUD w 3 krokach?','Rozpoznaj lęk → sprawdź dowody i skalę → zatrzymaj presję.'],
  ['Który kazus był podobny?','5G: zbieżność w czasie to nie przyczyna. Zachorowanie po zjedzeniu ciasta samo nie dowodzi, że ciasto było przyczyną.'],
  ['Czym różni się Ola od @prawda_pod_lipami?','Ola przekazała fałsz w dobrej wierze — misinformacja. Konto świadomie podkręcało fałszywą historię — dezinformacja.'],
  ['Czy pytanie o alergeny było uzasadnione?','Tak. Pytać wolno. Manipulacją jest przypuszczenie podane jako fakt i gotowy winny.']
];
function reveal(answer){return `<button class="work-button" id="reveal">Odsłoń po rozmowie</button><div id="answer" class="answer" hidden>${answer}</div>`;}
function renderWorkshop(s){
  if(current===0 && phase===1) return frame('Pracujemy na symulacji',`<p class="lead">Analizujemy przekaz, nie ludzi.</p><p class="lead">Każdy może dać się nabrać, bo tak działa mózg, nie głupota.</p><div class="ballots"><div class="choice share">ZIELONY · UDOSTĘPNIAM</div><div class="choice check">ŻÓŁTY · SPRAWDZAM</div><div class="choice skip">CZERWONY · NIE RUSZAM</div></div><p>Pracujemy całą grupą. Przygotujcie kartoniki.</p>`);
  if(s.type==='message'){
    if(current===4 && phase===1) return frame('Jaki był pierwszy odruch?',`<p class="lead">Co było Waszym pierwszym odruchem po przeczytaniu tych wiadomości?</p><p>Za chwilę zobaczymy, jak działa ten mechanizm.</p>`);
    const post = s.chat ? `<article class="phone"><div class="chat-heading">Grupa klasowa · 1A</div><div class="bubble"><div class="sender"><span class="avatar">O</span>Ola</div>${s.text}<div class="time">21:47</div></div></article>` : `<article class="post"><div class="post-head"><span class="post-avatar">?</span>@prawda_pod_lipami</div><div class="post-copy ${s.color}">${s.text}</div><div class="post-stats">${s.stats}</div></article>`;
    return `<div class="slide-inner"><p class="eyebrow">SYMULACJA · Wiadomość ${s.n} z 3</p><div class="split">${post}<div class="decision"><h1 class="decision-title">10 sekund.<br>Co robisz?</h1><div class="choice share">UDOSTĘPNIAM</div><div class="choice check">SPRAWDZAM</div><div class="choice skip">NIE RUSZAM</div>${timer(10)}<p>Po 10 sekundach: kartonik w górę.</p></div></div></div>`;
  }
  if(current===5){
    if(phase===0)return analysisCards(s);
    if(phase===1)return film(s,'Szukajcie momentu, w którym napięcie pcha do szybkiego wniosku.');
    return frame('Silna emocja? Zwolnij.',`<p class="lead">Alarm szybciej przyciąga uwagę, ale nie staje się przez to prawdziwy.</p><p>Kto spodziewa się zagrożenia, ten łatwiej je widzi.</p><div class="u-model" role="img" aria-label="Uproszczona metafora odwróconego U: zbyt mało lub zbyt dużo pobudzenia może utrudniać pracę; umiarkowane może pomagać."><svg viewBox="0 0 500 160" aria-hidden="true"><path d="M30 140 Q250 -90 470 140" fill="none" stroke="#c62828" stroke-width="8"/><path d="M20 10 V150 H485" fill="none" stroke="#221b1b" stroke-width="2"/></svg><div><span>Za mało</span><span>Umiarkowanie</span><span>Za dużo</span></div></div><p class="small">Pobudzenie a wykonanie zadania — uproszczony model. Wpływ zależy też od zadania i osoby.</p>${call('Emocja jest sygnałem do przyjrzenia się własnej reakcji.')}`);
  }
  if(current===6){
    if(phase===0)return film(s);
    if(phase===1)return frame(s.title,cards(s.cards),{eye:'Jak działa FUD · wiadomość Oli'});
    return frame('Brak gwarancji to nie dowód zagrożenia.',`<p class="lead">Jakie są dowody szkody?</p><p>To inne pytanie niż: „Czy możesz wykluczyć wszystko?”.</p>${call('Sama emocja nie dowodzi ani prawdy, ani fałszu.')}`,{eye:'Przeczytajmy razem'});
  }
  if(current===7 && phase===1)return frame('Ostrzeżenie czy presja?',cards([['Sprawdzalne ostrzeżenie','„Wykryto zagrożenie. Służby podają zakres i zalecenia.”'],['Emocja i presja','„Oni wiedzą, ale milczą. Udostępnij!”']])+call('Lęk może towarzyszyć prawdziwemu ostrzeżeniu. Sprawdź jego podstawy.'));
  if(current===8){
    if(phase===0)return film(s);
    if(phase===1)return frame('Czy „co za bzdura!” odbiera postowi zasięg?',`<p class="lead">Udostępniasz post z krytycznym komentarzem. Czy zmniejszasz jego zasięg?</p><div class="ballots"><div class="choice share">ZIELONY · TAK</div><div class="choice skip">CZERWONY · NIE</div></div><p>Podnieście kartoniki.</p>`);
    if(phase===2)return frame('Nie. To też udostępnienie.',`<p class="lead">Krytyczne udostępnienie też może napędzać zasięg.</p>${call('„Co za bzdura!” też daje postowi zasięg.')}`);
    return frame('Rozłóż oburzenie na 3 części',`<div class="band-list">${s.bands.map((b,i)=>`<div class="band ${i===2?'danger':''}"><b>${b[0]}</b><span>${b[1]}</span></div>`).join('')}</div><p>Złość to nie agresja: można być złym i reagować spokojnie.</p>`,{eye:s.title});
  }
  if(current===9 && phase===1)return frame('Sprzeciw po sprawdzeniu',`<p class="lead">Prawdziwa krzywda zasługuje na sprzeciw — po sprawdzeniu i proporcjonalny.</p>${call('Jedna sprawa nie uzasadnia „wszyscy tacy są”.')}<p>Nie przypisujmy motywów bez dowodu.</p>`);
  if(current===10){
    if(phase===0)return film(s);
    if(phase===1)return frame(s.title,cards(s.cards),{eye:'Kiedy fakt brzmi jak atak · wiadomość 3'});
    return frame('O wrogu dwa razy w obiegu.',`<p class="lead">Czy to prawda?</p><p>Czy może: „Czy wolno mi uwierzyć komuś spoza nas?”</p>${call('„Plemię” to metafora. Każdy należy do wielu grup.')}<p class="small">Rathje i współpracownicy: w analizie 2,7 mln postów wpisy o grupie przeciwnej udostępniano ok. 2 razy częściej.</p>`,{eye:'Przeczytajmy razem'});
  }
  if(current===12){
    if(phase===1)return frame('Można zmienić zdanie',`<p class="lead">Przynależność jest normalna. Podejrzenie powinno dać się sprawdzić.</p>${call('Każdy potrzebuje możliwości zmiany zdania bez upokorzenia.')}`);
    return renderBase(s).replace('<div class="split">','<div class="callout">To twierdzenie było fałszywe.</div><div class="split">');
  }
  if(current===13){
    if(phase===1)return frame('Przerwa',`<p class="lead">Za nami blok 1.</p><p>Po przerwie: rozpoznajemy zapalniki, wracamy do historii ciasta i budujemy własne sposoby obrony.</p>`,{eye:'2 × 45 minut · przejście do bloku 2'});
    return renderBase(s).replace('<div class="callout">','<p>To model, a nie nieuchronny proces.</p><div class="callout">');
  }
  if(current===14){const i=Math.floor(phase/2),q=s.quotes[i];return frame('Który to zapalnik?',`<p class="eyebrow">LĘK · ZŁOŚĆ · LOJALNOŚĆ</p><blockquote class="spoken-quote">„${q[0]}”</blockquote>${phase%2?call(q[1])+'<p class="lead">Po czym to poznaliście?</p>':'<p>Odpowiadamy razem.</p>'}`,{eye:`Blok 2 · powtórka · cytat ${i+1} z 6`});}
  if(current===15 && phase===1)return `<div class="slide-inner fud-defence">
    <div class="fud-heading"><div><p class="eyebrow">Ciasto ze zbiórki · od rozpoznania do działania</p><h1 class="title mid">Jak rozbroić FUD<br>w 3 krokach?</h1></div>${image('07-fear.png','fud-art')}</div>
    <p class="fud-context">FUD wykorzystuje <strong>lęk, niepewność i wątpliwości</strong>. Wróćmy do Oli: „Wymiotowałam całą noc… przekażcie dalej!”. Jak zareagować?</p>
    <button class="work-button" id="reveal">Odsłoń kroki po rozmowie</button>
    <div id="answer" class="fud-answer" hidden>
      <ol class="fud-actions">
        <li><span class="fud-number">1</span><h2>Rozpoznaj lęk</h2><p>„Boję się o siebie i innych. Dlatego chcę szybko ostrzec wszystkich”.</p><p class="fud-action">Zatrzymaj się: <strong>czy uznaję ciasto za przyczynę, bo mam dowód, czy dlatego, że się boję?</strong></p></li>
        <li><span class="fud-number">2</span><h2>Sprawdź dowody i skalę</h2><p>Ola źle się czuła. To jeszcze nie dowód, że zaszkodziło jej ciasto.</p><p class="fud-action"><strong>Ile osób zachorowało? Czy chorowali też ci, którzy nie jedli ciasta?</strong> Co potwierdza inne źródło?</p></li>
        <li><span class="fud-number">3</span><h2>Zatrzymaj presję</h2><p>„Przekaż dalej!” nie dodaje dowodów. Nie udostępniaj oskarżenia jako faktu.</p><p class="fud-action">Możesz odpowiedzieć: <strong>„Sprawdźmy, co się stało. Na razie nie wiemy, czy przyczyną było ciasto”.</strong></p></li>
      </ol>
      <p class="fud-rule"><strong>Brak gwarancji to nie dowód zagrożenia.</strong> Pytaj o dowody szkody, zamiast żądać gwarancji, że nic złego nie może się wydarzyć.</p>
      <p class="fud-boundary">Potwierdzone ostrzeżenie traktuj poważnie — sprawdzanie nie oznacza ignorowania zagrożenia.</p>
      <div class="fud-other"><p><strong>Wiadomość 2 · złość:</strong> oddziel „ktoś zachorował” od „2B zrobiła to specjalnie”. Jakie są dowody winy?</p><p><strong>Wiadomość 3 · lojalność:</strong> zapytaj: „Czy przyjąłbym ten sam dowód od kogoś spoza mojej grupy?”.</p></div>
    </div>
  </div>`;
  if(current===15 && phase>1){const q=debrief[phase-1];return frame(q[0],reveal(q[1]),{eye:'Ciasto ze zbiórki · porozmawiajmy'});}
  if(current===16){
    if(phase===0)return frame('Podgrupy A · B · C',`<p class="lead">Usiądźcie przy stolikach A, B i C.</p><p>Trzy rundy po 5 minut. Wszystkie podgrupy pracują równocześnie nad tym samym zapalnikiem.</p>${cards([['1 · LĘK','Wszyscy'],['2 · ZŁOŚĆ','Wszyscy'],['3 · LOJALNOŚĆ','Wszyscy']])}`);
    const names=['LĘK','ZŁOŚĆ','LOJALNOŚĆ']; return frame(`Runda ${phase}: ${names[phase-1]}`,`<p class="lead">Wszystkie podgrupy: A + B + C</p><p>Jeden pomysł = jedna karteczka. Litera podgrupy w rogu. Minimum 3 karteczki.</p><div class="note-template"><b>GDY …</b> (co czuję lub widzę)<br><b>→ TO …</b> (co robię)</div>${timer(300)}`,{eye:'Wymyślcie, jak się bronić'});
  }
  if(current===17){
    if(phase===0)return frame('Zbierzmy pomysły',`<p class="lead">Czytajcie karteczki na głos i doklejajcie je do kolumn plakatu.</p><p>Podobne pomysły układamy obok siebie, w jednym rzędzie.</p>`);
    if(phase===1)return renderBase(s);
    return frame('Czy ta obrona przepuści prawdziwe ostrzeżenie?',`<p class="lead">„Nie wierzę w nic, co budzi emocje”.</p><p>Czy taka zasada nas chroni? Jak ją poprawić?</p>${reveal('Emocja nie przesądza o prawdziwości. Rozpoznaj ją i sprawdź twierdzenie, źródło oraz niezależne potwierdzenie.')}`);
  }
  if(current===18)return frame('Czerwona ćwiartka',`${cards([['A → LĘK',''],['B → ZŁOŚĆ',''],['C → LOJALNOŚĆ','']])}<p>Przenieście rdzeń i uzgodnione wzmocnienia z plakatu. Krótko, dużymi literami. Każda obrona z rysunkiem.</p>${timer(720)}${call('EMOCJA TO SYGNAŁ, NIE DOWÓD · CO? SKĄD? KTO JESZCZE?')}`,{eye:'Ostatnie zadanie · 12 minut'});
  if(current===19 && phase===0)return frame('Stańmy przy gotowej ćwiartce',`<p class="lead">Lęk szuka schronu, złość szuka winnego, plemię szuka swojego.</p><p>Przeczytajmy razem.</p>`);
  return renderBase(s);
}
function stopTimer(){clearInterval(timerId);timerId=null;}
function setupTimer(){
  const t=$('.work-timer');if(!t)return;
  const total=Number(t.dataset.seconds);remaining=total;
  const output=t.querySelector('output'),toggle=$('#timerToggle'),notice=$('#timerNotice');
  const update=()=>{remaining=Math.max(0,Math.ceil((deadline-Date.now())/1000));output.textContent=formatTime(remaining);if(remaining===0){stopTimer();toggle.textContent='Uruchom ponownie';notice.textContent=total===10?'Kartoniki w górę.':'Czas minął. Dokończcie myśl.';}};
  toggle.onclick=()=>{if(timerId){update();stopTimer();toggle.textContent='Wznów';return;}if(remaining===0)remaining=total;notice.textContent='';deadline=Date.now()+remaining*1000;toggle.textContent='Pauza';timerId=setInterval(update,200);update();};
  $('#timerReset').onclick=()=>{stopTimer();remaining=total;output.textContent=formatTime(total);toggle.textContent='Start';notice.textContent='';};
}
function show(index,stage=0){
  stopTimer();document.querySelectorAll('video').forEach(v=>v.pause());
  current=Math.max(0,Math.min(slides.length-1,index));phase=Math.max(0,Math.min(counts[current]-1,stage));
  const s=slides[current],node=$('#slide');
  node.className=`slide workshop ${((current===0&&phase===0)||(current===13&&phase===0)||(current===19&&phase===1))?'red':''} type-${s.type}`;
  node.innerHTML=renderWorkshop(s);
  $('#counter').textContent=`${String(current+1).padStart(2,'0')} / 20`;
  $('#progress').style.width=`${(current+(phase+1)/counts[current])/20*100}%`;
  $('#stageLabel').textContent=`Blok ${current<14?1:2} · ${label()}${counts[current]>1?' · '+(phase+1)+'/'+counts[current]:''}`;
  $('#backButton').disabled=current===0&&phase===0;
  const last=current===19&&phase===counts[19]-1;
  $('#nextButton').disabled=last;
  $('#nextButton').innerHTML=`<span>${last?'Koniec':(current===14&&phase%2===0)?'Odsłoń odpowiedź':'Dalej'}</span> ${last?'✓':'→'}`;
  document.title=`${current+1}. ${s.title} — EMOCJE`;
  renderOverview();setupTimer();
  const r=$('#reveal');if(r)r.onclick=()=>{$('#answer').hidden=false;r.hidden=true;};
  window.scrollTo({top:0,behavior:'instant'});
}
function advance(){if(phase+1<counts[current])show(current,phase+1);else if(current<19)show(current+1);}
function back(){if(phase>0)show(current,phase-1);else if(current>0)show(current-1,counts[current-1]-1);}
function renderOverview(){const o=$('#overview');o.innerHTML=`<p class="overview-title">Mapa warsztatu</p>${slides.map((s,i)=>`<button class="${i===current?'active':''}" data-go="${i}"><small>${String(i+1).padStart(2,'0')}</small>${s.title}</button>`).join('')}`;o.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>{o.hidden=true;$('#overviewButton').setAttribute('aria-expanded','false');show(Number(b.dataset.go));});}
$('#backButton').onclick=back;$('#nextButton').onclick=advance;
$('#overviewButton').onclick=()=>{const o=$('#overview');o.hidden=!o.hidden;$('#overviewButton').setAttribute('aria-expanded',String(!o.hidden));};
window.addEventListener('keydown',e=>{
  if(e.key==='Escape'){$('#overview').hidden=true;$('#overviewButton').setAttribute('aria-expanded','false');return;}
  if(e.altKey||e.ctrlKey||e.metaKey||['INPUT','TEXTAREA','VIDEO','AUDIO','SELECT'].includes(document.activeElement.tagName))return;
  if(!$('#overview').hidden)return;
  if(e.key===' '&&['BUTTON','A'].includes(document.activeElement.tagName))return;
  if(e.key==='ArrowRight'||e.key===' '){e.preventDefault();advance();}
  if(e.key==='ArrowLeft'){e.preventDefault();back();}
});
show(0);
