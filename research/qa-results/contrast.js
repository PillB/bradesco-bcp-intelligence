(function(){
  var results=[];
  var els=document.querySelectorAll('h1,h2,h3,h4,h5,p,span,strong,em,button,a');
  var seen={};
  for(var i=0;i<els.length;i++){
    var e=els[i];
    var cs=getComputedStyle(e);
    var c=cs.color;
    var r=e.getBoundingClientRect();
    if(r.width<30||r.height<8) continue;
    var m=c.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if(!m) continue;
    var R=+m[1],G=+m[2],B=+m[3];
    var max=Math.max(R,G,B), min=Math.min(R,G,B);
    var sat = max<1?0:((max-min)/Math.max(1,max));
    if(sat<0.18) continue;
    var key=c;
    if(seen[key]>5) continue;
    seen[key]=(seen[key]||0)+1;
    var p=e.parentElement;
    var pbg=p?getComputedStyle(p).backgroundColor:'?';
    results.push({tag:e.tagName, txt:(e.textContent||'').trim().substring(0,40), color:c, bg:pbg});
    if(results.length>=25) break;
  }
  return JSON.stringify(results,null,1);
})()
