(function(){
  'use strict';
  const core=window.LandingCore;
  const byId=id=>document.getElementById(id);
  const preview=new URLSearchParams(location.search).get('preview')==='1';
  let current;let toastTimer;
  function text(id,value){byId(id).textContent=value||'';}
  function toast(message){text('toast',message);byId('toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>byId('toast').hidden=true,3200);}
  function render(config){
    current=config||{};document.title=(current.title||'양배추 스틱')+' — '+(current.brand||'백년건강소');
    text('postTitle',current.title);text('author',current.author);text('avatar',(current.author||'백').slice(0,1));text('date',current.date);text('disclosure',current.disclosure);text('footerBrand',current.brand);text('businessInfo',current.businessInfo);
    document.querySelector('.blog-name').textContent=current.brand||'백년건강소';
    document.querySelector('.product-eyebrow').textContent=current.brand||'';
    text('productTitle',current.productName);text('productDescription',current.productDescription);
    document.querySelector('meta[name=description]').content=current.description||'';
    document.querySelector('meta[property="og:title"]').content=current.title||'';
    document.querySelector('meta[property="og:description"]').content=current.description||'';
    const fragment=document.createDocumentFragment();
    for(const block of (Array.isArray(current.blocks)?current.blocks:[])){
      let el;
      if(block.type==='divider')el=document.createElement('hr');
      else if(block.type==='image'){
        el=document.createElement('figure');const src=core.imageUrl(block.src);const img=document.createElement('img');img.alt=block.alt||'';img.loading='lazy';img.decoding='async';
        if(src)img.src=src;img.addEventListener('error',()=>{img.hidden=true;const warning=document.createElement('p');warning.textContent='이미지를 불러오지 못했습니다. 파일 경로를 확인해 주세요.';el.prepend(warning);},{once:true});el.append(img);
        if(block.caption){const caption=document.createElement('figcaption');caption.textContent=block.caption;el.append(caption);}
      }else if(['paragraph','heading','quote'].includes(block.type)){
        el=document.createElement(block.type==='heading'?'h2':block.type==='quote'?'blockquote':'p');el.textContent=block.text||'';
      }else continue;
      el.className='content-block '+block.type;fragment.append(el);
    }
    byId('article').replaceChildren(fragment);
    const href=core.purchaseUrl(current.purchaseUrl,location.search,current.forwardUtm);
    byId('purchaseLink').replaceChildren(document.createTextNode((current.ctaLabel||'제품 보러가기')+' ↗'));
    for(const a of document.querySelectorAll('.purchase-link')){a.removeAttribute('href');a.setAttribute('aria-disabled',String(!href));if(href)a.href=href;}
    text('purchaseNote',href?'버튼을 누르면 판매 페이지로 이동합니다.':'구매 링크가 아직 설정되지 않았습니다.');
  }
  async function share(){
    const url=core.httpUrl(current.landingUrl)?.href||location.href.replace(/[?&]preview=1/, '');
    try{if(navigator.share){await navigator.share({title:current.title,url});return;}}catch(e){if(e.name==='AbortError')return;}
    try{await navigator.clipboard.writeText(url);toast('링크를 복사했습니다.');}catch{window.prompt('링크를 복사해 주세요.',url);}
  }
  ['shareTop','shareBottom','shareNav'].forEach(id=>byId(id).addEventListener('click',share));
  document.querySelectorAll('.purchase-link').forEach(a=>a.addEventListener('click',event=>{
    if(preview){event.preventDefault();toast('미리보기에서는 구매 페이지로 이동하지 않습니다.');return;}
    if(a.getAttribute('aria-disabled')==='true'){event.preventDefault();toast('구매 링크를 먼저 설정해 주세요.');return;}
    if(typeof window.gtag==='function')window.gtag('event','purchase_link_click',{link_url:a.href,link_position:a.id,transport_type:'beacon'});
  }));
  render(window.LANDING_CONTENT);
  if(preview)window.addEventListener('message',e=>{if(e.source!==parent||e.origin!==location.origin||e.data?.type!=='landing-preview')return;render(e.data.config);});
  // 선택 설정: 본인 GA4 ID를 넣은 경우에만 추적을 시작합니다. 원본 사이트의 추적 ID는 사용하지 않습니다.
  const gaId=String(current.ga4Id||'').trim();
  if(!preview&&/^G-[A-Z0-9]+$/.test(gaId)){
    window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments);};
    window.gtag('js',new Date());window.gtag('config',gaId);
    const script=document.createElement('script');script.async=true;script.src='https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(gaId);document.head.append(script);
  }
})();
