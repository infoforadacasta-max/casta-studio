const select=document.getElementById('natal-date');
document.querySelectorAll('[data-pack]').forEach(link=>link.addEventListener('click',()=>{document.getElementById('natal-pack').value=link.dataset.pack}));
for(let d=new Date(2026,9,24);d<=new Date(2026,11,6);d.setDate(d.getDate()+1)){
 if(d.getDay()!==0&&d.getDay()!==6)continue;
 const option=document.createElement('option');
 option.value=d.toISOString().slice(0,10);
 option.textContent=new Intl.DateTimeFormat('pt-PT',{weekday:'long',day:'numeric',month:'long'}).format(d);
 select.appendChild(option);
}
document.getElementById('natal-request').addEventListener('submit',event=>{
 event.preventDefault();
 const form=event.currentTarget;
 if(!form.reportValidity())return;
 const data=new FormData(form);
 const date=select.selectedOptions[0].textContent;
 const message=`Olá Nádia e Ruben! Gostava de saber a disponibilidade para uma mini-sessão de Natal.\n\nPack: ${data.get('pack')}\nNome: ${data.get('nome')}\nEmail: ${data.get('email')}\nData preferida: ${date}${data.get('mensagem')?`\nQuem vem: ${data.get('mensagem')}`:''}\n\nPodem enviar-me as opções de packs e horários?`;
 window.open(`https://wa.me/351919592819?text=${encodeURIComponent(message)}`,'_blank','noopener,noreferrer');
});

const menu=document.querySelector('.menu');menu?.addEventListener('click',()=>{const expanded=menu.getAttribute('aria-expanded')==='true';menu.setAttribute('aria-expanded',String(!expanded));document.getElementById('links')?.classList.toggle('open',!expanded)});
document.querySelectorAll('.submenu-toggle').forEach(button=>button.addEventListener('click',()=>{const expanded=button.getAttribute('aria-expanded')==='true';button.setAttribute('aria-expanded',String(!expanded));button.closest('.nav-group')?.classList.toggle('submenu-open',!expanded)}));

if (window.CASTA_NATAL_BOOKING_URL && /^https:\/\/script\.google\.com\/macros\/s\/[^/]+\/exec(?:\?.*)?$/.test(window.CASTA_NATAL_BOOKING_URL)) {
 const calendar=document.getElementById('natal-calendar');
 document.getElementById('natal-calendar-frame').src=window.CASTA_NATAL_BOOKING_URL;
 calendar.hidden=false;
 document.getElementById('natal-manual').hidden=true;
 const intro=document.querySelector('.natal-booking > div:first-child p');
 if(intro)intro.textContent='Escolham o pack, vejam quantas vagas restam em cada dia e reservem a hora que preferem.';
}
