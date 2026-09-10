# El traductor literario · Miquel Gómez Besòs

Web personal d'en Miquel Gómez Besòs, traductor literari. Es llegeix **com un llibre**:
els capítols van d'esquerra a dreta i es passa pàgina; cada capítol té la seva imatge de
fons a tota pantalla i el text en una columna al costat.

## Com es passa pàgina

- Fletxes **←** i **→**, barra espaiadora, `Re Pàg` / `Av Pàg`, `Inici` i `Fi`
- Les fletxes de la pantalla (als costats, i a baix al mòbil)
- Lliscant amb el dit al mòbil
- Roda del ratolí o *trackpad*
- L'índex, al rètol de dalt a la dreta

El text no està tallat a mà: el navegador el reparteix en pàgines segons la mida de la
pantalla, com un lector de llibres electrònics. En una pantalla petita el mateix capítol
ocupa més pàgines; el comptador de baix sempre diu on ets.

## Contingut

| Capítol | Títol | Què hi ha |
|---|---|---|
| — | Frontispicio | Coberta i entrada («¿Qué significa traducir un libro?») |
| — | El umbral | L'eslògan, a tota pantalla |
| I | Tierra yerma | El pont entre l'autor i el lector |
| II | Una vida | La biografia, en tercera persona |
| III | David contra Goliat | El traductor davant de la IA |
| IV | La traducción consciente | El diàleg amb el mestre |
| V | El camino | Les traduccions publicades |
| VI | El mensaje en la botella | Contacte |
| — | Colofón | Signatura final |

## Estructura dels fitxers

```
index.html                 tot el text de la web
assets/css/estilo.css      colors, tipografies i composició
assets/js/libro.js         paginació, navegació, índex i imatges
assets/img/                les imatges  →  vegeu IMATGES.md
IMATGES.md                 on deixar cada imatge i com s'ha de dir
```

Sense compilació ni dependències: tres fitxers de text i una carpeta d'imatges.

## Com veure-la mentre s'edita

```bash
python3 -m http.server 8000
# i obrir http://localhost:8000
```

## Detalls de disseny

- **Tipografies:** Playfair Display (títols) i EB Garamond (text), de Google Fonts.
- **Colors:** nit `#0e0906`, llum `#f3ece1`, ambre `#d3a06a`.
- Els capítols alternen el costat del text (senars a l'esquerra, parells a la dreta), com
  les pàgines parelles i senars d'un llibre, i el text s'alinea al cantell exterior.
- Al capítol 3 la veu de la IA es compon en un gris fred, perquè es distingeixi de la del
  traductor sense dir-ho.
- Sobre cada fons hi ha un vel degradat perquè el text es llegeixi sempre, tinguin la
  lluminositat que tinguin les fotografies.
- Al mòbil el text passa a ocupar tota l'amplada i les fletxes baixen a la barra inferior.
- Respecta `prefers-reduced-motion`.

## Publicació

Qualsevol allotjament de fitxers estàtics: GitHub Pages (Settings → Pages → branca i
carpeta arrel), Netlify o Vercel arrossegant-hi la carpeta.

## Pendents

- **Els fons dels capítols** (vegeu `IMATGES.md`): calen els fitxers originals, no els
  pantallazos. Si hi ha el PDF, se'n poden extreure.
- La coberta definitiva del llibre.
- Tres cobertes que falten i les dades de *Jaque mate* (autor i editorial).
- Confirmar el correu de contacte: al document hi consta `durkapulo@gmail.com`.
