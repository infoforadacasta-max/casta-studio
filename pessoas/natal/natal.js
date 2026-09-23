const select=document.getElementById('natal-date');
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
 const message=`Olá Nádia e Ruben! Gostava de saber a disponibilidade para uma mini-sessão de Natal.\n\nNome: ${data.get('nome')}\nEmail: ${data.get('email')}\nData preferida: ${date}${data.get('mensagem')?`\nQuem vem: ${data.get('mensagem')}`:''}\n\nPodem enviar-me as opções de packs e horários?`;
 window.open(`https://wa.me/351919592819?text=${encodeURIComponent(message)}`,'_blank','noopener,noreferrer');
});
