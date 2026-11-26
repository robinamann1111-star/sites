/* Shared motion layer v2 (Robin's sites, 17 Nov 2026): smooth scroll, soft glow cursor trail, gentle grow on hover.
   <script src="/motion.js" data-color="232,180,76" data-grow=".btn,.card" defer></script>
   data-grow="" turns hover-grow off (for pages that style their own). */
(function(){
  var me=document.currentScript||document.querySelector('script[src*="motion.js"]');
  var rgb=(me&&me.dataset.color)||'232,180,76';
  var growSel=me&&me.dataset.grow!==undefined?me.dataset.grow:'a.btn,.btn,a.cta,.cta,.card';
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var fine=window.matchMedia('(pointer: fine)').matches;
  var EASE='cubic-bezier(.22,1,.36,1)';

  var css=document.createElement('style');
  css.textContent='.mx-grow:hover{transform:translateY(-2px) scale(1.03)}.mx-grow:active{transform:scale(.98)}#mx-trail{position:fixed;inset:0;pointer-events:none;z-index:9999}';
  document.head.appendChild(css);

  function ready(fn){document.readyState!=='loading'?fn():document.addEventListener('DOMContentLoaded',fn);}
  ready(function(){
    if(growSel){
      document.querySelectorAll(growSel).forEach(function(el){
        var cs=getComputedStyle(el);
        if(cs.animationName&&cs.animationName!=='none') return;      /* never fight an existing animation */
        if(el.parentElement&&el.parentElement.closest('.mx-grow')) return; /* no double scaling */
        if(el.offsetWidth<60) return;                                   /* skip tiny chips */
        var t=cs.transitionProperty==='all'||cs.transitionDuration==='0s'?'':cs.transition;
        el.style.transition=(t?t+', ':'')+'transform .55s '+EASE;       /* keep the page's own transitions */
        el.classList.add('mx-grow');
      });
    }

    /* smooth scroll */
    document.documentElement.style.scrollBehavior='auto';
    var s=document.createElement('script');
    s.src='https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js';
    s.onload=function(){
      if(!window.Lenis) return;
      var lenis=new Lenis({duration:1.15,smoothWheel:true});
      (function raf(t){lenis.raf(t);requestAnimationFrame(raf);})(0);
      document.querySelectorAll('a[href^="#"]').forEach(function(a){a.addEventListener('click',function(e){var id=a.getAttribute('href');if(id.length>1){var t=document.querySelector(id);if(t){e.preventDefault();lenis.scrollTo(t,{offset:-70});}}});});
    };
    document.head.appendChild(s);

    /* soft glow trail, mouse only, sleeps when the cursor stops */
    if(!fine) return;
    var c=document.createElement('canvas');c.id='mx-trail';c.setAttribute('aria-hidden','true');document.body.appendChild(c);
    var x=c.getContext('2d'),dpr=Math.min(window.devicePixelRatio||1,2),pts=[],mx=-200,my=-200,hx=-200,hy=-200,idle=0,running=false;
    function size(){c.width=innerWidth*dpr;c.height=innerHeight*dpr;x.setTransform(dpr,0,0,dpr,0,0);} size(); addEventListener('resize',size);
    function loop(){
      hx+=(mx-hx)*.22; hy+=(my-hy)*.22; idle++;
      pts.push({x:hx,y:hy}); if(pts.length>28) pts.shift();
      x.clearRect(0,0,innerWidth,innerHeight);
      if(idle>90){running=false;pts=[];return;}
      for(var i=0;i<pts.length;i++){
        var k=i/pts.length,r=4+k*16,p=pts[i],g=x.createRadialGradient(p.x,p.y,0,p.x,p.y,r);
        g.addColorStop(0,'rgba('+rgb+','+(k*.22)+')');g.addColorStop(1,'rgba('+rgb+',0)');
        x.fillStyle=g;x.beginPath();x.arc(p.x,p.y,r,0,6.283);x.fill();
      }
      x.fillStyle='rgba('+rgb+',.9)';x.beginPath();x.arc(hx,hy,3,0,6.283);x.fill();
      requestAnimationFrame(loop);
    }
    addEventListener('pointermove',function(e){mx=e.clientX;my=e.clientY;idle=0;if(!running){running=true;if(hx<-100){hx=mx;hy=my;}requestAnimationFrame(loop);}});
  });
})();
