/* ============================================================
   RILAPE — carrito de pedido (persistente en localStorage)
   Cada línea distingue id + tamaño + color/fragancia.
   ============================================================ */
(function () {
  "use strict";
  var KEY = "rilape_cart_v2";
  var listeners = [];

  function read() {
    try {
      var raw = localStorage.getItem(KEY);
      var arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr.filter(function (i) { return i && i.id; }) : [];
    } catch (e) { return []; }
  }
  function write(items) {
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch (e) {}
    listeners.forEach(function (fn) { try { fn(items); } catch (e) {} });
  }
  function keyOf(it) {
    return it.id + "§" + (it.size || "") + "§" + (it.frag || "");
  }

  var Cart = {
    keyOf: keyOf,
    items: function () { return read(); },
    count: function () {
      return read().reduce(function (n, i) { return n + (i.qty || 0); }, 0);
    },
    byKey: function (key) {
      return read().filter(function (i) { return keyOf(i) === key; })[0] || null;
    },
    add: function (id, qty, size, frag) {
      qty = Math.max(1, qty || 1);
      size = size || ""; frag = frag || "";
      var items = read();
      var row = items.filter(function (i) {
        return i.id === id && (i.size || "") === size && (i.frag || "") === frag;
      })[0];
      if (row) { row.qty = Math.min(999, row.qty + qty); }
      else { items.push({ id: id, qty: qty, size: size, frag: frag }); }
      write(items);
    },
    setQty: function (key, qty) {
      var items = read();
      if (qty <= 0) { items = items.filter(function (i) { return keyOf(i) !== key; }); }
      else {
        var row = items.filter(function (i) { return keyOf(i) === key; })[0];
        if (row) row.qty = Math.min(999, qty);
      }
      write(items);
    },
    remove: function (key) {
      write(read().filter(function (i) { return keyOf(i) !== key; }));
    },
    clear: function () { write([]); },
    onChange: function (fn) { listeners.push(fn); return fn; }
  };

  window.addEventListener("storage", function (e) {
    if (e.key === KEY) listeners.forEach(function (fn) { try { fn(read()); } catch (err) {} });
  });

  window.RilapeCart = Cart;
})();
