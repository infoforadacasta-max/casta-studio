(()=>{
  const STORAGE_KEY='casta_cookie_consent_v1';
  const MAX_AGE=180*24*60*60*1000;
  const ANALYTICS_ID='G-7MP2VJXNYW';

  const readConsent=()=>{
    try{
      const value=JSON.parse(localStorage.getItem(STORAGE_KEY));
      if(!value||!value.savedAt||Date.now()-value.savedAt>MAX_AGE)return null;
      return value;
    }catch{return null}
  };

  const saveConsent=analytics=>{
    const value={necessary:true,analytics:Boolean(analytics),savedAt:Date.now()};
    localStorage.setItem(STORAGE_KEY,JSON.stringify(value));
    if(value.analytics)enableAnalytics();
    closePanels();
    document.querySelector('.cookie-reopen')?.removeAttribute('hidden');
  };

  const enableAnalytics=()=>{
    if(!ANALYTICS_ID||document.querySelector('script[data-casta-analytics]'))return;
    const script=document.createElement('script');
    script.async=true;
    script.src=`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ANALYTICS_ID)}`;
    script.dataset.castaAnalytics='true';
    document.head.appendChild(script);
    window.dataLayer=window.dataLayer||[];
    window.gtag=function(){window.dataLayer.push(arguments)};
    window.gtag('js',new Date());
    window.gtag('consent','default',{analytics_storage:'granted'});
    window.gtag('config',ANALYTICS_ID,{anonymize_ip:true});
  };

  const closePanels=()=>{
    document.querySelector('.cookie-banner')?.setAttribute('hidden','');
    document.querySelector('.cookie-modal')?.setAttribute('hidden','');
    document.body.classList.remove('cookie-modal-open');
  };

  const openSettings=()=>{
    const consent=readConsent();
    const toggle=document.querySelector('#cookie-analytics');
    if(toggle)toggle.checked=Boolean(consent?.analytics);
    document.querySelector('.cookie-modal')?.removeAttribute('hidden');
    document.body.classList.add('cookie-modal-open');
  };

  const markup=`
    <aside class="cookie-banner" role="dialog" aria-modal="false" aria-labelledby="cookie-title">
      <div>
        <span class="cookie-eyebrow">Privacidade</span>
        <h2 id="cookie-title">Cookies, sem complicações.</h2>
        <p>Usamos armazenamento necessário para guardar as tuas preferências. Os cookies de análise só serão usados com a tua autorização.</p>
        <a href="/politica-de-cookies/">Política de Cookies</a>
      </div>
      <div class="cookie-actions">
        <button type="button" data-cookie-action="reject">Recusar opcionais</button>
        <button type="button" data-cookie-action="settings">Personalizar</button>
        <button type="button" class="cookie-primary" data-cookie-action="accept">Aceitar todos</button>
      </div>
    </aside>
    <div class="cookie-modal" role="dialog" aria-modal="true" aria-labelledby="cookie-settings-title" hidden>
      <div class="cookie-modal-card">
        <button class="cookie-close" type="button" aria-label="Fechar preferências">×</button>
        <span class="cookie-eyebrow">Preferências</span>
        <h2 id="cookie-settings-title">Escolhe o que autorizas.</h2>
        <div class="cookie-option">
          <div><strong>Necessários</strong><p>Guardam a tua escolha e permitem o funcionamento básico do site.</p></div>
          <span>Sempre ativos</span>
        </div>
        <label class="cookie-option" for="cookie-analytics">
          <div><strong>Analíticos</strong><p>Ajudam-nos a perceber como o site é utilizado e a melhorar a experiência.</p></div>
          <input id="cookie-analytics" type="checkbox">
        </label>
        <div class="cookie-actions">
          <button type="button" data-cookie-action="reject">Recusar opcionais</button>
          <button type="button" class="cookie-primary" data-cookie-action="save">Guardar escolhas</button>
        </div>
      </div>
    </div>
    <button class="cookie-reopen" type="button" data-cookie-action="settings" hidden>Cookies</button>
  `;

  const css=`
    .cookie-banner,.cookie-modal{font-family:var(--sans,Manrope,Arial,sans-serif);color:#171714}
    .cookie-banner{position:fixed;z-index:9999;left:20px;right:20px;bottom:20px;display:grid;grid-template-columns:1.4fr 1fr;gap:32px;align-items:end;max-width:1050px;margin:auto;padding:28px;background:#f4f1eb;border:1px solid #171714;box-shadow:0 18px 55px rgba(0,0,0,.2)}
    .cookie-banner[hidden],.cookie-modal[hidden],.cookie-reopen[hidden]{display:none}
    .cookie-banner h2,.cookie-modal h2{font:400 clamp(1.8rem,3vw,2.8rem)/1 var(--serif,Georgia,serif);margin:7px 0 12px}
    .cookie-banner p,.cookie-modal p{margin:0;color:#625f59;line-height:1.5;font-size:.88rem}
    .cookie-banner a{display:inline-block;margin-top:12px;text-decoration:underline;text-underline-offset:3px;font-size:.8rem}
    .cookie-eyebrow{font-size:.67rem;letter-spacing:.18em;text-transform:uppercase}
    .cookie-actions{display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap}
    .cookie-actions button,.cookie-reopen{border:1px solid #171714;background:transparent;color:#171714;padding:11px 14px;font:500 .69rem/1.2 var(--sans,Arial,sans-serif);letter-spacing:.08em;text-transform:uppercase;cursor:pointer}
    .cookie-actions .cookie-primary{background:#171714;color:#f4f1eb}
    .cookie-modal{position:fixed;z-index:10000;inset:0;display:grid;place-items:center;padding:20px;background:rgba(0,0,0,.58)}
    .cookie-modal-card{position:relative;width:min(620px,100%);max-height:90vh;overflow:auto;padding:34px;background:#f4f1eb}
    .cookie-close{position:absolute;top:13px;right:17px;border:0;background:transparent;font-size:2rem;cursor:pointer}
    .cookie-option{display:flex;align-items:center;justify-content:space-between;gap:24px;padding:20px 0;border-top:1px solid #cbc6bc}
    .cookie-option strong{font:400 1.3rem var(--serif,Georgia,serif)}
    .cookie-option span{font-size:.72rem;white-space:nowrap;color:#625f59}
    .cookie-option input{width:22px;height:22px;accent-color:#171714}
    .cookie-modal .cookie-actions{margin-top:22px}
    .cookie-reopen{position:fixed;z-index:9000;left:12px;bottom:12px;padding:8px 10px;background:#f4f1eb;font-size:.6rem;opacity:.82}
    .cookie-modal-open{overflow:hidden}
    @media(max-width:720px){.cookie-banner{left:10px;right:10px;bottom:10px;grid-template-columns:1fr;gap:20px;padding:22px}.cookie-actions{justify-content:stretch}.cookie-actions button{flex:1 1 135px}.cookie-modal-card{padding:28px 22px}.cookie-option{align-items:flex-start}.cookie-option p{font-size:.8rem}}
  `;

  const init=()=>{
    const style=document.createElement('style');
    style.textContent=css;
    document.head.appendChild(style);
    document.body.insertAdjacentHTML('beforeend',markup);
    const consent=readConsent();
    if(consent){
      document.querySelector('.cookie-banner')?.setAttribute('hidden','');
      document.querySelector('.cookie-reopen')?.removeAttribute('hidden');
      if(consent.analytics)enableAnalytics();
    }
    document.addEventListener('click',event=>{
      const action=event.target.closest('[data-cookie-action]')?.dataset.cookieAction;
      if(action==='accept')saveConsent(true);
      if(action==='reject')saveConsent(false);
      if(action==='settings')openSettings();
      if(action==='save')saveConsent(document.querySelector('#cookie-analytics')?.checked);
      if(event.target.closest('.cookie-close'))closePanels();
      if(event.target.classList.contains('cookie-modal'))closePanels();
    });
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);
  else init();
})();
