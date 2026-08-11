(function(){
  // Compute WCAG contrast ratio between two rgb colors
  function srgbToLin(c){ c=c/255; return c<=0.03928? c/12.92 : Math.pow((c+0.055)/1.055, 2.4); }
  function luminance(r,g,b){ return 0.2126*srgbToLin(r)+0.7152*srgbToLin(g)+0.0722*srgbToLin(b); }
  function contrast(rgb1, rgb2){
    var L1=luminance(rgb1[0],rgb1[1],rgb1[2]);
    var L2=luminance(rgb2[0],rgb2[1],rgb2[2]);
    var hi=Math.max(L1,L2), lo=Math.min(L1,L2);
    return (hi+0.05)/(lo+0.05);
  }
  // Walk up the parent chain to find the first non-transparent background
  function effectiveBg(el){
    var cur=el;
    var depth=0;
    while(cur && depth<10){
      var bg=getComputedStyle(cur).backgroundColor;
      var m=bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
      if(m){
        var a=m[4]===undefined?1:parseFloat(m[4]);
        if(a>0.5) return [parseInt(m[1]),parseInt(m[2]),parseInt(m[3])];
      }
      cur=cur.parentElement;
      depth++;
    }
    // Fallback to body bg
    var bb=getComputedStyle(document.body).backgroundColor;
    var bm=bb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    return bm?[parseInt(bm[1]),parseInt(bm[2]),parseInt(bm[3])]:[255,255,255];
  }
  function fontPx(el){
    var fs=getComputedStyle(el).fontSize;
    var m=fs.match(/([\d.]+)px/);
    return m?parseFloat(m[1]):16;
  }
  function isBold(el){
    var fw=parseInt(getComputedStyle(el).fontWeight);
    return fw>=600;
  }

  var results=[];
  var els=document.querySelectorAll('h1,h2,h3,h4,h5,h6,p,span,strong,em,button,a,label,div,li,td,th');
  var seen={};
  for(var i=0;i<els.length;i++){
    var e=els[i];
    if(e.children.length>2) continue;
    var cs=getComputedStyle(e);
    var c=cs.color;
    var cm=c.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if(!cm) continue;
    var fg=[parseInt(cm[1]),parseInt(cm[2]),parseInt(cm[3])];
    // Skip near-black or near-white (not brand color)
    var max=Math.max(fg[0],fg[1],fg[2]), min=Math.min(fg[0],fg[1],fg[2]);
    var sat=(max-min)/Math.max(1,max);
    if(sat<0.18) continue;
    var r=e.getBoundingClientRect();
    if(r.width<20||r.height<8) continue;
    var bg=effectiveBg(e);
    var ratio=contrast(fg,bg);
    if(ratio>=4.5) continue; // passes AA normal
    // Only report failures
    var fs=fontPx(e);
    var large = (fs>=24) || (fs>=18.66 && isBold(e));
    var aaLarge = ratio>=3;
    if(large && aaLarge) continue; // passes AA large
    var key=c+'|'+bg.join(',');
    if(seen[key]) continue;
    seen[key]=1;
    var txt=(e.textContent||'').trim().substring(0,50);
    if(!txt) continue;
    results.push({tag:e.tagName, txt:txt, color:c, bg:'rgb('+bg.join(',')+')', ratio:Math.round(ratio*100)/100, fontPx:Math.round(fs), bold:isBold(e), large:large});
    if(results.length>=25) break;
  }
  return JSON.stringify(results,null,1);
})()
