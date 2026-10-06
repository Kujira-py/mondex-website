// MOTION_SCRIPT runs before the first paint and puts .mx-motion on <html>
// (unless Reduce Motion is on), so the hero animates from its first frame
// instead of flashing and jumping at hydration. If the page's JavaScript has
// not started within 4 s, it takes the class off again and shows everything:
// without JavaScript nothing stays hidden.
export const MOTION_SCRIPT =
  "(function(){var d=document.documentElement;if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;d.classList.add('mx-motion');setTimeout(function(){if(!window.__mxReady)d.classList.remove('mx-motion')},4000)})()";
