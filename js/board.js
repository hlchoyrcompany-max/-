(function(){
  'use strict';
  const boards=['전체글','인기글','자유게시판','후기','공지'];
  const requested=new URLSearchParams(location.search).get('board');
  const board=boards.includes(requested)?requested:'전체글';
  const config=window.LANDING_CONTENT||{};
  document.title=board+' — '+(config.brand||'백년건강소');
  document.getElementById('boardBrand').textContent=config.brand||'백년건강소';
  document.getElementById('boardTitle').textContent=board;
  for(const name of boards){const a=document.createElement('a');a.textContent=name;a.href='board.html?board='+encodeURIComponent(name);if(name===board)a.setAttribute('aria-current','page');document.getElementById('boardTabs').append(a);}
  const list=document.getElementById('boardList');
  // 현재 소스에 있는 게시글 한 편만 표시합니다. 서버 게시판/인기 순위는 아직 없습니다.
  if(board==='전체글'||board==='후기'){
    const a=document.createElement('a');a.className='board-post';a.href='index.html';const title=document.createElement('strong');title.textContent=config.title||'게시글';const info=document.createElement('span');info.textContent=[config.author,config.date].filter(Boolean).join(' · ');a.append(title,info);list.append(a);
  }else{
    const p=document.createElement('p');p.className='board-empty';p.textContent='아직 등록된 '+(board==='인기글'?'인기글이':'게시글이')+' 없습니다.';list.append(p);
  }
})();
