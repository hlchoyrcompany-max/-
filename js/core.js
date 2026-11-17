(function(root){
  'use strict';
  const utmKeys=['utm_source','utm_medium','utm_campaign','utm_content','utm_term','utm_id'];
  function httpUrl(value){try{const u=new URL(String(value||''));return ['https:','http:'].includes(u.protocol)?u:null;}catch{return null;}}
  function imageUrl(value){const v=String(value||'').trim();if(!v||/[\u0000-\u001f]/.test(v))return '';if(httpUrl(v))return v;if(/^(assets\/images\/|\.\/assets\/images\/)[a-zA-Z0-9_./%\-]+$/.test(v)&&!v.includes('..'))return v;return '';}
  function buildUtm(base,values){const u=httpUrl(base);if(!u)throw new Error('http:// 또는 https://로 시작하는 주소를 입력해 주세요.');for(const key of utmKeys){const value=String(values[key]||'').trim();if(value)u.searchParams.set(key,value);else u.searchParams.delete(key);}return u.href;}
  function purchaseUrl(base,search,forward){const u=httpUrl(base);if(!u)return '';if(forward){const incoming=new URLSearchParams(search);for(const key of utmKeys){const v=incoming.get(key);if(v&&!u.searchParams.has(key))u.searchParams.set(key,v);}}return u.href;}
  function serialize(config){return '/* 백년건강소 랜딩 설정 */\nwindow.LANDING_CONTENT = '+JSON.stringify(config,null,2).replace(/</g,'\\u003c')+';\n';}
  const api={utmKeys,httpUrl,imageUrl,buildUtm,purchaseUrl,serialize};
  root.LandingCore=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
