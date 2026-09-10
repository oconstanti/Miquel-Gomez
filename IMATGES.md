# On deixar les imatges

Totes van dins de `assets/img/`. **No cal tocar codi**: la pàgina busca cada fitxer pel
seu nom exacte i, si el troba, el posa. Si no hi és, ensenya una alternativa provisional.

Format: **JPG** per a fotografies. Per als fons, entre 1920 i 2560 px d'amplada i per sota
d'uns 500 KB cadascun (són pantalla completa i han de carregar ràpid).

---

## 1. Els fons dels capítols ← **això és el que falta**

Carpeta: `assets/img/fondos/`. Apaïsades, 16:9 o més amples.

| Pàgina | Nom exacte del fitxer | Quina imatge |
|---|---|---|
| Frontispici i el llindar | `portada.jpg` | ⬜ falta |
| Capítol 1 · Tierra yerma | `capitulo-1.jpg` | la terra vermella clivellada |
| Capítol 2 · Una vida | `capitulo-2.jpg` | l'escriptori amb els papers i el portàtil |
| Capítol 3 · David contra Goliat | `capitulo-3.jpg` | la figura amb capa al desert |
| Capítol 4 · La traducción consciente | `capitulo-4.jpg` | la biblioteca amb els llibres encesos |
| Capítol 5 · El camino | `capitulo-5.jpg` | ⬜ falta |
| Capítol 6 · El mensaje en la botella | `capitulo-6.jpg` | ⬜ falta |

**Important:** els pantallazos que m'has passat pel xat no em serveixen com a fons, perquè
duen el text a sobre i estan retallats. Necessito els fitxers originals. Si tens el PDF
d'on surten, passa'l i n'extrec les imatges a plena resolució.

Mentre no hi siguin, cada capítol ensenya un degradat fosc en el mateix to que la imatge
que hi ha d'anar, així que la web ja es pot veure i ensenyar.

**Com han d'estar composades:** el text ocupa mig costat de la pantalla (capítols senars a
l'esquerra, parells a la dreta) i el fons es veu sencer. Va bé que el motiu principal de la
foto quedi al costat contrari al del text, com als teus exemples.

## 2. La coberta del llibre (frontispici)

| Carpeta | Nom exacte | Proporció |
|---|---|---|
| `assets/img/portada/` | `portada-libro.jpg` | vertical 2:3 (p. ex. 1000 × 1500 px) |

Ara hi ha un dibuix provisional (`portada-libro.svg`) que imita el de la teva maqueta.

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
