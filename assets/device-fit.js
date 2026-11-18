/* Keeps laptop mockups in proportion on small screens. An element with data-fit="600"
   lays its contents out at 600px wide and scales them down to fit when its box is narrower,
   so the mockup shrinks like a picture instead of reflowing into a tall screen. */
(function () {
  document.querySelectorAll('[data-fit]').forEach(function (box) {
    var W = +box.getAttribute('data-fit') || 600;
    var inner = document.createElement('div');
    while (box.firstChild) inner.appendChild(box.firstChild);
    box.appendChild(inner);
    inner.style.transformOrigin = 'top left';
    box.style.position = 'relative'; box.style.minWidth = '0';
    function fit() {
      var avail = box.clientWidth;
      if (!avail || avail >= W) { inner.style.cssText = 'transform-origin:top left'; box.style.height = ''; return; }
      var s = avail / W;
      inner.style.position = 'absolute'; inner.style.top = '0'; inner.style.left = '0';
      inner.style.width = W + 'px';
      inner.style.transform = 'scale(' + s + ')';
      box.style.height = Math.ceil(inner.offsetHeight * s) + 'px';
    }
    fit();
    if (window.ResizeObserver) new ResizeObserver(fit).observe(box); else window.addEventListener('resize', fit);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
  });
})();
