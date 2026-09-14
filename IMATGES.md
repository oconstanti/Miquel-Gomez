# On deixar les imatges

Totes van dins de `assets/img/`. **No cal tocar codi**: la pàgina busca cada fitxer pel
seu nom exacte i, si el troba, el posa. Si no hi és, ensenya una alternativa provisional.

Format: **JPG** per a fotografies. Per als fons, entre 1920 i 2560 px d'amplada i per sota
d'uns 500 KB cadascun (són pantalla completa i han de carregar ràpid).

---

## 1. Els fons dels capítols ← **això és el que falta**

Carpeta: `assets/img/fondos/`. Apaïsades, 16:9 o més amples.

| Pàgina | Nom del fitxer | Estat |
|---|---|---|
| Frontispici i el llindar | `portada.jpeg` | ✅ ja hi és |
| Capítol 1 · Tierra yerma | `capitulo-1.jpeg` | ✅ ja hi és |
| Capítol 2 · Una vida | `capitulo-2.jpeg` | ✅ ja hi és |
| Capítol 3 · David contra Goliat | `capitulo-3.jpeg` | ✅ ja hi és |
| Capítol 4 · La traducción consciente | `capitulo-4.jpeg` | ✅ ja hi és |
| Capítol 5 · El camino | `capitulo-5` | ⬜ **falta** |
| Capítol 6 · El mensaje en la botella | `capitulo-6.jpeg` | ✅ ja hi és |

L'extensió és igual: la pàgina prova `.jpg`, `.jpeg`, `.png` i `.webp`, així que el fitxer
es pot deixar tal com surti de l'ordinador.

`portada.jpeg` fa dues feines alhora: és la il·lustració de la coberta del llibre (amb el
títol composat a sobre amb la tipografia de la web) i, desenfocada i fosca, el fons del
frontispici.

Mentre falti `capitulo-5`, aquell capítol ensenya un degradat fosc en el to que li toca.

**Com han d'estar composades:** el text ocupa mig costat de la pantalla (capítols senars a
l'esquerra, parells a la dreta) i el fons es veu sencer. Va bé que el motiu principal de la
foto quedi al costat contrari al del text, com als teus exemples.

## 2. La coberta del llibre (frontispici)

Carpeta: `assets/img/portada/`. Vertical, 2:3.

| Fitxer | Què fa | Estat |
|---|---|---|
| `portada.jpeg` | la **il·lustració** de la coberta; el títol s'hi composa a sobre | ✅ ja hi és |
| `portada-libro.*` | una coberta **ja acabada**, amb el seu propi títol imprès | ⬜ opcional |

Si algun dia hi deixes un `portada-libro.jpg` fet per un dissenyador, mana sobre l'altre i
la web amaga el títol que composa ella. Mentrestant fa servir `portada.jpeg` i hi posa a
sobre el nom, el títol i el lema amb la tipografia del llibre.

El llibre no es mostra pla: és un volum en tres dimensions, amb llom i gruix, girat una
mica perquè es vegi el cantell.

## 3. Les cobertes dels llibres traduïts (capítol 5)

Carpeta: `assets/img/libros/`. Verticals, 2:3.

| Llibre | Nom del fitxer | Estat |
|---|---|---|
| Yo era un encanto | `yo-era-un-encanto.png` | ✅ ja hi és |
| Sex and Rage | `sex-and-rage.jpg` | ⬜ falta |
| Las claves secretas del cosmos | `las-claves-secretas-del-cosmos.png` | ✅ ja hi és |
| La extraña muerte de Sir Lawrence Linwood | `la-extrana-muerte-de-sir-lawrence-linwood.png` | ✅ ja hi és |
| La gemela silenciosa | `la-gemela-silenciosa.png` | ✅ ja hi és |
| La agencia de detectives Inklings | `la-agencia-de-detectives-inklings.jpg` | ⬜ falta |
| Jaque mate | `jaque-mate.jpg` | ⬜ falta |

Mentre en falti alguna, al seu lloc surt una coberta composta amb el títol i l'autor.

**Per afegir un llibre nou:** copia un bloc `<div class="libro-ficha">` dins de
`<div class="estanteria">` a `index.html` i canvia el títol, l'autor, l'editorial i el nom
del fitxer.

## 4. El retrat d'en Miquel (capítol 2)

| Carpeta | Nom exacte | Proporció |
|---|---|---|
| `assets/img/retrato/` | `miquel-gomez.jpg` | vertical (p. ex. 800 × 1000 px) |

Si no hi ha fitxer, el capítol no mostra cap retrat.

---

## Drets d'imatge

Les cobertes dels llibres són de les editorials (Random House, Newton Compton). Mostrar-les
al web d'un traductor per acreditar la seva feina és habitual, però val la pena que en
Miquel ho confirmi amb les editorials. Amb els fons, si són generats o de banc d'imatges,
cal comprovar que la llicència permeti l'ús en un web.
