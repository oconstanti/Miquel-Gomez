# On deixar les imatges

Totes les imatges van dins de `assets/img/`. **No cal tocar el codi**: la pàgina busca
cada fitxer pel seu nom exacte i, si el troba, el mostra sola. Si no hi és, ensenya una
alternativa provisional (una coberta composta amb tipografia, o cap imatge).

Formats recomanats: **JPG** per a fotografies i **PNG** si necessites fons transparent.
Mida raonable: entre 800 i 1600 px d'amplada, i per sota d'1 MB per fitxer.

---

## 1. La coberta del llibre (portada de la web)

| Carpeta | Nom exacte del fitxer | Proporció |
|---|---|---|
| `assets/img/portada/` | `portada-libro.jpg` | vertical, 2:3 (p. ex. 1000 × 1500 px) |

Ara mateix hi ha un dibuix provisional (`portada-libro.svg`) que imita la coberta de
l'exemple. En el moment que hi deixis `portada-libro.jpg`, el substitueix
automàticament.

## 2. Les cobertes dels llibres traduïts (capítol 5)

Carpeta: `assets/img/libros/`. Proporció vertical 2:3.

| Llibre | Nom del fitxer | Estat |
|---|---|---|
| Yo era un encanto | `yo-era-un-encanto.png` | ✅ ja hi és |
| Sex and Rage | `sex-and-rage.jpg` | ⬜ falta |
| Las claves secretas del cosmos | `las-claves-secretas-del-cosmos.png` | ✅ ja hi és |
| La extraña muerte de Sir Lawrence Linwood | `la-extrana-muerte-de-sir-lawrence-linwood.png` | ✅ ja hi és |
| La gemela silenciosa | `la-gemela-silenciosa.png` | ✅ ja hi és |
| La agencia de detectives Inklings | `la-agencia-de-detectives-inklings.jpg` | ⬜ falta |
| Jaque mate | `jaque-mate.jpg` | ⬜ falta |

Les quatre que ja hi són surten del document de Word. Mentre en falti alguna, al seu
lloc apareix una coberta provisional amb el títol i l'autor compostos amb la tipografia
de la web (no queda cap forat lleig).

**Per afegir un llibre nou:** copia un bloc `<li class="libro">` dins de
`<ul class="estanteria">` a `index.html`, canvia el títol, l'autor, l'editorial i el nom
del fitxer de la imatge.

## 3. El retrat d'en Miquel (capítol 2)

| Carpeta | Nom exacte | Proporció |
|---|---|---|
| `assets/img/retrato/` | `miquel-gomez.jpg` | vertical o quadrada (p. ex. 800 × 1000 px) |

Si no hi ha fitxer, el capítol simplement no mostra cap retrat.

## 4. Il·lustracions de capítol (opcionals)

Carpeta: `assets/img/capitulos/`. Apareixen com una làmina ampla just sota el títol del
capítol. Proporció apaïsada, per exemple 1600 × 900 px.

| Capítol | Nom del fitxer |
|---|---|
| 1 · Tierra yerma | `capitulo-1.jpg` |
| 2 · Una vida | `capitulo-2.jpg` |
| 3 · David contra Goliat | `capitulo-3.jpg` |
| 4 · La traducción consciente | `capitulo-4.jpg` |
| 5 · El camino | `capitulo-5.jpg` |
| 6 · El mensaje en la botella | `capitulo-6.jpg` |

De moment només el capítol 1 té la ranura preparada a `index.html`. Per activar-la en un
altre capítol, copia-hi aquest bloc just després de `</header>`:

```html
<figure class="lamina" hidden>
  <img data-preferida="assets/img/capitulos/capitulo-3.jpg" alt="Ilustración del capítulo tres" loading="lazy">
</figure>
```

---

## Drets d'imatge

Les cobertes dels llibres són de les editorials (Random House, Newton Compton). Mostrar-les
en el web d'un traductor per acreditar la seva feina és habitual, però val la pena que en
Miquel ho confirmi amb les editorials si vol quedar-se tranquil.
