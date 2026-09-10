/* ─────────────────────────────────────────────
   El traductor literario · Miquel Gómez Besòs
   Comportamiento de la página
   ───────────────────────────────────────────── */

(function () {
  "use strict";

  var sinMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── 1. Titulillo y cinta de lectura ─────────────────────────── */

  var cabecera = document.getElementById("cabecera");
  var rotulo = document.getElementById("rotuloActual");
  var cinta = document.getElementById("cinta");
  var secciones = Array.prototype.slice.call(document.querySelectorAll("[data-rotulo]"));

  function alDesplazar() {
    var y = window.scrollY || window.pageYOffset;

    cabecera.classList.toggle("desplazada", y > 24);

    var recorrido = document.documentElement.scrollHeight - window.innerHeight;
    cinta.style.width = (recorrido > 0 ? Math.min(y / recorrido, 1) * 100 : 0) + "%";

    // La sección cuyo comienzo queda por encima de la línea de lectura
    var linea = y + window.innerHeight * 0.35;
    var actual = secciones[0];
    for (var i = 0; i < secciones.length; i++) {
      if (secciones[i].offsetTop <= linea) actual = secciones[i];
    }
    var texto = actual.getAttribute("data-rotulo");
    if (rotulo.textContent !== texto) rotulo.textContent = texto;
  }

  var pendiente = false;
  window.addEventListener("scroll", function () {
    if (pendiente) return;
    pendiente = true;
    window.requestAnimationFrame(function () {
      alDesplazar();
      pendiente = false;
    });
  }, { passive: true });
  window.addEventListener("resize", alDesplazar);
  alDesplazar();

  /* ── 2. Índice ───────────────────────────────────────────────── */

  var velo = document.getElementById("indiceVelo");
  var abrir = document.getElementById("abrirIndice");
  var cerrar = document.getElementById("cerrarIndice");
  var dialogo = document.getElementById("indiceDialogo");

  function abrirIndice() {
    velo.hidden = false;
    abrir.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    var primero = dialogo.querySelector("a");
    if (primero) primero.focus();
  }

  function cerrarIndice(devolverFoco) {
    velo.hidden = true;
    abrir.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    if (devolverFoco) abrir.focus();
  }

  abrir.addEventListener("click", abrirIndice);
  cerrar.addEventListener("click", function () { cerrarIndice(true); });

  velo.addEventListener("click", function (e) {
    if (e.target === velo) cerrarIndice(true);
  });

  dialogo.addEventListener("click", function (e) {
    if (e.target.closest("a")) cerrarIndice(false);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !velo.hidden) cerrarIndice(true);
    if (e.key === "Tab" && !velo.hidden) {
      var focoables = dialogo.querySelectorAll("a, button");
      var primero = focoables[0];
      var ultimo = focoables[focoables.length - 1];
      if (e.shiftKey && document.activeElement === primero) {
        e.preventDefault(); ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault(); primero.focus();
      }
    }
  });

  /* ── 3. Aparición progresiva ─────────────────────────────────── */

  var revelables = document.querySelectorAll(".revelar");

  if (sinMovimiento || !("IntersectionObserver" in window)) {
    Array.prototype.forEach.call(revelables, function (el) { el.classList.add("visible"); });
  } else {
    var vigia = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (entrada.isIntersecting) {
          entrada.target.classList.add("visible");
          vigia.unobserve(entrada.target);
        }
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.08 });

    Array.prototype.forEach.call(revelables, function (el) { vigia.observe(el); });
  }

  /* ── 4. Imágenes ─────────────────────────────────────────────── */

  /* 4a. Imágenes preferidas: si el archivo existe, sustituye al provisional
         y muestra la figura que lo contiene. Basta con dejar el archivo
         en su carpeta con el nombre indicado en IMAGENES.md. */
  Array.prototype.forEach.call(document.querySelectorAll("[data-preferida]"), function (img) {
    var ruta = img.getAttribute("data-preferida");
    var prueba = new Image();
    prueba.onload = function () {
      img.src = ruta;
      var figura = img.closest("figure");
      if (figura) figura.hidden = false;
    };
    prueba.src = ruta;
  });

  /* 4b. Cubiertas que todavía no existen: se oculta la imagen rota y queda
         a la vista la cubierta suplente compuesta con tipografía. */
  Array.prototype.forEach.call(document.querySelectorAll(".libro__portada img"), function (img) {
    function fallar() { img.hidden = true; }
    img.addEventListener("error", fallar);
    if (img.complete && img.naturalWidth === 0) fallar();
  });

  /* ── 5. Correo ───────────────────────────────────────────────── */

  var usuario = "durkapulo";
  var dominio = "gmail.com";
  var enlace = document.getElementById("correo");
  if (enlace) {
    enlace.href = "mailto:" + usuario + "@" + dominio;
    enlace.textContent = usuario + "@" + dominio;
  }
})();
