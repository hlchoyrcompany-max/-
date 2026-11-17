(function(root){
  'use strict';
  // Upgrade the two supplied search links without rewriting embedded article photos.
  function upgradeSearchCards(data){
    for(const post of data?.posts||[]){
      if(post.id!=='health-notes-draft')continue;
      for(const block of post.blocks||[]){
        if(typeof block.html!=='string')continue;
        const match=block.html.match(/<a\b[^>]*href="(https:\/\/search\.naver\.com\/[^"]+)"[^>]*>https:\/\/search\.naver\.com\/[\s\S]*?<\/a>/);
        const url=match?match[1]:'https://search.naver.com/search.naver?query=%EB%B0%B1%EB%85%84%EA%B1%B4%EA%B0%95%EC%86%8C';
        const card='<a class="link-card" href="'+url+'" target="_blank" rel="noopener noreferrer"><span class="link-card-icon">N</span><span class="link-card-copy"><span class="link-card-title">백년건강소 : 네이버 검색</span><span class="link-card-description">&#39;백년건강소&#39;의 네이버 검색 결과입니다.</span><span class="link-card-domain">search.naver.com</span></span></a>';
        if(match)block.html=block.html.replace(match[0],()=>card);
        block.html=block.html.replace(/<p\b[^>]*>백년건강소 : 네이버 검색\s*\n\s*'백년건강소'의 네이버 검색 결과입니다\.\s*\n\s*search\.naver\.com<\/p>/,()=>card);
      }
    }
  }
  upgradeSearchCards(root.BLOG_DATA);
  const boards=['전체글','인기글','자유게시판','후기','공지'];
  function visible(posts){return (Array.isArray(posts)?posts:[]).filter(p=>p&&p.published===true&&p.reviewRequired!==true);}
  function filterPosts(posts,board='전체글',query=''){
    const q=String(query).trim().toLocaleLowerCase();
    return visible(posts).filter(p=>(board==='전체글'||(board==='인기글'?p.featured===true:p.category===board))&&(!q||[p.title,p.description,p.author,...(Array.isArray(p.tags)?p.tags:[])].join(' ').toLocaleLowerCase().includes(q))).sort((a,b)=>(Date.parse(b.updatedAt)||0)-(Date.parse(a.updatedAt)||0));
  }
  function getPost(posts,id){return visible(posts).find(p=>p.id===id)||null;}
  function serialize(data){return '/* 오늘의 기록 블로그 데이터 — editor.html에서 편집 */\nwindow.BLOG_DATA = '+JSON.stringify(data,null,2).replace(/</g,'\\u003c')+';\n';}
  function valid(data){return !!data&&typeof data.site==='object'&&data.site!==null&&Array.isArray(data.posts)&&data.posts.every(p=>p&&/^[a-z0-9][a-z0-9-]*$/.test(p.id)&&typeof p.title==='string'&&Array.isArray(p.blocks))&&new Set(data.posts.map(p=>p.id)).size===data.posts.length;}
  function postHref(id,search=''){const params=new URLSearchParams();params.set('post',id);const incoming=new URLSearchParams(search);for(const key of ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','utm_id']){const value=incoming.get(key);if(value)params.set(key,value);}return 'post.html?'+params.toString();}
  const api={boards,visible,filterPosts,getPost,serialize,valid,postHref};root.BlogCore=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
