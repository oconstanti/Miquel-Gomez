/* ─────────────────────────────────────────────
   El traductor literario · Miquel Gómez Besòs

   Un libro abierto: dos páginas a la vista, el lomo en medio.
   Cada capítulo empieza en la página de la izquierda y sigue
   en la de la derecha. Se pasa página girando la hoja.
   ───────────────────────────────────────────── */

(function () {
  "use strict";

  var quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var GIRO = quieto ? 1 : 1050;      // lo que tarda una hoja en girar, en ms
  var EASE = "cubic-bezier(.38,.03,.2,1)";
  var SALTO = 48;                    // separación entre columnas al paginar
  var ANCHO_LIBRO_ABIERTO = 900;     // por debajo de esto se lee de una en una

  var escenario = document.getElementById("escenario");
  var libro     = document.getElementById("libro");
  var fuente    = document.getElementById("fuente");
  var rotulo    = document.getElementById("rotuloActual");
  var folio     = document.getElementById("folio");
  var cinta     = document.getElementById("cinta");
  var atras     = document.getElementById("paginaAnterior");
  var adelante  = document.getElementById("paginaSiguiente");

  var capitulos = [];
  var pliegos = [];        // cada pliego: { cap, base } — base = primera página del capítulo que muestra
  var actual = 0;
  var giro = null;
  var abierto = true;      // ¿caben dos páginas?

  /* ── Los capítulos, tal como vienen de la fuente ─────────────── */

  Array.prototype.forEach.call(fuente.querySelectorAll(".capitulo"), function (el) {
    capitulos.push({
      id: el.id,
      rotulo: el.getAttribute("data-rotulo"),
      fondo: el.getAttribute("data-fondo"),
      tema: el.getAttribute("data-tema"),
      fondoRuta: null,
      entero: el.classList.contains("capitulo--entero"),
      flujo: el.querySelector(".flujo"),
      cuerpo: el.querySelector(".entero"),
      total: 1,
      escala: 1,
      paso: 0,
      primera: 0
    });
  });

  /* ── Las cuatro capas del libro ──────────────────────────────── */

  function nuevaPagina(clase) {
    var pagina = document.createElement("div");
    pagina.className = "pagina " + clase;

    var lienzo = document.createElement("div");
    lienzo.className = "pagina__lienzo";
    pagina.appendChild(lienzo);

    var velo = document.createElement("div");
    velo.className = "pagina__velo";
    pagina.appendChild(velo);

    var enteros = document.createElement("div");
    enteros.className = "pagina__enteros";
    pagina.appendChild(enteros);

    var ventana = document.createElement("div");
    ventana.className = "pagina__ventana";
    pagina.appendChild(ventana);

    var lomo = document.createElement("div");
    lomo.className = "pagina__lomo";
    pagina.appendChild(lomo);

    var sombra = document.createElement("div");
    sombra.className = "pagina__sombra";
    pagina.appendChild(sombra);

    var numero = document.createElement("span");
    numero.className = "pagina__folio";
    pagina.appendChild(numero);

    /* Una copia del texto de cada capítulo; solo se ve la que toca */
    var copias = [];
    capitulos.forEach(function (cap, i) {
      var origen = cap.entero ? cap.cuerpo : cap.flujo;
      var copia = origen.cloneNode(true);
      copia.removeAttribute("id");
      Array.prototype.forEach.call(copia.querySelectorAll("[id]"), function (n) {
        n.removeAttribute("id");
      });
      copia.hidden = true;
      (cap.entero ? enteros : ventana).appendChild(copia);
      copias.push(copia);
    });

    return {
      el: pagina, lienzo: lienzo, velo: velo, ventana: ventana,
      sombra: sombra, numero: numero, copias: copias, mitad: null, señal: null
    };
  }

  var hueco = {};
  ["izquierda", "derecha"].forEach(function (lado) {
    var h = document.createElement("div");
    h.className = "hueco hueco--" + lado;
    libro.appendChild(h);
    hueco[lado] = h;
  });

  var izquierda = nuevaPagina("");
  var derecha   = nuevaPagina("");
  hueco.izquierda.appendChild(izquierda.el);
  hueco.derecha.appendChild(derecha.el);

  var hoja = document.createElement("div");
  hoja.className = "hoja";
  libro.appendChild(hoja);

  var cara  = nuevaPagina("pagina--cara");
  var dorso = nuevaPagina("pagina--dorso");
  hoja.appendChild(cara.el);
  hoja.appendChild(dorso.el);

  var capas = [izquierda, derecha, cara, dorso];

  fuente.hidden = true;

  /* ── Paginación ─────────────────────────────────────────────── */

  var ESCALAS = [1, .98, .96, .94, .92, .90, .88];
  var PAGINA_MINIMA = .45;

  function tantear(cap, copia, ancho, alto, escala) {
    copia.style.fontSize = escala === 1 ? "" : escala + "em";
    copia.style.width = ancho + "px";
    copia.style.height = alto + "px";
    copia.style.columnWidth = ancho + "px";
    copia.style.columnGap = SALTO + "px";

    var paso = ancho + SALTO;
    var extension = Math.max(copia.scrollWidth, ancho);
    var total = Math.max(1, Math.round((extension + SALTO) / paso));

    var llenado = 1;
    var ultimo = copia.lastElementChild;
    if (ultimo && alto > 0) {
      var fin = ultimo.getBoundingClientRect().bottom - copia.getBoundingClientRect().top;
      llenado = Math.min(1, Math.max(0, fin / alto));
    }
    return { escala: escala, total: total, paso: paso, llenado: llenado };
  }

  /* Mide un capítulo sobre una de las copias y, si en la última página solo
     quedaran un par de líneas, estrecha un poco el texto para recogerlas. */
  function componer(cap, indice) {
    if (cap.entero) {
      cap.total = abierto ? 2 : 1;
      cap.paso = 0;
      return;
    }

    var copia = cara.copias[indice];
    var estabaOculta = copia.hidden;
    copia.hidden = false;

    var ancho = cara.ventana.clientWidth;
    var alto = cara.ventana.clientHeight;

    var elegido = tantear(cap, copia, ancho, alto, 1);
    if (elegido.total > 1 && elegido.llenado < PAGINA_MINIMA) {
      for (var i = 1; i < ESCALAS.length; i++) {
        var prueba = tantear(cap, copia, ancho, alto, ESCALAS[i]);
        if (prueba.total < elegido.total) { elegido = prueba; break; }
      }
      if (elegido.escala === 1) tantear(cap, copia, ancho, alto, 1);
    }

    cap.escala = elegido.escala;
    cap.paso = elegido.paso;
    cap.total = elegido.total;
    copia.hidden = estabaOculta;

    /* La misma medida, a las cuatro capas */
    capas.forEach(function (capa) {
      var otra = capa.copias[indice];
      otra.style.fontSize = cap.escala === 1 ? "" : cap.escala + "em";
      otra.style.width = ancho + "px";
      otra.style.height = alto + "px";
      otra.style.columnWidth = ancho + "px";
      otra.style.columnGap = SALTO + "px";
    });
  }

  function medir() {
    var anterior = pliegos[actual];
    abierto = escenario.clientWidth >= ANCHO_LIBRO_ABIERTO;
    libro.classList.toggle("libro--abierto", abierto);
    libro.classList.toggle("libro--sencillo", !abierto);

    var porPliego = abierto ? 2 : 1;
    var numero = 1;

    capitulos.forEach(function (cap, i) {
      componer(cap, i);
      cap.primera = numero;
      numero += Math.ceil(cap.total / porPliego) * porPliego;
    });

    pliegos = [];
    capitulos.forEach(function (cap, i) {
      var cuantos = Math.ceil(cap.total / porPliego);
      for (var s = 0; s < cuantos; s++) pliegos.push({ cap: i, base: s * porPliego });
    });

    if (anterior) {
      var vuelta = -1;
      for (var k = 0; k < pliegos.length; k++) {
        if (pliegos[k].cap === anterior.cap) { vuelta = k; break; }
      }
      actual = vuelta < 0 ? 0 : vuelta;
    }
    actual = Math.max(0, Math.min(pliegos.length - 1, actual));

    asentar(actual, true);
  }

  /* ── Qué página va en cada sitio ─────────────────────────────── */

  function pagina(k, lado) {
    if (k < 0 || k >= pliegos.length) return null;   // fuera del libro
    var pl = pliegos[k];
    var p = pl.base + lado;
    /* Una página en blanco del capítulo: sigue enseñando su fotografía, como
       la lámina que acompaña al texto en la página de al lado. */
    if (p >= capitulos[pl.cap].total) return { cap: pl.cap, pag: null };
    return { cap: pl.cap, pag: p };
  }

  function pintar(capa, ref, mitad) {
    var el = capa.el;
    el.classList.toggle("pagina--mitad-izquierda", mitad === "izquierda");
    el.classList.toggle("pagina--mitad-derecha", mitad === "derecha");
    capa.mitad = mitad;

    var vacia = !ref || ref.pag === null;
    el.classList.toggle("pagina--vacia", vacia);
    el.classList.toggle("pagina--fuera", !ref);

    if (!ref) {
      capa.copias.forEach(function (c) { c.hidden = true; });
      el.classList.remove("pagina--papel");
      el.removeAttribute("data-fondo");
      capa.lienzo.style.backgroundImage = "";
      capa.numero.textContent = "";
      return;
    }

    var cap = capitulos[ref.cap];
    el.classList.toggle("pagina--papel", cap.tema === "papel");
    el.setAttribute("data-fondo", cap.fondo || "");
    capa.lienzo.style.backgroundImage = cap.fondoRuta ? "url('" + cap.fondoRuta + "')" : "";

    capa.copias.forEach(function (c, i) { c.hidden = vacia || i !== ref.cap; });
    capa.numero.textContent = vacia ? "" : cap.primera + ref.pag;

    if (!vacia && !cap.entero) {
      capa.copias[ref.cap].style.transform = "translateX(" + (-ref.pag * cap.paso) + "px)";
    }
  }

  /* ── Dejar el libro quieto en un pliego ──────────────────────── */

  function asentar(k, sinTransicion) {
    actual = Math.max(0, Math.min(pliegos.length - 1, k));

    if (abierto) {
      pintar(izquierda, pagina(actual, 0), "izquierda");
      pintar(cara,      pagina(actual, 1), "derecha");
      pintar(dorso,     pagina(actual + 1, 0), "izquierda");
      pintar(derecha,   pagina(actual + 1, 1), "derecha");
    } else {
      pintar(izquierda, null, "izquierda");
      pintar(cara,      pagina(actual, 0), "derecha");
      pintar(dorso,     null, "izquierda");
      pintar(derecha,   pagina(actual + 1, 0), "derecha");
    }

    if (sinTransicion !== false) {
      hoja.style.transition = "none";
      hoja.style.transform = "";
      cara.sombra.style.transition = "none";
      cara.sombra.style.opacity = "0";
      dorso.sombra.style.transition = "none";
      dorso.sombra.style.opacity = "1";
      izquierda.sombra.style.transition = "none";
      izquierda.sombra.style.opacity = "0";
      derecha.sombra.style.transition = "none";
      derecha.sombra.style.opacity = "0";
      hoja.classList.remove("hoja--girando");
    }

    cromo();
  }

  function cromo() {
    var pl = pliegos[actual];
    if (!pl) return;
    rotulo.textContent = capitulos[pl.cap].rotulo;
    /* Los marcos se aclaran cuando el pliego es de papel blanco */
    document.body.classList.toggle("en-papel", capitulos[pl.cap].tema === "papel");

    /* El índice marca el capítulo que se está leyendo */
    var aqui = "#" + capitulos[pl.cap].id;
    Array.prototype.forEach.call(riel.querySelectorAll("a"), function (enlace) {
      if (enlace.getAttribute("href") === aqui) enlace.setAttribute("aria-current", "true");
      else enlace.removeAttribute("aria-current");
    });

    var primera = capitulos[pl.cap].primera + pl.base;
    var segunda = abierto && pagina(actual, 1) ? primera + 1 : null;
    var ultima = capitulos[capitulos.length - 1];
    var total = ultima.primera + Math.ceil(ultima.total / (abierto ? 2 : 1)) * (abierto ? 2 : 1) - 1;
    folio.textContent = (segunda ? primera + "–" + segunda : primera) + " / " + total;

    cinta.style.width = (pliegos.length > 1 ? (actual / (pliegos.length - 1)) * 100 : 100) + "%";
    atras.disabled = actual === 0;
    adelante.disabled = actual === pliegos.length - 1;
  }

  /* ── Pasar página ───────────────────────────────────────────── */

  function reflujo(el) { void el.offsetWidth; }

  function programar(fin) {
    giro = { fin: fin, temporizador: setTimeout(function () { giro = null; fin(); }, GIRO + 40) };
  }

  function rematar() {
    if (!giro) return;
    clearTimeout(giro.temporizador);
    var fin = giro.fin;
    giro = null;
    fin();
  }

  function sombrear(capa, desde, hasta) {
    capa.sombra.style.transition = "none";
    capa.sombra.style.opacity = desde;
    reflujo(capa.sombra);
    capa.sombra.style.transition = "opacity " + GIRO + "ms " + EASE;
    capa.sombra.style.opacity = hasta;
  }

  function irA(k) {
    var destino = Math.max(0, Math.min(pliegos.length - 1, k));
    if (destino === actual) return;
    if (giro) rematar();

    if (quieto || Math.abs(destino - actual) > 1) { asentar(destino, true); return; }

    if (destino > actual) {
      /* Adelante: la hoja de la derecha se gira hacia la izquierda. Debajo ya
         está esperando el pliego siguiente. */
      hoja.classList.add("hoja--girando");
      hoja.style.transition = "none";
      hoja.style.transform = "";
      reflujo(hoja);
      hoja.style.transition = "transform " + GIRO + "ms " + EASE;
      hoja.style.transform = "rotateY(-180deg)";
      sombrear(cara, "0", "1");
      sombrear(dorso, "1", "0");
      sombrear(derecha, ".8", "0");
      actual = destino;          /* el rótulo y el folio cambian al girar */
      cromo();
      programar(function () { asentar(destino, true); });
    } else {
      /* Atrás: se compone el pliego anterior con la hoja ya volcada sobre la
         izquierda, y se la deja caer hacia la derecha. */
      asentar(destino, false);
      hoja.classList.add("hoja--girando");
      hoja.style.transition = "none";
      hoja.style.transform = "rotateY(-180deg)";
      cara.sombra.style.transition = "none";
      cara.sombra.style.opacity = "1";
      dorso.sombra.style.transition = "none";
      dorso.sombra.style.opacity = "0";
      reflujo(hoja);
      hoja.style.transition = "transform " + GIRO + "ms " + EASE;
      hoja.style.transform = "";
      sombrear(cara, "1", "0");
      sombrear(dorso, "0", "1");
      sombrear(izquierda, ".8", "0");
      programar(function () { asentar(destino, true); });
    }
  }

  function pasar(sentido) { irA(actual + sentido); }

  function irACapitulo(id) {
    for (var i = 0; i < capitulos.length; i++) {
      if (capitulos[i].id !== id) continue;
      for (var k = 0; k < pliegos.length; k++) {
        if (pliegos[k].cap === i) { irA(k); return; }
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
      e.preventDefault(); irA(pliegos.length - 1);
    }
  });

  var acumulado = 0, ultimoPaso = 0;
  escenario.addEventListener("wheel", function (e) {
    var ahora = Date.now();
    if (ahora - ultimoPaso < GIRO + 150) return;
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
    var dx = e.clientX - inicioX, dy = e.clientY - inicioY;
    inicioX = null;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) pasar(dx < 0 ? 1 : -1);
  });

  libro.addEventListener("click", function (e) {
    var boton = e.target.closest("[data-ir]");
    if (boton) irACapitulo(boton.getAttribute("data-ir"));
  });

  /* El índice de la izquierda */
  var riel = document.getElementById("riel");
  riel.addEventListener("click", function (e) {
    var enlace = e.target.closest("a");
    if (!enlace) return;
    e.preventDefault();
    irACapitulo(enlace.getAttribute("href").slice(1));
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
      var primero = focoables[0], ultimo = focoables[focoables.length - 1];
      if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
      else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
    }
  });

  /* ── Imágenes ───────────────────────────────────────────────── */

  var EXTENSIONES = [".jpg", ".jpeg", ".png", ".webp", ".JPG", ".JPEG", ".PNG"];
  var buscadas = {};

  /* Busca un archivo probando las extensiones habituales, para que dé igual
     cómo se haya guardado la imagen al subirla. Cada ruta se prueba una vez. */
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

  capitulos.forEach(function (cap) {
    if (!cap.fondo) return;
    buscarImagen("assets/img/fondos/" + cap.fondo, function (ruta) {
      cap.fondoRuta = ruta;
      asentar(actual, true);
    });
  });

  /* La cubierta: si hay una ya terminada se usa tal cual; si no, se compone
     sobre la ilustración con la tipografía de la web. */
  function cadaPortada(hacer) {
    Array.prototype.forEach.call(document.querySelectorAll(".portada"), hacer);
  }
  /* Por orden: una cubierta ya terminada manda sobre todo; si no, la
     ilustración de la cubierta; y si tampoco, la del fondo del frontispicio.
     El rango evita que una imagen de menos categoría pise a otra mejor si
     tarda más en cargarse. */
  var rangoPortada = 0;
  [
    { rango: 3, base: "assets/img/portada/portada-libro", acabada: true },
    { rango: 2, base: "assets/img/portada/portada" },
    { rango: 1, base: "assets/img/fondos/portada" }
  ].forEach(function (opcion) {
    buscarImagen(opcion.base, function (ruta) {
      if (opcion.rango < rangoPortada) return;
      rangoPortada = opcion.rango;
      cadaPortada(function (p) {
        p.classList.toggle("portada--acabada", !!opcion.acabada);
        p.querySelector(".portada__imagen").src = ruta;
      });
    });
  });

  Array.prototype.forEach.call(document.querySelectorAll("[data-preferida]"), function (img) {
    buscarImagen(sinExtension(img.getAttribute("data-preferida")), function (ruta) {
      img.src = ruta;
      var figura = img.closest("figure");
      if (figura && figura.hidden) { figura.hidden = false; medir(); }
    });
  });

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
  Array.prototype.forEach.call(document.querySelectorAll(".correo"), function (enlace) {
    enlace.href = "mailto:" + usuario + "@" + dominio;
    enlace.textContent = usuario + "@" + dominio;
  });

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
