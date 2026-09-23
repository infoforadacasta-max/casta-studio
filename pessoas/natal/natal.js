const select=document.getElementById('natal-date');
const timeInput=document.getElementById('natal-time');
const dateGrid=document.getElementById('natal-date-grid');
const timeGrid=document.getElementById('natal-time-grid');
const choice=document.getElementById('natal-choice');
document.querySelectorAll('[data-pack]').forEach(link=>link.addEventListener('click',()=>{
 const pack=link.dataset.pack.split(' · ')[0];
 document.getElementById('natal-pack').value=link.dataset.pack;
 if(window.CASTA_NATAL_BOOKING_URL){
  const frame=document.getElementById('natal-calendar-frame');
  const url=new URL(window.CASTA_NATAL_BOOKING_URL);
  url.searchParams.set('pack',pack);
  frame.src=url.href;
  document.getElementById('natal-selected-pack').textContent=`Pack escolhido: ${link.dataset.pack}. Para mudar, escolhe outro pack acima.`;
  document.getElementById('natal-calendar').hidden=false;
 }
}));
for(let d=new Date(2026,9,24);d<=new Date(2026,11,6);d.setDate(d.getDate()+1)){
 if(d.getDay()!==0&&d.getDay()!==6)continue;
 const day=new Date(d);
 const value=`${day.getFullYear()}-${String(day.getMonth()+1).padStart(2,'0')}-${String(day.getDate()).padStart(2,'0')}`;
 const label=new Intl.DateTimeFormat('pt-PT',{weekday:'long',day:'numeric',month:'long'}).format(day);
 const button=document.createElement('button');
 button.type='button';button.className='natal-date';button.setAttribute('aria-pressed','false');
 button.innerHTML=`<span>${new Intl.DateTimeFormat('pt-PT',{weekday:'short',month:'short'}).format(day)}</span><strong>${day.getDate()}</strong>`;
 button.setAttribute('aria-label',label);
 button.addEventListener('click',()=>{
  select.value=value;timeInput.value='';choice.textContent=`${label} · escolham uma hora`;
  dateGrid.querySelectorAll('button').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
  timeGrid.hidden=false;timeGrid.querySelectorAll('button').forEach(item=>item.setAttribute('aria-pressed','false'));
 });
 dateGrid.appendChild(button);
}
for(const hour of [10,11,12,15,16,17,18]){
 const button=document.createElement('button');button.type='button';button.className='natal-time';
 button.textContent=`${String(hour).padStart(2,'0')}:00`;button.setAttribute('aria-pressed','false');
 button.addEventListener('click',()=>{
  timeInput.value=button.textContent;
  timeGrid.querySelectorAll('button').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
  choice.textContent=`${new Intl.DateTimeFormat('pt-PT',{weekday:'long',day:'numeric',month:'long'}).format(new Date(select.value+'T12:00:00'))} às ${button.textContent} · sujeito a confirmação`;
 });
 timeGrid.appendChild(button);
}
document.getElementById('natal-request').addEventListener('submit',event=>{
 event.preventDefault();
 const form=event.currentTarget;
 if(!form.reportValidity())return;
 if(!select.value||!timeInput.value){choice.textContent='Escolham a data e a hora preferidas.';dateGrid.scrollIntoView({block:'center',behavior:'smooth'});return}
 const data=new FormData(form);
 const date=new Intl.DateTimeFormat('pt-PT',{weekday:'long',day:'numeric',month:'long'}).format(new Date(select.value+'T12:00:00'));
 const message=`Olá Nádia e Ruben! Gostava de saber a disponibilidade para uma mini-sessão de Natal.\n\nPack: ${data.get('pack')}\nNome: ${data.get('nome')}\nEmail: ${data.get('email')}\nData e hora preferidas: ${date}, ${timeInput.value}${data.get('mensagem')?`\nQuem vem: ${data.get('mensagem')}`:''}\n\nPodem confirmar esta vaga?`;
 window.open(`https://wa.me/351919592819?text=${encodeURIComponent(message)}`,'_blank','noopener,noreferrer');
});

const menu=document.querySelector('.menu');menu?.addEventListener('click',()=>{const expanded=menu.getAttribute('aria-expanded')==='true';menu.setAttribute('aria-expanded',String(!expanded));document.getElementById('links')?.classList.toggle('open',!expanded)});
document.querySelectorAll('.submenu-toggle').forEach(button=>button.addEventListener('click',()=>{const expanded=button.getAttribute('aria-expanded')==='true';button.setAttribute('aria-expanded',String(!expanded));button.closest('.nav-group')?.classList.toggle('submenu-open',!expanded)}));

if (window.CASTA_NATAL_BOOKING_URL && /^https:\/\/script\.google\.com\/macros\/s\/[^/]+\/exec(?:\?.*)?$/.test(window.CASTA_NATAL_BOOKING_URL)) {
 document.getElementById('natal-manual').hidden=true;
}
