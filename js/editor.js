(function(){
  'use strict';
  const core=window.LandingCore;let config=JSON.parse(JSON.stringify(window.LANDING_CONTENT));
  const $=id=>document.getElementById(id);const draftKey='baeknyeon-landing-draft-v1';let statusTimer;
  const settings=[['brand','브랜드명'],['author','작성자'],['date','표시 날짜 (예: 2026년 11월 17일)'],['title','게시글 제목'],['description','검색·공유 설명'],['disclosure','광고 표시'],['landingUrl','이 글의 랜딩 URL (배포 후 입력)'],['purchaseUrl','구매 버튼 도착 URL (상품 판매 페이지)'],['ctaLabel','구매 버튼 문구'],['productName','제품명'],['productDescription','제품 소개'],['businessInfo','사업자·문의 안내 (선택)'],['ga4Id','본인 GA4 측정 ID (선택, G-로 시작)']];
  const utm={utm_source:'instagram',utm_medium:'paid_social',utm_campaign:'cabbage_stick',utm_content:'story_01',utm_term:'',utm_id:''};
  function notify(msg){$('editorStatus').textContent=msg;$('editorStatus').hidden=false;clearTimeout(statusTimer);statusTimer=setTimeout(()=>$('editorStatus').hidden=true,4500);}
  function field(parent,label,value,callback,multiline=false){const wrap=document.createElement('label');wrap.append(document.createTextNode(label));const input=document.createElement(multiline?'textarea':'input');if(multiline)input.rows=4;else input.type='text';input.value=value||'';input.addEventListener('input',()=>callback(input.value));wrap.append(input);parent.append(wrap);return input;}
  function preview(){const f=$('preview');f.contentWindow?.postMessage({type:'landing-preview',config},location.origin==='null'?'*':location.origin);updateUtm();}
  function download(name,text,type='text/javascript;charset=utf-8'){const blob=new Blob([text],{type});downloadBlob(name,blob);}
  function downloadBlob(name,blob){const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),3000);}
  function drawSettings(){$('settings').replaceChildren();for(const [key,label] of settings)field($('settings'),label,config[key],v=>{config[key]=v;preview();});$('forwardUtm').checked=!!config.forwardUtm;}
  const labels={paragraph:'문단',heading:'소제목',quote:'인용문',image:'이미지',divider:'구분선'};
  function drawBlocks(){
    $('blocks').replaceChildren();config.blocks.forEach((block,index)=>{
      const box=document.createElement('div');box.className='block';const head=document.createElement('div');head.className='block-head';const title=document.createElement('strong');title.textContent=(index+1)+'. '+labels[block.type];head.append(title);
      for(const [label,action,disabled] of [['↑',()=>move(index,-1),index===0],['↓',()=>move(index,1),index===config.blocks.length-1],['삭제',()=>{config.blocks.splice(index,1);drawBlocks();preview();},false]]){const b=document.createElement('button');b.type='button';b.textContent=label;b.disabled=disabled;b.setAttribute('aria-label',`${index+1}번 블록 ${label}`);b.addEventListener('click',action);head.append(b);}box.append(head);
      if(block.type==='image'){
        field(box,'이미지 주소 또는 파일 경로',block.src,v=>{block.src=v;preview();});field(box,'이미지 설명 (대체 텍스트)',block.alt,v=>{block.alt=v;preview();});field(box,'사진 아래 설명 (선택)',block.caption,v=>{block.caption=v;preview();});
        const pick=document.createElement('label');pick.textContent='내 PC 이미지 선택 → 파일 사본 다운로드';const file=document.createElement('input');file.type='file';file.accept='image/jpeg,image/png,image/webp,image/gif';
        file.addEventListener('change',()=>{const selected=file.files[0];if(!selected)return;if(!['image/jpeg','image/png','image/webp','image/gif'].includes(selected.type)){notify('JPG, PNG, WEBP, GIF 파일을 선택하세요.');return;}const ext={ 'image/jpeg':'jpg','image/png':'png','image/webp':'webp','image/gif':'gif'}[selected.type];const name='photo-'+Date.now()+'.'+ext;downloadBlob(name,selected);block.src='assets/images/'+name;drawBlocks();preview();notify('다운로드한 이미지를 assets/images 폴더에 넣어야 미리보기에 표시됩니다.');});pick.append(file);box.append(pick);
      }else if(block.type!=='divider')field(box,'내용',block.text,v=>{block.text=v;preview();},true);
      $('blocks').append(box);
    });
  }
  function move(index,delta){const target=index+delta;if(target<0||target>=config.blocks.length)return;[config.blocks[index],config.blocks[target]]=[config.blocks[target],config.blocks[index]];drawBlocks();preview();}
  function updateUtm(){try{$('utmOutput').value=core.buildUtm(config.landingUrl,utm);$('utmError').textContent='';}catch(e){$('utmOutput').value='';$('utmError').textContent='기본 정보에 배포된 랜딩 URL을 먼저 입력하세요.';}}
  function valid(candidate){return candidate&&typeof candidate==='object'&&Array.isArray(candidate.blocks)&&candidate.blocks.every(b=>b&&Object.hasOwn(labels,b.type));}
  $('preview').addEventListener('load',preview);$('forwardUtm').addEventListener('change',e=>{config.forwardUtm=e.target.checked;preview();});
  document.querySelectorAll('[data-add]').forEach(button=>button.addEventListener('click',()=>{const type=button.dataset.add;config.blocks.push(type==='image'?{type,src:'assets/images/placeholder.svg',alt:'',caption:''}:type==='divider'?{type}:{type,text:''});drawBlocks();preview();}));
  $('export').addEventListener('click',()=>{if(config.purchaseUrl&&!core.httpUrl(config.purchaseUrl)){notify('구매 URL은 https:// 또는 http://로 시작해야 합니다.');return;}download('content.js',core.serialize(config));notify('content.js를 프로젝트 폴더에 덮어쓰고 재배포하세요.');});
  $('saveDraft').addEventListener('click',()=>{try{localStorage.setItem(draftKey,JSON.stringify(config));notify('현재 브라우저에 초안을 저장했습니다. 공개 페이지에는 반영되지 않습니다.');}catch{notify('브라우저 저장소를 사용할 수 없습니다. 파일로 다운로드하세요.');}});
  $('loadDraft').addEventListener('click',()=>{try{const value=JSON.parse(localStorage.getItem(draftKey));if(!valid(value))throw new Error();config=value;drawSettings();drawBlocks();preview();notify('초안을 불러왔습니다.');}catch{notify('불러올 초안이 없습니다.');}});
  $('clearDraft').addEventListener('click',()=>{try{localStorage.removeItem(draftKey);notify('저장한 초안을 삭제했습니다.');}catch{notify('브라우저 저장소에 접근할 수 없습니다.');}});
  $('import').addEventListener('change',async e=>{try{const file=e.target.files[0];if(!file)return;const source=await file.text();const match=source.match(/window\.LANDING_CONTENT\s*=\s*([\s\S]*);\s*$/);if(!match)throw new Error();const value=JSON.parse(match[1]);if(!valid(value))throw new Error();config=value;drawSettings();drawBlocks();preview();notify('파일을 불러왔습니다.');}catch{notify('올바른 content.js 파일인지 확인하세요.');}e.target.value='';});
  for(const key of core.utmKeys)field($('utmFields'),key,utm[key],v=>{utm[key]=v;updateUtm();});
  $('copyUtm').addEventListener('click',async()=>{if(!$('utmOutput').value){notify('랜딩 URL을 먼저 입력하세요.');return;}try{await navigator.clipboard.writeText($('utmOutput').value);notify('광고용 URL을 복사했습니다.');}catch{$('utmOutput').focus();$('utmOutput').select();notify('선택된 URL을 Ctrl+C로 복사하세요.');}});
  $('pasteArticle').addEventListener('click',()=>$('pasteDialog').showModal());
  $('applyArticle').addEventListener('click',()=>{const value=$('articleText').value.trim();if(!value){notify('본문을 입력하세요.');return;}if(!confirm('기존 본문과 이미지 블록을 모두 교체할까요?'))return;config.blocks=value.split(/\n\s*\n/).map(text=>({type:'paragraph',text:text.trim()}));drawBlocks();preview();$('pasteDialog').close();});
  drawSettings();drawBlocks();preview();
})();
