(function(){
  // soft reveals
  var els=document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.12,rootMargin:'0px 0px -40px 0px'});
    els.forEach(function(el,i){el.style.transitionDelay=(el.dataset.d||0)+'ms';io.observe(el);});
  } else els.forEach(function(el){el.classList.add('in');});
  // click-to-play reels
  document.querySelectorAll('.reel[data-src]').forEach(function(r){
    r.addEventListener('click',function(){
      if(r.classList.contains('on')) return;
      var v=document.createElement('video');v.src=r.dataset.src;v.controls=true;v.playsInline=true;v.autoplay=true;
      var img=r.querySelector('img');if(img)img.replaceWith(v);r.classList.add('on');
    });
  });
  // free-clip form -> opens an email to Robin (static site, no form backend)
  var f=document.getElementById('clipform');
  if(f) f.addEventListener('submit',function(e){
    e.preventDefault();
    if(f.website&&f.website.value) return;
    var d=new FormData(f),lines=[];
    ['name','email','episode','handle','offer'].forEach(function(k){lines.push(k+': '+(d.get(k)||''));});
    location.href='mailto:robin.amann1111@gmail.com?subject='+encodeURIComponent('Free clip request: '+(d.get('name')||''))+'&body='+encodeURIComponent(lines.join('\n'));
  });
})();
