(function(){
  'use strict';
  const core=window.LandingCore;
  const byId=id=>document.getElementById(id);
  const preview=new URLSearchParams(location.search).get('preview')==='1';
  let current;let toastTimer;
  function text(id,value){const el=byId(id);if(el)el.textContent=value||'';}
  function toast(message){text('toast',message);byId('toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>byId('toast').hidden=true,3200);}
  function render(config){
    current=config||{};document.title=(current.title||'새로운 기록')+' — '+(window.BLOG_DATA?.site?.name||'오늘의 기록');
    text('postTitle',current.title);text('author',current.author);text('avatar',(current.author||'기').slice(0,1));text('date',current.date);text('footerBrand',window.BLOG_DATA?.site?.name||'오늘의 기록');
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
    renderCounts();

  }
  function count(value){return Math.min(Number.MAX_SAFE_INTEGER-1,Math.max(0,Math.floor(Number(value)||0)));}
  function liked(){try{return !preview&&localStorage.getItem('journal-liked:'+current.id)==='1';}catch{return false;}}
  function renderCounts(){
    byId('likeCount').textContent=(count(current.likeCount)+(liked()?1:0)).toLocaleString();
    byId('commentCount').textContent=count(current.commentCount).toLocaleString();
    byId('shareCount').textContent=count(current.shareCount).toLocaleString();
    byId('commentsTitle').querySelector('span').textContent=count(current.commentCount).toLocaleString();
    byId('comments').querySelector('p').textContent=count(current.commentCount)>0?'댓글 내용은 아직 연결되지 않았습니다.':'아직 등록된 댓글이 없습니다.';
    byId('commentNew').hidden=current.commentsNew!==true;
    byId('likePost').setAttribute('aria-pressed',String(liked()));
  }
  byId('likePost').addEventListener('click',()=>{if(preview){toast('미리보기에서는 공감을 저장하지 않습니다.');return;}try{const key='journal-liked:'+current.id;if(liked())localStorage.removeItem(key);else localStorage.setItem(key,'1');renderCounts();}catch{toast('이 브라우저에서는 공감을 저장할 수 없습니다.');}});
  byId('likeDetails').addEventListener('click',()=>toast('공감 선택은 현재 브라우저에 저장됩니다.'));
  async function share(){
    const shareUrl=new URL(location.href);shareUrl.searchParams.delete('preview');
    const url=core.httpUrl(current.landingUrl)?.href||shareUrl.href;
    try{if(navigator.share){await navigator.share({title:current.title,url});return;}}catch(e){if(e.name==='AbortError')return;}
    try{await navigator.clipboard.writeText(url);toast('링크를 복사했습니다.');}catch{window.prompt('링크를 복사해 주세요.',url);}
  }
  byId('shareBottom').addEventListener('click',share);
  const menuSheet=byId('menuSheet');
  function closeMenu(){menuSheet.close();}
  function menuLink(label,board){const a=document.createElement('a');a.textContent=label;a.href='board.html?board='+encodeURIComponent(board);return a;}
  function openMenu(kind){
    const body=byId('menuSheetBody');body.replaceChildren();
    if(kind==='topics'){
      text('menuSheetTitle','주제 보기');
      text('menuSheetDescription','관심 있는 게시판으로 바로 이동하세요.');
      for(const board of ['전체글','인기글','자유게시판','후기','공지'])body.append(menuLink(board,board));
    }else{
      text('menuSheetTitle','소식');text('menuSheetDescription','공지와 인기글을 빠르게 확인하세요.');
      for(const [label,board] of [['공지사항','공지'],['인기글','인기글'],['최신 후기','후기'],['전체글','전체글']])body.append(menuLink(label,board));
    }
    if(!menuSheet.open)menuSheet.showModal();
  }
  byId('topicsNav').addEventListener('click',()=>openMenu('topics'));
  byId('newsNav').addEventListener('click',()=>openMenu('news'));
  byId('closeMenuSheet').addEventListener('click',closeMenu);
  menuSheet.addEventListener('click',event=>{if(event.target===menuSheet){const rect=menuSheet.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)closeMenu();}});
  const requestedPost=new URLSearchParams(location.search).get('post');
  const blogPosts=window.BLOG_DATA?.posts||[];
  const post=requestedPost?window.BlogCore.getPost(blogPosts,requestedPost):window.BlogCore.visible(blogPosts)[0];
  render(post||{author:'',title:'글을 찾을 수 없습니다.',blocks:[{type:'paragraph',text:'삭제되었거나 공개되지 않은 글입니다. 상단의 블로그 이름을 눌러 홈으로 돌아가세요.'}]});
  if(preview)window.addEventListener('message',e=>{if(e.source!==parent||e.origin!==location.origin||e.data?.type!=='landing-preview')return;render(e.data.config);});
  // 선택 설정: 본인 GA4 ID를 넣은 경우에만 통계를 시작합니다.
  const gaId=String(current.ga4Id||'').trim();
  if(!preview&&/^G-[A-Z0-9]+$/.test(gaId)){
    window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments);};
    window.gtag('js',new Date());window.gtag('config',gaId);
    const script=document.createElement('script');script.async=true;script.src='https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(gaId);document.head.append(script);
  }
})();
