# El traductor literario · Miquel Gómez Besòs

Web personal d'en Miquel Gómez Besòs, traductor literari. Es llegeix **com un llibre**:
els capítols van d'esquerra a dreta i es passa pàgina; cada capítol té la seva imatge de
fons a tota pantalla i el text en una columna al costat.

## Com es llegeix

La web és un **llibre obert**: dues pàgines a la vista i el llom al mig. Cada capítol
comença sempre a la pàgina de l'esquerra; si ocupa més d'una pàgina, la continuació va a
la de la dreta. Si el capítol cap en una sola pàgina, la de la dreta es queda per a la
fotografia, que corre sencera d'un costat a l'altre del plec.

Es passa full amb les fletxes **←** i **→**, l'espai, `Re Pàg` / `Av Pàg`, `Inici` i `Fi`;
amb les fletxes de la pantalla; lliscant amb el dit; amb la roda del ratolí; o saltant de
capítol des de l'índex.

**El full gira de veritat.** La pàgina de la dreta té la frontissa al llom: en passar-la,
gira cap a l'esquerra en tres dimensions, s'enfosqueix en apartar-se de la llum i deixa
veure el plec següent, que ja hi era a sota. El revers del full que gira és la pàgina
esquerra del plec que ve, com en un llibre de debò. Per a enrere, el mateix a l'inrevés.

El text no està tallat a mà: el navegador el reparteix en pàgines segons la mida de la
finestra. **Cap frase es queda sola:** si l'última pàgina d'un capítol quedés amb un
parell de línies, s'estreny el text d'aquell capítol el mínim que calgui —fins a un 12 %—
per recollir-les. Per això a una mateixa pantalla hi pot haver capítols amb la lletra una
mica més petita que altres.

En pantalles de menys de 900 px (mòbils, finestres estretes) el llibre es tanca i les
pàgines es llegeixen d'una en una, amb el mateix gir.

Amb `prefers-reduced-motion` no gira res: els canvis són instantanis.

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
index.html                 tot el text del llibre, dins de <div class="fuente">
assets/css/estilo.css      colors, tipografies i composició de les pàgines
assets/js/libro.js         reparteix el text per les pàgines i les fa girar
assets/img/                les imatges  →  vegeu IMATGES.md
IMATGES.md                 on deixar cada imatge i com s'ha de dir
```

El text viu una sola vegada a `index.html`, dins de `<div class="fuente">`. El guió el
copia a les quatre capes que formen el llibre (pàgina esquerra, pàgina dreta, cara i
revers del full que gira) i ensenya a cadascuna el tros que li toca. Per canviar un text,
n'hi ha prou de tocar-lo a `index.html`. Sense JavaScript, aquesta font es llegeix tal
qual, com un document corrent.

Sense compilació ni dependències: tres fitxers de text i una carpeta d'imatges.

## Com veure-la mentre s'edita

```bash
python3 -m http.server 8000
# i obrir http://localhost:8000
```

## Detalls de disseny

- **Tipografies:** Playfair Display (títols) i EB Garamond (text), de Google Fonts.
- **Colors:** nit `#0e0906`, llum `#f3ece1`, ambre `#d3a06a`.
- El text sempre s'alinea a l'esquerra. El marge de dins, tocant al llom, és més ample
  que el de fora, com en un llibre imprès.
- Els números de pàgina van a la cantonada de fora de cada pàgina.
- Al capítol 3 la veu de la IA es compon en un gris fred, perquè es distingeixi de la del
  traductor sense dir-ho.
- Sobre cada fons hi ha un vel degradat perquè el text es llegeixi sempre, tinguin la
  lluminositat que tinguin les fotografies.
- Al mòbil el text passa a ocupar tota l'amplada i les fletxes baixen a la barra inferior.
- El gir dura 1.050 ms; es canvia a `GIRO`, a dalt de `assets/js/libro.js`. El llindar per
  obrir el llibre de bat a bat és `ANCHO_LIBRO_ABIERTO`.

## Publicació

Qualsevol allotjament de fitxers estàtics: GitHub Pages (Settings → Pages → branca i
carpeta arrel), Netlify o Vercel arrossegant-hi la carpeta.

## Pendents

- Falta el fons del capítol 5 (`assets/img/fondos/capitulo-5.*`).
- Tres cobertes de llibre que falten i les dades de *Jaque mate* (autor i editorial).
- Confirmar el correu de contacte: al document hi consta `durkapulo@gmail.com`.
