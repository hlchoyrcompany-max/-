(function(){
  'use strict';
  function mount(parent,config,onChange,notify){
    const toolbar=document.createElement('div');toolbar.className='rich-toolbar';toolbar.setAttribute('role','toolbar');toolbar.setAttribute('aria-label','본문 서식');
    const editor=document.createElement('div');editor.className='rich-editor';editor.contentEditable='true';editor.setAttribute('role','textbox');editor.setAttribute('aria-label','게시글 본문 편집');editor.setAttribute('aria-multiline','true');editor.spellcheck=false;
    editor.append(...window.RichContent.fromBlocks(config.blocks).childNodes);
    let savedRange=null,selectedImage=null;
    function remember(){const s=window.getSelection();if(s.rangeCount&&editor.contains(s.anchorNode)&&editor.contains(s.focusNode))savedRange=s.getRangeAt(0).cloneRange();}
    function restore(){editor.focus();const s=window.getSelection();s.removeAllRanges();if(savedRange&&editor.contains(savedRange.commonAncestorContainer))s.addRange(savedRange);else{const r=document.createRange();r.selectNodeContents(editor);r.collapse(false);s.addRange(r);}}
    function sync(){const safe=document.createElement('div');safe.append(window.RichContent.sanitize(editor.innerHTML));config.blocks=[{type:'paragraph',html:safe.innerHTML,text:editor.innerText}];onChange();}
    function command(name,value){restore();document.execCommand(name,false,value);remember();sync();}
    function button(label,action){const b=document.createElement('button');b.type='button';b.textContent=label;b.addEventListener('mousedown',e=>{remember();e.preventDefault();});b.addEventListener('click',action);toolbar.append(b);return b;}
    button('굵게',()=>command('bold'));button('기울임',()=>command('italic'));button('밑줄',()=>command('underline'));button('취소선',()=>command('strikeThrough'));
    function color(label,value,cmd){const wrap=document.createElement('label');wrap.textContent=label;const input=document.createElement('input');input.type='color';input.value=value;input.setAttribute('aria-label',label);input.addEventListener('mousedown',remember);input.addEventListener('input',()=>command(cmd,input.value));wrap.append(input);toolbar.append(wrap);return input;}
    const ink=color('글자색','#e53935','foreColor');button('글자색 적용',()=>command('foreColor',ink.value));
    const marker=color('형광펜','#fff176','hiliteColor');button('형광펜 적용',()=>command('hiliteColor',marker.value));
    const size=document.createElement('select');size.setAttribute('aria-label','글자 크기');
    for(const [value,label] of [['','글자 크기'],['2','14px'],['3','16px'],['4','18px'],['5','24px'],['6','32px'],['7','48px']]){const o=document.createElement('option');o.value=value;o.textContent=label;size.append(o);}
    size.addEventListener('mousedown',remember);size.addEventListener('change',()=>{if(size.value)command('fontSize',size.value);size.value='';});toolbar.append(size);
    for(const [label,cmd] of [['왼쪽','justifyLeft'],['가운데','justifyCenter'],['오른쪽','justifyRight'],['글머리표','insertUnorderedList'],['번호 목록','insertOrderedList']])button(label,()=>command(cmd));
    button('서식 지우기',()=>command('removeFormat'));button('실행 취소',()=>command('undo'));button('다시 실행',()=>command('redo'));
    const file=document.createElement('input');file.type='file';file.accept='image/jpeg,image/png,image/webp,image/gif';file.hidden=true;file.setAttribute('aria-label','본문 사진 파일');
    button('사진 넣기',()=>{remember();file.click();});
    button('사진 URL',()=>{const url=prompt('이미지 URL 또는 assets/images/파일명을 입력하세요.');if(!url)return;const src=window.RichContent.imageSource(url);if(!src){notify('올바른 이미지 주소를 입력하세요.');return;}command('insertImage',src);});
    for(const width of [25,50,75,100])button('사진 '+width+'%',()=>{if(!selectedImage||!editor.contains(selectedImage)){notify('본문의 사진을 먼저 클릭하세요.');return;}selectedImage.style.width=width+'%';selectedImage.style.height='auto';sync();});
    button('사진 삭제',()=>{if(!selectedImage||!editor.contains(selectedImage)){notify('삭제할 사진을 먼저 클릭하세요.');return;}selectedImage.remove();selectedImage=null;sync();});
    file.addEventListener('change',async()=>{
      const picked=file.files[0];if(!picked)return;
      try{
        if(!['image/jpeg','image/png','image/webp','image/gif'].includes(picked.type)||picked.size>10*1024*1024)throw new Error('10MB 이하의 JPG, PNG, WEBP, GIF 사진을 선택하세요.');
        const data=await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(picked);});
        command('insertImage',data);notify('사진을 본문에 넣었습니다. 파일 다운로드 시 사진도 함께 저장됩니다.');
      }catch(e){notify(e.message||'사진을 읽지 못했습니다.');}finally{file.value='';}
    });
    editor.addEventListener('input',()=>{remember();sync();});
    for(const event of ['keyup','mouseup','focusout'])editor.addEventListener(event,remember);
    editor.addEventListener('click',e=>{if(selectedImage)selectedImage.classList.remove('selected-photo');selectedImage=e.target.tagName==='IMG'?e.target:null;if(selectedImage)selectedImage.classList.add('selected-photo');remember();});
    editor.addEventListener('paste',e=>{
      e.preventDefault();remember();const html=e.clipboardData.getData('text/html');const plain=e.clipboardData.getData('text/plain');
      if(html){const holder=document.createElement('div');holder.append(window.RichContent.sanitize(html));command('insertHTML',holder.innerHTML);}else command('insertText',plain);
    });
    editor.addEventListener('drop',e=>{e.preventDefault();notify('사진은 커서를 놓고 사진 넣기 버튼으로 선택하세요.');});
    const hint=document.createElement('p');hint.className='hint';hint.textContent='Ctrl+B 굵게 · Ctrl+I 기울임 · Ctrl+U 밑줄 · Enter 줄바꿈. 사진을 클릭하면 크기 변경·삭제가 가능합니다. 사진은 데이터 파일에 포함되어 용량이 커질 수 있습니다.';
    parent.append(toolbar,editor,file,hint);
  }
  window.RichEditor={mount};
})();
