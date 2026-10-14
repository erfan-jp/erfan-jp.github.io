'use strict';
const p=window.PROFILE;
const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n};
const append=(id,node)=>document.getElementById(id).append(node);
function link(label,url){if(!url){const n=el('span','missing',label+' [add link]');return n;}const n=el('a','',label);n.href=url;if(url.startsWith('https://'))n.rel='noopener noreferrer';return n;}
function linkedText(node,text,links=[]){
  let offset=0;
  while(offset<text.length){
    let next=null;
    for(const item of links){
      const position=text.indexOf(item.text,offset);
      if(position>=0&&(!next||position<next.position))next={...item,position};
    }
    if(!next){node.append(document.createTextNode(text.slice(offset)));break;}
    node.append(document.createTextNode(text.slice(offset,next.position)),link(next.text,next.url));
    offset=next.position+next.text.length;
  }
}
document.getElementById('name').textContent=p.name;
p.bio.forEach(t=>{
  const paragraph=el('p');
  t.split(/(\*\*[^*]+\*\*)/).forEach(part=>{
    if(part.startsWith('**')&&part.endsWith('**')){
      const emphasis=el('strong');
      linkedText(emphasis,part.slice(2,-2),p.bioLinks);
      paragraph.append(emphasis);
    }else linkedText(paragraph,part,p.bioLinks);
  });
  append('bio',paragraph);
});
const socialIcons={
  Email:'<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="4.5" width="19" height="15" rx="2"/><path d="m3 6 9 7 9-7"/></svg>',
  Scholar:'<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="currentColor"><path d="M12 1 0 10l4.7 3.6a8.2 8.2 0 0 1 14.6 0L24 10 12 1Z"/><circle cx="12" cy="17" r="6.5"/></svg>',
  LinkedIn:'<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="currentColor"><path d="M20.4 2H3.6C2.7 2 2 2.7 2 3.6v16.8c0 .9.7 1.6 1.6 1.6h16.8c.9 0 1.6-.7 1.6-1.6V3.6c0-.9-.7-1.6-1.6-1.6ZM8 18.7H5V9h3v9.7ZM6.5 7.7a1.7 1.7 0 1 1 0-3.4 1.7 1.7 0 0 1 0 3.4Zm12.2 11h-3v-4.8c0-1.1-.1-2.4-1.5-2.4s-1.8 1.1-1.8 2.3v4.9h-3V9h2.9v1.3h.1c.4-.8 1.4-1.6 2.8-1.6 3 0 3.5 1.9 3.5 4.4v5.6Z"/></svg>'
};
[['Email','mailto:'+p.email],['Scholar',p.scholar],['LinkedIn',p.linkedin]].forEach(([t,u])=>{
  if(!u)return;
  const a=link(t,u);
  a.className='social-icon';
  a.setAttribute('aria-label',t==='Scholar'?'Google Scholar':t);
  a.title=t==='Scholar'?'Google Scholar':t;
  a.innerHTML=socialIcons[t];
  append('social',a);
});
if(p.portrait){const img=el('img');img.src=p.portrait;img.alt=p.name;append('portrait',img);}else{document.getElementById('portrait').innerHTML='<svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="40" r="22" fill="currentColor"/><path d="M18 108c0-30 18-45 42-45s42 15 42 45" fill="currentColor"/></svg>';append('portrait',el('span','','[Add your portrait]'));}
p.news.forEach(n=>{const li=el('li'),body=el('span');linkedText(body,n.text,n.links);li.append(el('span','date',n.date),body);append('news-list',li);});
function paper(item,id){
  const article=el('article','paper');
  const figure=el('div','figure');
  if(item.image){
    figure.classList.add('has-image');
    const fullSize=el('a','figure-link');
    fullSize.href=item.image;
    fullSize.target='_blank';
    fullSize.rel='noopener noreferrer';
    fullSize.setAttribute('aria-label','View full-size '+(item.imageLabel||'figure')+' for '+item.title+' (opens in a new tab)');
    const img=el('img');
    img.src=item.image;
    img.alt=item.imageAlt||item.title+' research figure';
    img.loading='lazy';
    img.width=item.imageWidth;
    img.height=item.imageHeight;
    if(item.imagePanel==='left'){
      const panel=el('div','figure-left-panel');
      panel.append(img);
      fullSize.append(panel);
    }else fullSize.append(img);
    const caption=el('span','figure-caption',(item.imageLabel||'Figure')+' · View full size ↗');
    fullSize.append(caption);
    figure.append(fullSize);
  }else{
    figure.append(el('strong','',item.tag),el('span','','[Add research figure]'));
  }
  const body=el('div');
  const title=el('h3');
  const first=Object.values(item.links).find(Boolean);
  if(first)title.append(link(item.title,first));else title.textContent=item.title;
  body.append(title);
  if(item.authors){
    const authors=el('p','authors');
    item.authors.split(/(Erfan Jahanparast\*?)/).forEach(part=>authors.append(el(part.startsWith('Erfan Jahanparast')?'strong':'span','',part)));
    body.append(authors,el('p','venue',item.venue));
  }
  const links=el('div','paper-links');
  Object.entries(item.links).forEach(([t,u])=>links.append(link(t,u)));
  if(links.childElementCount)body.append(links);
  body.append(el('p','',item.description));
  article.append(figure,body);
  append(id,article);
}
p.publications.forEach(i=>paper(i,'publication-list'));p.projects.forEach(i=>paper(i,'project-list'));
function entries(items,id){
  items.forEach(i=>{
    const a=el('article','entry');
    const body=el('div','entry-content');
    if(i.logo){
      a.classList.add('has-logo');
      const logo=el('div','entry-logo');
      const img=el('img');
      img.src=i.logo;
      img.alt=i.logoAlt||i.org+' logo';
      img.loading='lazy';
      img.width=112;
      img.height=84;
      logo.append(img);
      a.append(logo);
    }
    const h=el('div','entry-head');
    h.append(el('h3','',i.org),el('span','date',i.dates));
    body.append(h,el('p','role',i.role));
    if(i.location)body.append(el('p','location',i.location));
    if(i.advisor)body.append(el('p','advisor','Advisor: '+i.advisor));
    if(i.text)body.append(el('p','',i.text));
    a.append(body);
    append(id,a);
  });
}
entries(p.experience,'experience-list');
