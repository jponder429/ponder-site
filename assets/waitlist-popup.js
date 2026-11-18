/* Ponder waitlist pop-up.
   Shows once per visitor after 30 seconds, a half-page scroll or exit intent.
   Any element with data-waitlist opens it on click (data-waitlist="genethyx-home" tags the source).
   Bottom sheet on phones. Posts to /api/waitlist as a quick signup. */
(function () {
  var KEY = 'ponder_wl_seen';
  var es = (document.documentElement.lang || '').slice(0, 2) === 'es';
  var T = es ? {
    cohort: 'Founding cohort',
    title: 'Sé de los primeros en recibir precios de fundador y otros beneficios.',
    lead: 'Únete a la lista de espera de Ponder para tener acceso anticipado a Ponder AI Fundamentals, precios del Founding Cohort en las credenciales pagadas y más.',
    email: 'Correo de trabajo', industry: 'Industria', who: 'Me inscribo', me: 'Para mí', team: 'Para mi equipo',
    join: 'Únete a la lista de espera', sending: 'Enviando…',
    consent: 'Al unirte, aceptas recibir correos de marketing de The Present Company. Puedes darte de baja en cualquier momento. <a href="/privacy" hreflang="en">Política de privacidad</a>',
    no: 'No, gracias', close: 'Cerrar',
    ok: 'Ya estás en la lista. Revisa tu correo.', bad: 'Escribe un correo válido.',
    err: 'Algo salió mal. Inténtalo de nuevo o escríbenos a info@thepresentco.com.',
    inds: [['Law', 'Derecho'], ['Healthcare', 'Salud'], ['Finance', 'Finanzas'], ['Technology', 'Tecnología'], ['Education', 'Educación'], ['General / Other', 'Otra industria']]
  } : {
    cohort: 'Founding cohort',
    title: 'Be first in line for founder pricing and other perks.',
    lead: 'Join the Ponder waitlist for early access to Ponder AI Fundamentals, founding-cohort pricing on paid credentials, and more!',
    email: 'Work email', industry: 'Industry', who: "I'm signing up", me: 'For myself', team: 'For my team',
    join: 'Join the waitlist', sending: 'Sending…',
    consent: 'By joining, you agree to receive marketing emails from The Present Company. You can unsubscribe at any time. <a href="/privacy">Privacy Policy</a>',
    no: 'No thanks', close: 'Close',
    ok: "You're on the list. Check your inbox.", bad: 'Enter a valid email.',
    err: 'Something went wrong. Try again or email info@thepresentco.com.',
    inds: [['Law', 'Law'], ['Healthcare', 'Healthcare'], ['Finance', 'Finance'], ['Technology', 'Technology'], ['Education', 'Education'], ['General / Other', 'Another industry']]
  };

  var css = ''
    + '.pwl-back{position:fixed;inset:0;z-index:9999;background:rgba(12,29,56,.72);display:flex;align-items:center;justify-content:center;padding:20px;box-sizing:border-box;font-family:"Instrument Sans",sans-serif;color:#0C1D38}'
    + '.pwl{--fill:#F5C542;position:relative;width:100%;max-width:580px;max-height:calc(100vh - 40px);overflow:auto;padding:44px 44px 36px;display:flex;flex-direction:column;gap:22px;box-sizing:border-box;border:14px solid transparent;background-color:transparent;background-image:linear-gradient(var(--fill),var(--fill)),repeating-linear-gradient(90deg,transparent 0 119px,#B8943F 119px 120px,transparent 120px 384px),repeating-linear-gradient(0deg,transparent 0 72px,rgba(245,197,66,.9) 72px 96px,transparent 96px 168px,rgba(127,174,146,.9) 168px 192px,transparent 192px 384px),repeating-linear-gradient(90deg,#0C1D38 0 72px,#F5C542 72px 96px,#DCEBE1 96px 144px,#7FAE92 144px 168px,#F8F5EF 168px 216px,#0C1D38 216px 312px,#F5C542 312px 336px,#DCEBE1 336px 384px);background-origin:padding-box,border-box,border-box,border-box;background-clip:padding-box,border-box,border-box,border-box;animation:pwl-drift 40s linear infinite,pwl-pop .5s cubic-bezier(.2,.7,.2,1) both}'
    + '@keyframes pwl-drift{from{background-position:0 0,0 0,0 0,0 0}to{background-position:0 0,384px 0,0 384px,384px 0}}'
    + '@keyframes pwl-pop{from{opacity:0;transform:translateY(24px) scale(.98)}to{opacity:1;transform:none}}'
    + '.pwl h2{margin:0;font-weight:700;font-size:clamp(32px,6vw,44px);line-height:1;letter-spacing:-0.04em;max-width:14ch}'
    + '.pwl p{margin:0}.pwl a{color:#0C1D38}'
    + '.pwl .lab{font-family:"DM Mono",monospace;font-size:12px;letter-spacing:.14em;text-transform:uppercase}'
    + '.pwl input[type=email],.pwl select{min-height:52px;padding:0 16px;border:2px solid #0C1D38;background:#fff;color:#0C1D38;font:inherit;font-size:17px;border-radius:0;box-sizing:border-box;width:100%}'
    + '.pwl input:focus,.pwl select:focus,.pwl button:focus-visible,.pwl a:focus-visible{outline:3px solid #0C1D38;outline-offset:2px}'
    + '.pwl .go{min-height:56px;border:0;background:#0C1D38;color:#F8F5EF;font:inherit;font-weight:600;font-size:18px;cursor:pointer}'
    + '.pwl .go:hover{background:#13264A}.pwl .go[disabled]{opacity:.7;cursor:wait}'
    + '.pwl .x{position:absolute;top:12px;right:12px;width:44px;height:44px;border:0;background:transparent;cursor:pointer;display:flex;align-items:center;justify-content:center}'
    + '.pwl .msg{font-weight:600;font-size:16px;min-height:1px}'
    + '.pwl .hp{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}'
    + '@media (max-width:640px){.pwl-back{align-items:flex-end;padding:0}.pwl{max-width:none;max-height:92vh;padding:36px 22px 28px;border-width:10px;border-bottom-width:0}}'
    + '@media (prefers-reduced-motion:reduce){.pwl{animation:none}}';

  var sun = '<svg viewBox="-.5 -.5 1 1" aria-hidden="true" style="display:inline-block;width:.42em;height:.42em;margin-left:.03em;vertical-align:-.05em;overflow:visible"><circle r=".24" fill="#0C1D38"></circle><path fill="#0C1D38" d="M0.278 0.037L0.462 0.191L0.222 0.170ZM0.170 0.222L0.191 0.462L0.037 0.278ZM-0.037 0.278L-0.191 0.462L-0.170 0.222ZM-0.222 0.170L-0.462 0.191L-0.278 0.037ZM-0.278 -0.037L-0.462 -0.191L-0.222 -0.170ZM-0.170 -0.222L-0.191 -0.462L-0.037 -0.278ZM0.037 -0.278L0.191 -0.462L0.170 -0.222ZM0.222 -0.170L0.462 -0.191L0.278 -0.037Z"></path></svg>';

  function seen() { try { return localStorage.getItem(KEY) === '1'; } catch (e) { return false; } }
  function mark() { try { localStorage.setItem(KEY, '1'); } catch (e) {} }

  var open = false, lastFocus = null, back = null;

  function close() {
    if (!back) return;
    back.remove(); back = null; open = false; mark();
    document.removeEventListener('keydown', onKey);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function onKey(e) {
    if (e.key === 'Escape') { close(); return; }
    if (e.key === 'Tab' && back) {
      var f = back.querySelectorAll('button,input,select,a[href]');
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }

  function show(tag) {
    if (open) return;
    open = true; mark(); lastFocus = document.activeElement;
    if (!document.getElementById('pwl-css')) {
      var st = document.createElement('style'); st.id = 'pwl-css'; st.textContent = css; document.head.appendChild(st);
    }
    var opts = T.inds.map(function (o) { return '<option value="' + o[0] + '">' + o[1] + '</option>'; }).join('');
    back = document.createElement('div');
    back.className = 'pwl-back';
    back.innerHTML = '<div class="pwl" role="dialog" aria-modal="true" aria-labelledby="pwl-title">'
      + '<button type="button" class="x" aria-label="' + T.close + '"><svg viewBox="0 0 24 24" aria-hidden="true" style="width:22px;height:22px" fill="none" stroke="#0C1D38" stroke-width="2.2" stroke-linecap="square"><path d="M5 5l14 14M19 5L5 19"></path></svg></button>'
      + '<div style="display:flex;align-items:baseline;gap:12px"><span style="font-family:\'Schibsted Grotesk\',sans-serif;font-weight:700;font-size:28px;letter-spacing:-0.055em;line-height:1">Ponder' + sun + '</span><span class="lab">' + T.cohort + '</span></div>'
      + '<h2 id="pwl-title">' + T.title + '</h2>'
      + '<p style="font-size:18px;line-height:1.5;max-width:44ch">' + T.lead + '</p>'
      + '<form novalidate style="display:flex;flex-direction:column;gap:16px">'
      + '<div style="display:flex;flex-direction:column;gap:6px"><label class="lab" for="pwl-email">' + T.email + '</label><input id="pwl-email" name="email" type="email" autocomplete="email" required placeholder="you@company.com"></div>'
      + '<div style="display:flex;flex-direction:column;gap:6px"><label class="lab" for="pwl-ind">' + T.industry + '</label><select id="pwl-ind" name="industry">' + opts + '</select></div>'
      + '<fieldset style="margin:0;padding:0;border:0;display:flex;flex-wrap:wrap;gap:8px 24px;align-items:center"><legend class="lab" style="padding:0;margin-bottom:8px">' + T.who + '</legend>'
      + '<label style="display:inline-flex;align-items:center;gap:10px;min-height:44px;font-size:17px;cursor:pointer"><input type="radio" name="for" value="self" checked style="width:20px;height:20px;accent-color:#0C1D38;margin:0">' + T.me + '</label>'
      + '<label style="display:inline-flex;align-items:center;gap:10px;min-height:44px;font-size:17px;cursor:pointer"><input type="radio" name="for" value="team" style="width:20px;height:20px;accent-color:#0C1D38;margin:0">' + T.team + '</label></fieldset>'
      + '<div class="hp" aria-hidden="true"><label>Website<input name="website" tabindex="-1" autocomplete="off"></label></div>'
      + '<button type="submit" class="go">' + T.join + '</button>'
      + '<p class="msg" role="status" aria-live="polite"></p>'
      + '</form>'
      + '<p style="font-size:13px;line-height:1.5">' + T.consent + '</p>'
      + '<div style="display:flex;justify-content:space-between;align-items:center;gap:12px;border-top:1px solid rgba(12,29,56,.3);padding-top:14px"><a href="#" class="no" style="font-size:15px;font-weight:600">' + T.no + '</a><span class="lab" style="font-size:11px">When diligence is due.</span></div>'
      + '</div>';
    document.body.appendChild(back);

    back.addEventListener('click', function (e) { if (e.target === back) close(); });
    back.querySelector('.x').addEventListener('click', close);
    back.querySelector('.no').addEventListener('click', function (e) { e.preventDefault(); close(); });
    document.addEventListener('keydown', onKey);

    var form = back.querySelector('form'), msg = back.querySelector('.msg'), btn = back.querySelector('.go');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = form.email.value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { msg.textContent = T.bad; form.email.focus(); return; }
      btn.disabled = true; btn.textContent = T.sending; msg.textContent = '';
      var who = form.querySelector('input[name=for]:checked').value;
      var src = (tag || 'popup') + '-' + who + (es ? '-es' : '');
      fetch('/api/waitlist', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, industry: form.industry.value, quick: true, src: src, website: form.website.value })
      }).then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return r.ok && j.ok; }); })
        .then(function (ok) {
          if (ok) { form.style.display = 'none'; var p = document.createElement('p'); p.className = 'msg'; p.setAttribute('role', 'status'); p.textContent = T.ok; form.parentNode.insertBefore(p, form); }
          else { btn.disabled = false; btn.textContent = T.join; msg.textContent = T.err; }
        })
        .catch(function () { btn.disabled = false; btn.textContent = T.join; msg.textContent = T.err; });
    });
    setTimeout(function () { var i = back && back.querySelector('#pwl-email'); if (i) i.focus(); }, 60);
  }

  // Manual triggers work every time, even after the automatic pop-up has run.
  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('[data-waitlist]');
    if (!t) return;
    e.preventDefault();
    show(t.getAttribute('data-waitlist') || 'button');
  });

  // Automatic triggers: once per visitor.
  if (seen()) return;
  var fired = false;
  function auto() { if (fired || seen()) return; fired = true; show('popup'); cleanup(); }
  var timer = setTimeout(auto, 30000);
  function onScroll() {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    if (h > 0 && window.scrollY / h >= 0.5) auto();
  }
  function onLeave(e) { if (!e.relatedTarget && e.clientY <= 0) auto(); }
  function cleanup() {
    clearTimeout(timer);
    window.removeEventListener('scroll', onScroll);
    document.removeEventListener('mouseout', onLeave);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  document.addEventListener('mouseout', onLeave);
})();
