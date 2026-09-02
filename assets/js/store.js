/* ============================================================
   RILAPE — carrito de pedido (persistente en localStorage)
   ============================================================ */
(function () {
  "use strict";
  var KEY = "rilape_cart_v1";
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

  var Cart = {
    items: function () { return read(); },
    count: function () {
      return read().reduce(function (n, i) { return n + (i.qty || 0); }, 0);
    },
    find: function (id) {
      return read().filter(function (i) { return i.id === id; })[0] || null;
    },
    add: function (id, qty) {
      qty = Math.max(1, qty || 1);
      var items = read();
      var row = items.filter(function (i) { return i.id === id; })[0];
      if (row) { row.qty = Math.min(999, row.qty + qty); }
      else { items.push({ id: id, qty: qty }); }
      write(items);
    },
    setQty: function (id, qty) {
      var items = read();
      if (qty <= 0) { items = items.filter(function (i) { return i.id !== id; }); }
      else {
        var row = items.filter(function (i) { return i.id === id; })[0];
        if (row) row.qty = Math.min(999, qty);
      }
      write(items);
    },
    remove: function (id) {
      write(read().filter(function (i) { return i.id !== id; }));
    },
    clear: function () { write([]); },
    onChange: function (fn) { listeners.push(fn); return fn; }
  };

  // keep tabs/pages in sync
  window.addEventListener("storage", function (e) {
    if (e.key === KEY) listeners.forEach(function (fn) { try { fn(read()); } catch (err) {} });
  });

  window.RilapeCart = Cart;
})();
