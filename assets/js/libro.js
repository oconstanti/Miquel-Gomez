/* ─────────────────────────────────────────────
   El traductor literario · Miquel Gómez Besòs
   Lector horizontal: capítulos de izquierda a derecha,
   páginas compuestas con columnas
   ───────────────────────────────────────────── */

(function () {
  "use strict";

  var quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var escenario = document.getElementById("escenario");
  var libro     = document.getElementById("libro");
  var hojas     = Array.prototype.slice.call(document.querySelectorAll(".hoja"));
  var rotulo    = document.getElementById("rotuloActual");
  var folio     = document.getElementById("folio");
  var cinta     = document.getElementById("cinta");
  var atras     = document.getElementById("paginaAnterior");
  var adelante  = document.getElementById("paginaSiguiente");

  var SALTO = 40;          // separación entre páginas de un mismo capítulo, en px
  var paginas = [];        // [{ hoja: índice, pagina: nº dentro del capítulo }]
  var actual = 0;          // posición dentro de paginas[]
  var anchoEscenario = 0;

  /* ── Medir y repaginar ──────────────────────────────────────── */

  function medir() {
    anchoEscenario = escenario.clientWidth;
    var antes = paginas[actual] || { hoja: 0, pagina: 0 };
    paginas = [];

    hojas.forEach(function (hoja, i) {
      var flujo = hoja.querySelector(".flujo");
      var total = 1;

      if (flujo) {
        var ventana = flujo.parentNode;
        var ancho = ventana.clientWidth;
        var alto = ventana.clientHeight;

        flujo.style.width = ancho + "px";
        flujo.style.height = alto + "px";
        flujo.style.columnWidth = ancho + "px";
        flujo.style.columnGap = SALTO + "px";

        var extension = Math.max(flujo.scrollWidth, ancho);
        total = Math.max(1, Math.round((extension + SALTO) / (ancho + SALTO)));
        hoja.dataset.paso = ancho + SALTO;
      }

      hoja.dataset.paginas = total;
      for (var p = 0; p < total; p++) paginas.push({ hoja: i, pagina: p });
    });

    // Recuperar, en lo posible, el sitio donde estábamos
    var recuperado = paginas.findIndex(function (pg) {
      return pg.hoja === antes.hoja && pg.pagina === antes.pagina;
    });
    if (recuperado < 0) {
      recuperado = paginas.findIndex(function (pg) { return pg.hoja === antes.hoja; });
    }
    actual = recuperado < 0 ? 0 : recuperado;

    pintar(true);
  }

  /* ── Pintar la posición actual ──────────────────────────────── */

  function pintar(sinTransicion) {
    var punto = paginas[actual];
    if (!punto) return;

    if (sinTransicion) libro.style.transition = "none";
    libro.style.transform = "translateX(" + (-punto.hoja * anchoEscenario) + "px)";
    if (sinTransicion) {
      void libro.offsetWidth;
      libro.style.transition = "";
    }

    hojas.forEach(function (hoja, i) {
      var flujo = hoja.querySelector(".flujo");
      var lienzo = hoja.querySelector(".hoja__lienzo");
      var pagina = i === punto.hoja ? punto.pagina : leerPagina(i);
      if (flujo) {
        var paso = parseFloat(hoja.dataset.paso || 0);
        flujo.style.transform = "translateX(" + (-pagina * paso) + "px)";
      }
      if (lienzo && !quieto) {
        lienzo.style.transform = "translateX(" + (-pagina * 14) + "px)";
      }
      hoja.setAttribute("aria-hidden", i === punto.hoja ? "false" : "true");
    });

    guardarPagina(punto.hoja, punto.pagina);

    rotulo.textContent = hojas[punto.hoja].getAttribute("data-rotulo");
    folio.textContent = (actual + 1) + " / " + paginas.length;
    cinta.style.width = (paginas.length > 1 ? (actual / (paginas.length - 1)) * 100 : 100) + "%";

    atras.disabled = actual === 0;
    adelante.disabled = actual === paginas.length - 1;
  }

  var memoria = {};
  function guardarPagina(hoja, pagina) { memoria[hoja] = pagina; }
  function leerPagina(hoja) { return memoria[hoja] || 0; }

  /* ── Movimiento ─────────────────────────────────────────────── */

  function irA(indice) {
    var destino = Math.max(0, Math.min(paginas.length - 1, indice));
    if (destino === actual) return;
    actual = destino;
    pintar(false);
  }

  function pasar(sentido) { irA(actual + sentido); }

  function irACapitulo(id) {
    var i = hojas.findIndex(function (h) { return h.id === id; });
    if (i < 0) return;
    memoria[i] = 0;
    var destino = paginas.findIndex(function (pg) { return pg.hoja === i; });
    if (destino >= 0) irA(destino);
  }

  atras.addEventListener("click", function () { pasar(-1); });
  adelante.addEventListener("click", function () { pasar(1); });

  document.addEventListener("keydown", function (e) {
    if (!velo.hidden) return;
    if (e.key === "ArrowRight" || e.key === "PageDown" || (e.key === " " && !e.shiftKey)) {
      e.preventDefault(); pasar(1);
    } else if (e.key === "ArrowLeft" || e.key === "PageUp" || (e.key === " " && e.shiftKey)) {
      e.preventDefault(); pasar(-1);
    } else if (e.key === "Home") {
      e.preventDefault(); irA(0);
    } else if (e.key === "End") {
      e.preventDefault(); irA(paginas.length - 1);
    }
  });

  /* Rueda del ratón y trackpad */
  var acumulado = 0, ultimoPaso = 0;
  escenario.addEventListener("wheel", function (e) {
    var ahora = Date.now();
    if (ahora - ultimoPaso < 620) return;
    acumulado += Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (Math.abs(acumulado) > 55) {
      pasar(acumulado > 0 ? 1 : -1);
      acumulado = 0;
      ultimoPaso = ahora;
    }
  }, { passive: true });

  /* Deslizar con el dedo */
  var inicioX = null, inicioY = null;
  escenario.addEventListener("pointerdown", function (e) {
    if (e.pointerType === "mouse") return;
    inicioX = e.clientX; inicioY = e.clientY;
  });
  escenario.addEventListener("pointerup", function (e) {
    if (inicioX === null) return;
    var dx = e.clientX - inicioX;
    var dy = e.clientY - inicioY;
    inicioX = null;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) pasar(dx < 0 ? 1 : -1);
  });

  /* Botones internos que llevan a un capítulo */
  Array.prototype.forEach.call(document.querySelectorAll("[data-ir]"), function (boton) {
    boton.addEventListener("click", function () { irACapitulo(boton.getAttribute("data-ir")); });
  });

  /* El foco del teclado no debe arrastrar el escenario */
  escenario.addEventListener("scroll", function () {
    escenario.scrollLeft = 0;
    escenario.scrollTop = 0;
  });

  /* ── Índice ─────────────────────────────────────────────────── */

  var velo    = document.getElementById("indiceVelo");
  var abrir   = document.getElementById("abrirIndice");
  var cerrar  = document.getElementById("cerrarIndice");
  var dialogo = document.getElementById("indiceDialogo");

  function abrirIndice() {
    velo.hidden = false;
    abrir.setAttribute("aria-expanded", "true");
    var primero = dialogo.querySelector("a");
    if (primero) primero.focus();
  }
  function cerrarIndice(devolverFoco) {
    velo.hidden = true;
    abrir.setAttribute("aria-expanded", "false");
    if (devolverFoco) abrir.focus();
  }

  abrir.addEventListener("click", abrirIndice);
  cerrar.addEventListener("click", function () { cerrarIndice(true); });
  velo.addEventListener("click", function (e) { if (e.target === velo) cerrarIndice(true); });

  dialogo.addEventListener("click", function (e) {
    var enlace = e.target.closest("a");
    if (!enlace) return;
    e.preventDefault();
    cerrarIndice(false);
    irACapitulo(enlace.getAttribute("href").slice(1));
  });

  document.addEventListener("keydown", function (e) {
    if (velo.hidden) return;
    if (e.key === "Escape") cerrarIndice(true);
    if (e.key === "Tab") {
      var focoables = dialogo.querySelectorAll("a, button");
      var primero = focoables[0];
      var ultimo = focoables[focoables.length - 1];
      if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
      else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
    }
  });

  /* ── Imágenes ───────────────────────────────────────────────── */

  /* Fondos: si existe assets/img/fondos/<nombre>.jpg, sustituye al provisional */
  hojas.forEach(function (hoja) {
    var nombre = hoja.getAttribute("data-fondo");
    if (!nombre) return;
    var lienzo = hoja.querySelector(".hoja__lienzo");
    var ruta = "assets/img/fondos/" + nombre + ".jpg";
    var prueba = new Image();
    prueba.onload = function () {
      lienzo.style.backgroundImage = "url('" + ruta + "')";
      hoja.classList.add("hoja--con-fondo");
    };
    prueba.src = ruta;
  });

  /* Retrato, portada y demás imágenes opcionales */
  Array.prototype.forEach.call(document.querySelectorAll("[data-preferida]"), function (img) {
    var ruta = img.getAttribute("data-preferida");
    var prueba = new Image();
    prueba.onload = function () {
      img.src = ruta;
      var figura = img.closest("figure");
      if (figura && figura.hidden) { figura.hidden = false; medir(); }
    };
    prueba.src = ruta;
  });

  /* Cubiertas que todavía no existen: se ve la suplente compuesta con letras */
  Array.prototype.forEach.call(document.querySelectorAll(".libro-ficha__portada img"), function (img) {
    function fallar() { img.hidden = true; }
    img.addEventListener("error", fallar);
    if (img.complete && img.naturalWidth === 0) fallar();
  });

  /* ── Correo ─────────────────────────────────────────────────── */

  var usuario = "durkapulo";
  var dominio = "gmail.com";
  var enlace = document.getElementById("correo");
  if (enlace) {
    enlace.href = "mailto:" + usuario + "@" + dominio;
    enlace.textContent = usuario + "@" + dominio;
  }

  /* ── Arranque ───────────────────────────────────────────────── */

  medir();

  if (document.fonts && document.fonts.ready) document.fonts.ready.then(medir);
  window.addEventListener("load", medir);

  var esperando;
  window.addEventListener("resize", function () {
    clearTimeout(esperando);
    esperando = setTimeout(medir, 180);
  });

  if (location.hash) irACapitulo(location.hash.slice(1));
})();
