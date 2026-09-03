/* ============================================================
   RILAPE — UI: catálogo, filtros, buscador, modal, carrito,
   checkout (delivery/retiro + mapa) y WhatsApp.
   ============================================================ */
(function () {
  "use strict";
  var D = window.RILAPE || { products: [], categories: [], waNumber: "595986238556" };
  var Cart = window.RilapeCart;
  var WA = D.waNumber;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var byId = {}; D.products.forEach(function (p) { byId[p.id] = p; });
  var catName = {}; D.categories.forEach(function (c) { catName[c.slug] = c.name; });

  var ICON = {
    cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 3h2l2.4 12.3a1.5 1.5 0 0 0 1.5 1.2h8.6a1.5 1.5 0 0 0 1.5-1.2L21 7H6"/><circle cx="9.5" cy="20" r="1.2" fill="currentColor" stroke="none"/><circle cx="18" cy="20" r="1.2" fill="currentColor" stroke="none"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.2-3.2"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 5v14M5 12h14"/></svg>',
    minus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M5 12h14"/></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m2 0-.7 12a2 2 0 0 1-2 1.9H8.7a2 2 0 0 1-2-1.9L6 7"/></svg>',
    wa: '<svg viewBox="0 0 32 32" fill="currentColor"><path d="M16 3C9 3 3.3 8.7 3.3 15.7c0 2.5.7 4.8 1.9 6.8L3 29l6.7-2.1c1.9 1 4 1.6 6.3 1.6 7 0 12.7-5.7 12.7-12.7S23 3 16 3zm0 23.1c-2 0-3.9-.5-5.5-1.5l-.4-.2-3.9 1.2 1.3-3.8-.3-.4a10.3 10.3 0 0 1-1.6-5.5c0-5.7 4.7-10.4 10.4-10.4s10.4 4.7 10.4 10.4S21.7 26.1 16 26.1zm5.7-7.8c-.3-.2-1.8-.9-2.1-1s-.5-.2-.7.2-.8 1-.9 1.2-.3.2-.6.1a8.5 8.5 0 0 1-2.5-1.5 9.4 9.4 0 0 1-1.7-2.2c-.2-.3 0-.5.1-.6l.5-.5.3-.5c.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.5.3-.7.3-1.4.2-1.5s-.3-.2-.5-.3z"/></svg>',
    ig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" stroke="none"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 21s7-5.7 7-11a7 7 0 1 0-14 0c0 5.3 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>',
    truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 6h11v9H3zM14 9h4l3 3v3h-7z"/><circle cx="7" cy="18" r="1.6"/><circle cx="17.5" cy="18" r="1.6"/></svg>',
    store: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 9h16v10H4zM3 9l1.5-4h15L21 9M9 19v-5h6v5"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 5c0 8 7 15 15 15l0-3.5-4-1.5-2 2a12 12 0 0 1-6-6l2-2L7.5 5z"/></svg>',
    eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 7h16M4 12h16M4 17h16"/></svg>'
  };

  function imgTag(p, cls) {
    return '<picture><source srcset="assets/img/products/' + p.id + '.webp" type="image/webp">' +
      '<img src="assets/img/products/' + p.id + '.jpg" alt="Vela ' + esc(p.name) + ' — Rilape" loading="lazy" decoding="async"' +
      (cls ? ' class="' + cls + '"' : '') + '></picture>';
  }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  /* ---------- inject shared UI (scrim, drawer, modal, toast, wa) ---------- */
  function injectShared() {
    var frag = document.createElement("div");
    frag.innerHTML =
      '<div class="scrim" data-scrim></div>' +
      '<a class="wa-float" data-wa-float href="#" aria-label="Escribinos por WhatsApp" target="_blank" rel="noopener">' + ICON.wa + '</a>' +
      '<aside class="drawer" data-drawer aria-label="Tu pedido" aria-hidden="true">' +
        '<div class="drawer__head"><h3>Tu pedido</h3><button class="icon-btn" data-cart-close aria-label="Cerrar">' + ICON.close + '</button></div>' +
        '<div class="drawer__scroll">' +
          '<div class="drawer__body" data-cart-body></div>' +
          '<div class="drawer__foot" data-cart-foot hidden></div>' +
        '</div>' +
      '</aside>' +
      '<div class="overlay" data-modal aria-hidden="true"><div class="modal" role="dialog" aria-modal="true"><button class="modal__close" data-modal-close aria-label="Cerrar">' + ICON.close + '</button><div data-modal-content></div></div></div>' +
      '<div class="toast" data-toast></div>';
    document.body.appendChild(frag);
    // wa float default link
    $("[data-wa-float]").href = "https://wa.me/" + WA + "?text=" + encodeURIComponent("Hola Rilape, quería hacer una consulta 😊");
  }

  function toast(msg) {
    var t = $("[data-toast]"); if (!t) return;
    t.textContent = msg; t.classList.add("show");
    clearTimeout(t._t); t._t = setTimeout(function () { t.classList.remove("show"); }, 2200);
  }

  /* ---------- header behaviour ---------- */
  function initHeroVideo() {
    var vids = $$(".hero__video"); if (!vids.length) return;
    var tryPlay = function () {
      vids.forEach(function (v) { v.muted = true; var p = v.play(); if (p && p.catch) p.catch(function () {}); });
    };
    vids.forEach(function (v) {
      v.muted = true; v.defaultMuted = true; v.setAttribute("muted", "");
      v.addEventListener("canplay", tryPlay, { once: true });
    });
    tryPlay();
    // reintento tras interacción por si el navegador bloquea el autoplay
    document.addEventListener("touchstart", tryPlay, { once: true, passive: true });
    document.addEventListener("scroll", tryPlay, { once: true, passive: true });
    document.addEventListener("click", tryPlay, { once: true });
  }
  function initHeader() {
    var h = $(".site-header");
    if (h) {
      var onScroll = function () { h.classList.toggle("scrolled", window.scrollY > 8); };
      onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
    }
    // Enlace directo (además de la delegación global) — más fiable en móviles reales,
    // donde tocar el <svg> dentro del botón a veces no dispara el click delegado.
    $$("[data-nav-toggle]").forEach(function (b) { b.addEventListener("click", toggleNav); });
    $$("[data-cart-open]").forEach(function (b) { b.addEventListener("click", function (e) { e.preventDefault(); openCart(); }); });
  }
  var _lastNav = 0;
  function toggleNav() {
    var now = Date.now(); if (now - _lastNav < 60) return; _lastNav = now; // dedup del mismo click (directo + delegación)
    var nav = $("[data-nav]"), scrim = $("[data-scrim]");
    if (!nav) return;
    var open = nav.classList.toggle("open");
    if (scrim) scrim.classList.toggle("open", open);
  }

  /* ---------- overlays open/close ---------- */
  function openScrim() { var s = $("[data-scrim]"); if (s) s.classList.add("open"); }
  function closeAll() {
    var nav = $("[data-nav]"); if (nav) nav.classList.remove("open");
    var d = $("[data-drawer]"); if (d) { d.classList.remove("open"); d.setAttribute("aria-hidden", "true"); }
    var s = $("[data-scrim]"); if (s) s.classList.remove("open");
  }

  /* ---------- cart drawer ---------- */
  function openCart() {
    renderCart();
    var d = $("[data-drawer]"); d.classList.add("open"); d.setAttribute("aria-hidden", "false");
    openScrim();
  }
  function renderBadge() {
    var n = Cart.count();
    $$("[data-cart-count]").forEach(function (b) {
      b.textContent = n; b.classList.toggle("show", n > 0);
    });
  }
  function cartRowHtml(item) {
    var p = byId[item.id]; if (!p) return "";
    var opts = [];
    if (item.size) opts.push(esc(item.size));
    if (item.frag) opts.push(esc(item.frag));
    var sub = opts.length ? opts.join(" · ") : (esc(catName[p.cat] || "") + (p.sub ? " · " + esc(p.sub) : ""));
    return '<div class="cart-item" data-row="' + esc(Cart.keyOf(item)) + '">' +
      '<div class="cart-item__img">' + imgTag(p) + '</div>' +
      '<div><div class="cart-item__name">' + esc(p.name) + '</div>' +
      '<div class="cart-item__sub">' + sub + '</div>' +
      '<div class="cart-item__qty"><button data-dec aria-label="Menos">' + ICON.minus + '</button><span>' + item.qty + '</span><button data-inc aria-label="Más">' + ICON.plus + '</button></div></div>' +
      '<button class="cart-item__remove" data-remove aria-label="Quitar">' + ICON.trash + '</button></div>';
  }
  function renderCart() {
    var items = Cart.items(), body = $("[data-cart-body]"), foot = $("[data-cart-foot]");
    if (!items.length) {
      body.innerHTML = '<div class="cart-empty">' + ICON.cart + '<p>Tu pedido está vacío.<br>Agregá velas desde el catálogo.</p><a class="btn btn--gold" href="catalogo.html">Ver catálogo</a></div>';
      foot.hidden = true; return;
    }
    body.innerHTML = items.map(cartRowHtml).join("");
    foot.hidden = false;
    foot.innerHTML = checkoutHtml(Cart.count());
    bindCheckout();
  }

  function checkoutHtml(count) {
    return '<p class="checkout__label">Entrega</p>' +
      '<div class="seg" data-seg>' +
        '<button type="button" data-mode="retiro" class="active">' + ICON.store + 'Retiro en local</button>' +
        '<button type="button" data-mode="delivery">' + ICON.truck + 'Delivery</button>' +
      '</div>' +
      '<div class="field"><label for="ck-name">Tu nombre</label><input id="ck-name" data-ck-name type="text" placeholder="Nombre y apellido" autocomplete="name"></div>' +
      '<div data-delivery-fields hidden>' +
        '<div class="field"><label for="ck-zone">Dirección / zona de entrega</label><input id="ck-zone" data-ck-zone type="text" placeholder="Barrio, calle, referencia"></div>' +
        '<p class="map-hint">' + ICON.pin + '<span>Marcá el punto de entrega en el mapa.</span></p>' +
        '<div id="delivery-map" role="application" aria-label="Mapa para marcar el punto de entrega"></div>' +
        '<p class="map-hint" data-map-status><span>Tocá el mapa o arrastrá el marcador.</span></p>' +
      '</div>' +
      '<button class="btn btn--wa btn--block" data-send>' + ICON.wa + 'Finalizar pedido por WhatsApp</button>' +
      '<button class="btn btn--ghost btn--block" style="margin-top:.6rem" data-clear>Vaciar pedido</button>';
  }

  var checkout = { mode: "retiro", latlng: null, map: null, marker: null };

  function bindCheckout() {
    var seg = $("[data-seg]"); if (!seg) return;
    seg.addEventListener("click", function (e) {
      var b = e.target.closest("[data-mode]"); if (!b) return;
      checkout.mode = b.getAttribute("data-mode");
      $$("[data-mode]", seg).forEach(function (x) { x.classList.toggle("active", x === b); });
      var df = $("[data-delivery-fields]");
      df.hidden = checkout.mode !== "delivery";
      if (checkout.mode === "delivery") ensureMap();
    });
    $("[data-send]").addEventListener("click", sendOrder);
    $("[data-clear]").addEventListener("click", function () {
      if (confirm("¿Vaciar tu pedido?")) { Cart.clear(); }
    });
  }

  /* ---------- Leaflet (carga diferida, sin API key) ---------- */
  var STORE = { lat: -25.29365, lng: -57.58057, zoom: 14 };
  function ensureMap() {
    if (checkout.map) { setTimeout(function () { checkout.map.invalidateSize(); }, 60); return; }
    loadLeaflet(function () {
      var el = $("#delivery-map"); if (!el || checkout.map) return;
      var map = L.map(el, { scrollWheelZoom: false }).setView([STORE.lat, STORE.lng], STORE.zoom);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19, attribution: "© OpenStreetMap"
      }).addTo(map);
      var marker = L.marker([STORE.lat, STORE.lng], { draggable: true }).addTo(map);
      function set(ll) {
        checkout.latlng = ll; marker.setLatLng(ll);
        var s = $("[data-map-status]");
        if (s) s.innerHTML = ICON.pin + '<span><b>Punto marcado.</b> Podés ajustarlo arrastrando el marcador.</span>';
      }
      map.on("click", function (e) { set(e.latlng); });
      marker.on("dragend", function () { set(marker.getLatLng()); });
      checkout.map = map; checkout.marker = marker;
      setTimeout(function () { map.invalidateSize(); }, 80);
    });
  }
  function loadLeaflet(cb) {
    if (window.L) return cb();
    if (!$('link[data-leaflet]')) {
      var css = document.createElement("link");
      css.rel = "stylesheet"; css.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      css.setAttribute("data-leaflet", ""); document.head.appendChild(css);
    }
    var s = document.createElement("script");
    s.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    s.onload = cb;
    s.onerror = function () { var st = $("[data-map-status]"); if (st) st.innerHTML = '<span>No se pudo cargar el mapa. Podés escribir la dirección arriba.</span>'; };
    document.head.appendChild(s);
  }

  /* ---------- construir y enviar el mensaje de WhatsApp ---------- */
  function sendOrder() {
    var items = Cart.items(); if (!items.length) return;
    var name = ($("[data-ck-name]") || {}).value || "";
    var lines = ["Hola Rilape, quiero hacer un pedido:"];
    items.forEach(function (it) {
      var p = byId[it.id]; if (!p) return;
      var opts = [];
      if (it.size) opts.push(it.size);
      if (it.frag) opts.push(it.frag);
      var detail = opts.length ? " (" + opts.join(", ") + ")" : "";
      lines.push("• " + p.name + detail + " x" + it.qty);
    });
    lines.push("");
    if (checkout.mode === "delivery") {
      lines.push("Entrega: Delivery 🛵");
      var zone = ($("[data-ck-zone]") || {}).value || "";
      if (zone) lines.push("Dirección/Zona: " + zone);
      if (checkout.latlng) {
        var la = checkout.latlng.lat.toFixed(6), ln = checkout.latlng.lng.toFixed(6);
        lines.push("Ubicación en el mapa: https://www.google.com/maps?q=" + la + "," + ln);
      } else {
        lines.push("Ubicación en el mapa: (a coordinar)");
      }
    } else {
      lines.push("Entrega: Retiro en el local 🏬");
    }
    lines.push("Nombre: " + (name || ""));
    var url = "https://wa.me/" + WA + "?text=" + encodeURIComponent(lines.join("\n"));
    window.open(url, "_blank", "noopener");
  }

  /* ---------- product modal ---------- */
  function specTable(p) {
    if (!p.sizes || !p.sizes.length) return "";
    var multi = p.sizes.length > 1 || (p.sizes[0] && p.sizes[0].n && p.sizes[0].n !== p.name);
    var rows = p.sizes.map(function (s) {
      return "<tr>" +
        (multi ? "<td>" + esc(s.n || "") + "</td>" : "") +
        "<td>" + esc(s.peso || "—") + "</td><td>" + esc(s.cant || "—") + "</td><td>" + esc(s.alt || "—") + "</td><td>" + esc(s.diam || "—") + "</td><td>" + esc(s.dur || "—") + "</td></tr>";
    }).join("");
    return '<div class="modal__block"><h4>Medidas</h4><div class="spec-wrap"><table class="spec-table"><thead><tr>' +
      (multi ? "<th>Producto</th>" : "") +
      "<th>Peso</th><th>Cant.</th><th>Altura</th><th>Diám.</th><th>Duración</th></tr></thead><tbody>" +
      rows + "</tbody></table></div></div>";
  }
  function fragList(p) {
    return p.frag ? p.frag.split(/,|·/).map(function (s) { return s.trim(); }).filter(Boolean) : [];
  }
  function hasOptions(p) {
    return (p.sizes && p.sizes.length > 1) || fragList(p).length > 1;
  }
  function optionsBlock(p) {
    var html = "", fl = fragList(p);
    if (p.sizes && p.sizes.length > 1) {
      html += '<div class="modal__block"><h4>Elegí el tamaño</h4><div class="opt-list" data-size-opts>' +
        p.sizes.map(function (s) { return '<button type="button" class="opt" data-size="' + esc(s.n) + '">' + esc(s.n) + '</button>'; }).join("") +
        '</div></div>';
    }
    if (fl.length > 1) {
      html += '<div class="modal__block"><h4>Elegí color o fragancia</h4><div class="opt-list" data-frag-opts>' +
        fl.map(function (f) { return '<button type="button" class="opt" data-frag="' + esc(f) + '">' + esc(f) + '</button>'; }).join("") +
        '</div></div>';
    } else if (fl.length === 1) {
      html += '<div class="modal__block"><h4>Variaciones / Fragancias</h4><div class="frag-list"><span>' + esc(fl[0]) + '</span></div></div>';
    }
    return html;
  }
  function openModal(id) {
    var p = byId[id]; if (!p) return;
    var fl = fragList(p);
    var needSize = !!(p.sizes && p.sizes.length > 1);
    var needFrag = fl.length > 1;
    var sel = { size: needSize ? null : "", frag: needFrag ? null : (fl[0] || "") };
    var html =
      '<div class="modal__grid"><div class="modal__media">' + imgTag(p) + '</div>' +
      '<div class="modal__info"><p class="eyebrow">' + esc(catName[p.cat] || "") + (p.sub ? ' · ' + esc(p.sub) : '') + '</p>' +
      '<h2>' + esc(p.name) + '</h2>' +
      optionsBlock(p) + specTable(p) +
      (p.note ? '<p class="note">' + esc(p.note) + '</p>' : '') +
      '<div class="modal__buy">' +
        '<div class="qty"><button data-mq-dec aria-label="Menos">' + ICON.minus + '</button><input data-mq type="text" inputmode="numeric" value="1" aria-label="Cantidad"><button data-mq-inc aria-label="Más">' + ICON.plus + '</button></div>' +
        '<button class="btn btn--gold" data-modal-add>' + ICON.cart + 'Agregar al pedido</button>' +
      '</div>' +
      ((needSize || needFrag) ? '<p class="modal__req" data-req>Elegí ' + (needSize && needFrag ? 'tamaño y color/fragancia' : (needSize ? 'un tamaño' : 'un color o fragancia')) + ' para continuar.</p>' : '') +
      '</div></div>';
    $("[data-modal-content]").innerHTML = html;
    var mo = $("[data-modal]"); mo.classList.add("open"); mo.setAttribute("aria-hidden", "false");
    mo.scrollTop = 0; var md = $(".modal", mo); if (md) md.scrollTop = 0;
    var q = $("[data-mq]"), addBtn = $("[data-modal-add]"), req = $("[data-req]");
    var clamp = function () { var v = parseInt(q.value, 10); q.value = (!v || v < 1) ? 1 : Math.min(v, 999); };
    function refresh() {
      var ok = (!needSize || sel.size) && (!needFrag || sel.frag);
      addBtn.disabled = !ok;
      if (req) req.style.display = ok ? "none" : "block";
    }
    $("[data-mq-dec]").onclick = function () { q.value = Math.max(1, (parseInt(q.value, 10) || 1) - 1); };
    $("[data-mq-inc]").onclick = function () { q.value = Math.min(999, (parseInt(q.value, 10) || 1) + 1); };
    q.onchange = clamp; q.oninput = function () { q.value = q.value.replace(/[^0-9]/g, ""); };
    var sizeWrap = $("[data-size-opts]");
    if (sizeWrap) sizeWrap.onclick = function (e) {
      var b = e.target.closest("[data-size]"); if (!b) return;
      sel.size = b.getAttribute("data-size");
      $$("[data-size]", sizeWrap).forEach(function (x) { x.classList.toggle("active", x === b); });
      refresh();
    };
    var fragWrap = $("[data-frag-opts]");
    if (fragWrap) fragWrap.onclick = function (e) {
      var b = e.target.closest("[data-frag]"); if (!b) return;
      sel.frag = b.getAttribute("data-frag");
      $$("[data-frag]", fragWrap).forEach(function (x) { x.classList.toggle("active", x === b); });
      refresh();
    };
    addBtn.onclick = function () {
      if (addBtn.disabled) return;
      clamp();
      Cart.add(p.id, parseInt(q.value, 10) || 1, sel.size || "", sel.frag || "");
      closeModal(); toast("Agregado: " + p.name); openCart();
    };
    refresh();
  }
  function closeModal() { var m = $("[data-modal]"); if (m) { m.classList.remove("open"); m.setAttribute("aria-hidden", "true"); } }

  /* ---------- card html ---------- */
  function cardHtml(p) {
    return '<article class="card" data-card="' + p.id + '">' +
      '<div class="card__media" data-open="' + p.id + '"><span class="card__sub">' + esc(p.sub || catName[p.cat]) + '</span>' + imgTag(p) + '</div>' +
      '<div class="card__body"><h3 class="card__name">' + esc(p.name) + '</h3>' +
      '<p class="card__frag">' + esc(p.frag || "") + '</p>' +
      '<div class="card__foot"><button class="btn btn--gold" data-add="' + p.id + '">' + ICON.cart + 'Agregar</button>' +
      '<button class="card__view" data-open="' + p.id + '" aria-label="Ver detalle de ' + esc(p.name) + '">' + ICON.eye + '</button></div>' +
      '</div></article>';
  }

  /* ---------- home featured ---------- */
  function initFeatured() {
    var host = $("[data-featured]"); if (!host) return;
    var feat = D.products.filter(function (p) { return p.feat; }).slice(0, 8);
    host.innerHTML = feat.map(cardHtml).join("");
  }
  function initCtaCarousel() {
    var track = $("[data-cta-carousel]"), scroller = $("[data-cta-scroll]");
    if (!track || !scroller) return;
    var feat = D.products.filter(function (p) { return p.feat; });
    if (feat.length < 4) feat = D.products.slice(0, 8);
    feat = feat.slice(0, 8);
    var cards = feat.map(cardHtml).join("");
    track.innerHTML = cards + cards; // duplicado para loop continuo
    // respeta "reducir movimiento"
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // se mueve siempre, sin pausar (ni hover ni touch)
    function tick() {
      scroller.scrollLeft += 0.7;
      var half = scroller.scrollWidth / 2;
      if (half > 0 && scroller.scrollLeft >= half) scroller.scrollLeft -= half;
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  function initCategoryCards() {
    var host = $("[data-cat-cards]"); if (!host) return;
    host.innerHTML = D.categories.map(function (c) {
      return '<a class="cat-card" href="catalogo.html?cat=' + c.slug + '">' +
        '<picture><source srcset="assets/img/hero/' + c.slug + '.webp" type="image/webp"><img src="assets/img/hero/' + c.slug + '.jpg" alt="Velas ' + esc(c.name) + '" loading="lazy"></picture>' +
        '<div class="cat-card__label"><span>Categoría</span><h3>' + esc(c.name) + '</h3></div></a>';
    }).join("");
  }

  /* ---------- catalog page ---------- */
  var state = { cat: "", sub: "", q: "" };
  function initCatalog() {
    var host = $("[data-catalog]"); if (!host) return;
    var params = new URLSearchParams(location.search);
    state.cat = params.get("cat") || "";
    state.q = params.get("q") || "";
    buildChips();
    var input = $("[data-search]");
    if (input) {
      input.value = state.q;
      input.addEventListener("input", function () { state.q = input.value.trim(); render(); });
    }
    render();
  }
  function buildChips() {
    var chips = $("[data-chips]"); if (!chips) return;
    var all = '<button class="chip' + (!state.cat ? ' active' : '') + '" data-cat="">Todos</button>';
    chips.innerHTML = all + D.categories.map(function (c) {
      return '<button class="chip' + (state.cat === c.slug ? ' active' : '') + '" data-cat="' + c.slug + '">' + esc(c.name) + '</button>';
    }).join("");
    chips.addEventListener("click", function (e) {
      var b = e.target.closest("[data-cat]"); if (!b) return;
      state.cat = b.getAttribute("data-cat"); state.sub = "";
      $$("[data-cat]", chips).forEach(function (x) { x.classList.toggle("active", x === b); });
      syncURL(); buildSubchips(); render();
    });
    buildSubchips();
  }
  function buildSubchips() {
    var host = $("[data-subchips]"); if (!host) return;
    if (!state.cat) { host.innerHTML = ""; return; }
    var subs = []; D.products.forEach(function (p) {
      if (p.cat === state.cat && p.sub && subs.indexOf(p.sub) < 0) subs.push(p.sub);
    });
    if (subs.length < 2) { host.innerHTML = ""; return; }
    host.innerHTML = '<button class="subchip' + (!state.sub ? ' active' : '') + '" data-sub="">Todas</button>' +
      subs.map(function (s) { return '<button class="subchip' + (state.sub === s ? ' active' : '') + '" data-sub="' + esc(s) + '">' + esc(s) + '</button>'; }).join("");
    host.onclick = function (e) {
      var b = e.target.closest("[data-sub]"); if (!b) return;
      state.sub = b.getAttribute("data-sub");
      $$("[data-sub]", host).forEach(function (x) { x.classList.toggle("active", x === b); });
      render();
    };
  }
  function syncURL() {
    var u = new URL(location.href);
    if (state.cat) u.searchParams.set("cat", state.cat); else u.searchParams.delete("cat");
    if (state.q) u.searchParams.set("q", state.q); else u.searchParams.delete("q");
    history.replaceState(null, "", u);
  }
  function render() {
    var host = $("[data-catalog]"); if (!host) return;
    syncURL();
    var q = state.q.toLowerCase();
    var list = D.products.filter(function (p) {
      if (state.cat && p.cat !== state.cat) return false;
      if (state.sub && p.sub !== state.sub) return false;
      if (q) {
        var hay = (p.name + " " + (p.frag || "") + " " + (p.sub || "") + " " + (catName[p.cat] || "")).toLowerCase();
        if (hay.indexOf(q) < 0) return false;
      }
      return true;
    });
    var title = $("[data-cat-title]"), count = $("[data-count]");
    if (title) title.textContent = state.cat ? (catName[state.cat] || "Catálogo") : "Todo el catálogo";
    if (count) count.textContent = list.length + (list.length === 1 ? " producto" : " productos");
    host.innerHTML = list.length ? list.map(cardHtml).join("")
      : '<div class="empty"><p>No encontramos productos con esa búsqueda.</p></div>';
  }

  /* ---------- global click delegation ---------- */
  function initDelegation() {
    document.addEventListener("click", function (e) {
      if (e.target.closest("[data-nav-toggle]")) { toggleNav(); return; }
      var open = e.target.closest("[data-open]");
      if (open) { openModal(open.getAttribute("data-open")); return; }
      var add = e.target.closest("[data-add]");
      if (add) {
        var aid = add.getAttribute("data-add"), ap = byId[aid];
        if (ap && hasOptions(ap)) { openModal(aid); return; }   // pedir tamaño/color antes
        var afl = ap ? fragList(ap) : [];
        Cart.add(aid, 1, "", afl.length ? afl[0] : "");
        toast("Agregado: " + (ap ? ap.name : "")); return;
      }
      var inc = e.target.closest("[data-inc]");
      if (inc) { var k = inc.closest("[data-row]").getAttribute("data-row"); var it = Cart.byKey(k); Cart.setQty(k, (it ? it.qty : 0) + 1); return; }
      var dec = e.target.closest("[data-dec]");
      if (dec) { var k2 = dec.closest("[data-row]").getAttribute("data-row"); var it2 = Cart.byKey(k2); Cart.setQty(k2, (it2 ? it2.qty : 1) - 1); return; }
      var rm = e.target.closest("[data-remove]");
      if (rm) { Cart.remove(rm.closest("[data-row]").getAttribute("data-row")); return; }
      if (e.target.closest("[data-cart-open]")) { e.preventDefault(); openCart(); return; }
      if (e.target.closest("[data-cart-close]") || e.target.closest("[data-modal-close]")) { closeAll(); closeModal(); return; }
      if (e.target.closest("[data-scrim]")) { closeAll(); return; }
      if (e.target.matches("[data-modal]")) { closeModal(); return; }
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") { closeAll(); closeModal(); } });
  }

  /* ---------- boot ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    injectShared();
    initHeroVideo();
    initHeader();
    initDelegation();
    initFeatured();
    initCtaCarousel();
    initCategoryCards();
    initCatalog();
    Cart.onChange(function () { renderBadge(); if ($("[data-drawer]").classList.contains("open")) renderCart(); });
    renderBadge();
  });
})();
