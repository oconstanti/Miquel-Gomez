/* ─────────────────────────────────────────────
   El traductor literario · Miquel Gómez Besòs
   Lector horizontal: los capítulos y las páginas
   se pasan girando, como las hojas de un libro
   ───────────────────────────────────────────── */

(function () {
  "use strict";

  var quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var GIRO_CAPITULO = quieto ? 1 : 900;   // ms
  var GIRO_PAGINA   = quieto ? 1 : 720;   // ms
  var SALTO = 40;                          // separación entre páginas, en px

  var escenario = document.getElementById("escenario");
  var rotulo    = document.getElementById("rotuloActual");
  var folio     = document.getElementById("folio");
  var cinta     = document.getElementById("cinta");
  var atras     = document.getElementById("paginaAnterior");
  var adelante  = document.getElementById("paginaSiguiente");

  var hojas   = Array.prototype.slice.call(document.querySelectorAll(".hoja"));
  var pliegos = [];      // un objeto por capítulo
  var paginas = [];      // [{ hoja, pagina }] de todo el libro
  var actual  = 0;
  var giro    = null;    // giro en curso

  /* ── Preparar cada capítulo ─────────────────────────────────── */

  var EASE = "cubic-bezier(.42,.02,.22,1)";

  hojas.forEach(function (hoja, i) {
    /* Tot el contingut passa a dins d'una cara: és ella qui retalla, perquè
       si retallés el full es perdria el 3D. */
    var cara = document.createElement("div");
    cara.className = "hoja__cara hoja__cara--frente";
    while (hoja.firstChild) cara.appendChild(hoja.firstChild);
    hoja.appendChild(cara);

    var sombra = document.createElement("div");
    sombra.className = "hoja__sombra";
    sombra.setAttribute("aria-hidden", "true");
    cara.appendChild(sombra);

    var pliego = {
      hoja: hoja,
      cara: cara,
      sombra: sombra,
      flujo: cara.querySelector(".flujo"),
      caraFondo: null,
      sombraFondo: null,
      flujoFondo: null,
      paso: 0,
      total: 1
    };

    /* Els capítols amb text porten una segona cara a sota, amb la mateixa
       fotografia i la pàgina següent: així el full que gira és opac i no
       es veuen els dos textos alhora. */
    if (pliego.flujo) {
      var fondo = cara.cloneNode(true);
      fondo.className = "hoja__cara hoja__cara--fondo";
      fondo.setAttribute("aria-hidden", "true");
      hoja.insertBefore(fondo, cara);
      pliego.caraFondo = fondo;
      pliego.sombraFondo = fondo.querySelector(".hoja__sombra");
      pliego.flujoFondo = fondo.querySelector(".flujo");
    }

    var reverso = document.createElement("div");
    reverso.className = "hoja__reverso";
    reverso.setAttribute("aria-hidden", "true");
    hoja.appendChild(reverso);

    pliegos.push(pliego);
  });

  document.documentElement.style.setProperty("--giro-capitulo", GIRO_CAPITULO + "ms");
  document.documentElement.style.setProperty("--giro-pagina", GIRO_PAGINA + "ms");

  /* ── Medir y repaginar ──────────────────────────────────────── */

  function medir() {
    var antes = paginas[actual] || { hoja: 0, pagina: 0 };
    paginas = [];

    pliegos.forEach(function (pliego, i) {
      if (pliego.flujo) {
        var ventana = pliego.flujo.parentNode;
        var ancho = ventana.clientWidth;
        var alto = ventana.clientHeight;

        [pliego.flujo, pliego.flujoFondo].forEach(function (flujo) {
          if (!flujo) return;
          flujo.style.width = ancho + "px";
          flujo.style.height = alto + "px";
          flujo.style.columnWidth = ancho + "px";
          flujo.style.columnGap = SALTO + "px";
        });

        var extension = Math.max(pliego.flujo.scrollWidth, ancho);
        pliego.paso = ancho + SALTO;
        pliego.total = Math.max(1, Math.round((extension + SALTO) / pliego.paso));
      }

      pliego.hoja.dataset.paginas = pliego.total;
      for (var p = 0; p < pliego.total; p++) paginas.push({ hoja: i, pagina: p });
    });

    var recuperado = buscarPagina(antes.hoja, antes.pagina);
    if (recuperado < 0) recuperado = buscarPagina(antes.hoja, 0);
    actual = recuperado < 0 ? 0 : recuperado;

    asentar();
  }

  function buscarPagina(hoja, pagina) {
    for (var i = 0; i < paginas.length; i++) {
      if (paginas[i].hoja === hoja && (pagina === undefined || paginas[i].pagina === pagina)) return i;
    }
    return -1;
  }

  /* Col·loca una cara en la pàgina que li toca */
  function colocar(pliego, flujo, pagina) {
    if (!flujo) return;
    flujo.style.transform = "translateX(" + (-Math.max(0, pagina) * pliego.paso) + "px)";
  }

  function animar(el, ms, valor) {
    el.style.transition = "transform " + ms + "ms " + EASE;
    el.style.transform = valor;
  }

  function fijar(el, valor) {
    el.style.transition = "none";
    el.style.transform = valor;
  }

  function oscurecer(sombra, ms, valor) {
    if (!sombra) return;
    sombra.style.transition = "opacity " + ms + "ms ease-in";
    sombra.style.opacity = valor;
  }

  /* L'ombra que el full deixa caure sobre la pàgina de sota en passar */
  function barrer(sombra, ms) {
    if (!sombra) return;
    sombra.style.transition = "none";
    sombra.style.opacity = ".85";
    void sombra.offsetWidth;
    sombra.style.transition = "opacity " + ms + "ms ease-out";
    sombra.style.opacity = "0";
  }

  function despejar(el) {
    if (!el) return;
    el.style.transition = "none";
    el.style.transform = "";
    el.style.opacity = "";
    el.classList.remove("hoja__cara--girando");
  }

  /* Deixa el llibre quiet a la posició actual, sense animació */
  function asentar() {
    var punto = paginas[actual];
    if (!punto) return;

    hojas.forEach(function (hoja, i) {
      var visible = i === punto.hoja;
      hoja.classList.toggle("hoja--presente", visible);
      hoja.classList.remove("hoja--girando");
      hoja.style.transition = "none";
      hoja.style.transform = "";
      hoja.setAttribute("aria-hidden", visible ? "false" : "true");
      despejar(pliegos[i].cara);
      despejar(pliegos[i].caraFondo);
      if (pliegos[i].sombra) { pliegos[i].sombra.style.transition = "none"; pliegos[i].sombra.style.opacity = ""; }
      if (pliegos[i].sombraFondo) { pliegos[i].sombraFondo.style.transition = "none"; pliegos[i].sombraFondo.style.opacity = ""; }
    });

    var pliego = pliegos[punto.hoja];
    colocar(pliego, pliego.flujo, punto.pagina);
    colocar(pliego, pliego.flujoFondo, punto.pagina + 1);

    cromo();
  }

  function cromo() {
    var punto = paginas[actual];
    if (!punto) return;
    rotulo.textContent = hojas[punto.hoja].getAttribute("data-rotulo");
    folio.textContent = (actual + 1) + " / " + paginas.length;
    cinta.style.width = (paginas.length > 1 ? (actual / (paginas.length - 1)) * 100 : 100) + "%";
    atras.disabled = actual === 0;
    adelante.disabled = actual === paginas.length - 1;
  }

  /* ── Pasar página ───────────────────────────────────────────── */

  function irA(indice) {
    var destino = Math.max(0, Math.min(paginas.length - 1, indice));
    if (destino === actual) return;

    if (giro) rematar();

    var desde = paginas[actual];
    var hasta = paginas[destino];
    var sentido = destino > actual ? 1 : -1;
    actual = destino;

    if (desde.hoja === hasta.hoja) girarPagina(desde, hasta, sentido);
    else girarCapitulo(desde, hasta, sentido);

    cromo();
  }

  function pasar(sentido) { irA(actual + sentido); }

  /* Un empujón para que el navegador tome la posición de salida
     antes de empezar a animar */
  function reflujo(el) { void el.offsetWidth; }

  function programar(fin, duracion) {
    giro = { fin: fin, temporizador: setTimeout(function () { giro = null; fin(); }, duracion + 40) };
  }

  function rematar() {
    if (!giro) return;
    clearTimeout(giro.temporizador);
    var fin = giro.fin;
    giro = null;
    fin();
  }

  /* Passar pàgina dins d'un capítol: la cara de dalt gira i se'n va sencera,
     amb la fotografia, i a sota ja hi ha la pàgina següent */
  function girarPagina(desde, hasta, sentido) {
    var pliego = pliegos[desde.hoja];

    if (!pliego.flujo || !pliego.caraFondo || quieto) {
      colocar(pliego, pliego.flujo, hasta.pagina);
      colocar(pliego, pliego.flujoFondo, hasta.pagina + 1);
      return;
    }

    pliego.cara.classList.add("hoja__cara--girando");

    if (sentido > 0) {
      colocar(pliego, pliego.flujoFondo, hasta.pagina);
      colocar(pliego, pliego.flujo, desde.pagina);
      fijar(pliego.cara, "");
      void pliego.cara.offsetWidth;
      animar(pliego.cara, GIRO_PAGINA, "rotateY(-118deg)");
      oscurecer(pliego.sombra, GIRO_PAGINA, "1");
      barrer(pliego.sombraFondo, GIRO_PAGINA);
    } else {
      colocar(pliego, pliego.flujoFondo, desde.pagina);
      colocar(pliego, pliego.flujo, hasta.pagina);
      fijar(pliego.cara, "rotateY(-118deg)");
      pliego.sombra.style.transition = "none";
      pliego.sombra.style.opacity = "1";
      void pliego.cara.offsetWidth;
      animar(pliego.cara, GIRO_PAGINA, "");
      oscurecer(pliego.sombra, GIRO_PAGINA, "0");
    }

    programar(function () {
      despejar(pliego.cara);
      pliego.sombra.style.transition = "none";
      pliego.sombra.style.opacity = "";
      colocar(pliego, pliego.flujo, hasta.pagina);
      colocar(pliego, pliego.flujoFondo, hasta.pagina + 1);
    }, GIRO_PAGINA);
  }

  /* Canviar de capítol: gira el full sencer, amb la seva fotografia */
  function girarCapitulo(desde, hasta, sentido) {
    var viejo = pliegos[desde.hoja];
    var nuevo = pliegos[hasta.hoja];

    despejar(nuevo.cara);
    despejar(nuevo.caraFondo);
    colocar(nuevo, nuevo.flujo, hasta.pagina);
    colocar(nuevo, nuevo.flujoFondo, hasta.pagina + 1);
    nuevo.hoja.classList.add("hoja--presente");
    nuevo.hoja.setAttribute("aria-hidden", "false");
    viejo.hoja.setAttribute("aria-hidden", "true");

    if (quieto) { asentar(); return; }

    var girada = sentido > 0 ? viejo : nuevo;
    girada.hoja.classList.add("hoja--girando");

    if (sentido > 0) {
      fijar(girada.hoja, "");
      void girada.hoja.offsetWidth;
      animar(girada.hoja, GIRO_CAPITULO, "rotateY(-125deg)");
      oscurecer(girada.sombra, GIRO_CAPITULO, "1");
    } else {
      fijar(girada.hoja, "rotateY(-125deg)");
      girada.sombra.style.transition = "none";
      girada.sombra.style.opacity = "1";
      void girada.hoja.offsetWidth;
      animar(girada.hoja, GIRO_CAPITULO, "");
      oscurecer(girada.sombra, GIRO_CAPITULO, "0");
    }

    programar(function () { asentar(); }, GIRO_CAPITULO);
  }

  function irACapitulo(id) {
    for (var i = 0; i < hojas.length; i++) {
      if (hojas[i].id === id) {
        var destino = buscarPagina(i);
        if (destino >= 0) irA(destino);
        return;
      }
    }
  }

  /* ── Mandos ─────────────────────────────────────────────────── */

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

  var acumulado = 0, ultimoPaso = 0;
  escenario.addEventListener("wheel", function (e) {
    var ahora = Date.now();
    if (ahora - ultimoPaso < GIRO_PAGINA + 120) return;
    acumulado += Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (Math.abs(acumulado) > 55) {
      pasar(acumulado > 0 ? 1 : -1);
      acumulado = 0;
      ultimoPaso = ahora;
    }
  }, { passive: true });

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

  Array.prototype.forEach.call(document.querySelectorAll("[data-ir]"), function (boton) {
    boton.addEventListener("click", function () { irACapitulo(boton.getAttribute("data-ir")); });
  });

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

  var EXTENSIONES = [".jpg", ".jpeg", ".png", ".webp", ".JPG", ".JPEG", ".PNG"];

  /* Busca un archivo probando las extensiones habituales, para que dé igual
     cómo se haya guardado la imagen al subirla. */
  var buscadas = {};

  function buscarImagen(base, alEncontrar) {
    var apunte = buscadas[base];

    if (apunte && apunte.ruta) { alEncontrar(apunte.ruta); return; }
    if (apunte) { apunte.esperando.push(alEncontrar); return; }

    apunte = buscadas[base] = { ruta: null, esperando: [alEncontrar] };

    var i = 0;
    (function intentar() {
      if (i >= EXTENSIONES.length) return;
      var ruta = base + EXTENSIONES[i++];
      var prueba = new Image();
      prueba.onload = function () {
        apunte.ruta = ruta;
        apunte.esperando.forEach(function (aviso) { aviso(ruta); });
        apunte.esperando = [];
      };
      prueba.onerror = intentar;
      prueba.src = ruta;
    })();
  }

  function sinExtension(ruta) { return ruta.replace(/\.[a-z0-9]+$/i, ""); }

  /* Fondos de capítulo */
  hojas.forEach(function (hoja) {
    var nombre = hoja.getAttribute("data-fondo");
    if (!nombre) return;
    /* Les dues cares del full duen la mateixa fotografia */
    var lienzos = hoja.querySelectorAll(".hoja__lienzo");
    buscarImagen("assets/img/fondos/" + nombre, function (ruta) {
      Array.prototype.forEach.call(lienzos, function (lienzo) {
        lienzo.style.backgroundImage = "url('" + ruta + "')";
      });
      hoja.classList.add("hoja--con-fondo");
    });
  });

  /* La cubierta: si existe una cubierta ya terminada se usa tal cual; si no,
     se compone sobre la ilustración con la tipografía de la web. */
  var portada = document.getElementById("portada");
  if (portada) {
    var imagenPortada = portada.querySelector(".portada__imagen");
    buscarImagen("assets/img/portada/portada-libro", function (ruta) {
      imagenPortada.src = ruta;
      portada.classList.add("portada--acabada");
    });
    buscarImagen("assets/img/fondos/portada", function (ruta) {
      if (!portada.classList.contains("portada--acabada")) imagenPortada.src = ruta;
    });
  }

  /* Retrato y demás imágenes opcionales */
  Array.prototype.forEach.call(document.querySelectorAll("[data-preferida]"), function (img) {
    buscarImagen(sinExtension(img.getAttribute("data-preferida")), function (ruta) {
      img.src = ruta;
      var figura = img.closest("figure");
      if (figura && figura.hidden) { figura.hidden = false; medir(); }
    });
  });

  /* Cubiertas de libro que todavía no existen: se ve la suplente compuesta con letras */
  Array.prototype.forEach.call(document.querySelectorAll(".libro-ficha__portada img"), function (img) {
    var base = sinExtension(img.getAttribute("src"));
    function fallar() {
      img.hidden = true;
      buscarImagen(base, function (ruta) { img.src = ruta; img.hidden = false; });
    }
    img.addEventListener("error", fallar, { once: true });
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
    esperando = setTimeout(function () { rematar(); medir(); }, 180);
  });

  if (location.hash) irACapitulo(location.hash.slice(1));
})();
