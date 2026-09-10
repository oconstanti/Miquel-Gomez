# El traductor literario · Miquel Gómez Besòs

Web personal d'en Miquel Gómez Besòs, traductor literari. Està pensada per llegir-se
**com un llibre**: un frontispici, un índex amb els seus folis, sis capítols amb caplletra
i filets, i un colofó al final.

## Contingut

| Capítol | Títol | Què hi ha |
|---|---|---|
| — | Frontispicio | Coberta i entrada («¿Qué significa traducir un libro?») |
| I | Tierra yerma | El pont entre l'autor i el lector |
| II | Una vida | La biografia, en tercera persona |
| III | David contra Goliat | El traductor davant de la IA |
| IV | La traducción consciente | El diàleg amb el mestre |
| V | El camino | Les traduccions publicades |
| VI | El mensaje en la botella | Contacte |

## Estructura dels fitxers

```
index.html                 tot el text de la web
assets/css/estilo.css      colors, tipografies i composició
assets/js/libro.js         índex, cinta de lectura, aparicions, imatges
assets/img/                les imatges  →  vegeu IMATGES.md
IMATGES.md                 on deixar cada imatge i com s'ha de dir
```

No hi ha cap procés de compilació ni cap dependència: són tres fitxers de text i una
carpeta d'imatges.

## Com veure-la mentre s'edita

```bash
python3 -m http.server 8000
# i obrir http://localhost:8000
```

## Detalls de disseny

- **Tipografies:** Playfair Display (títols) i EB Garamond (text), servides per Google Fonts.
- **Colors:** paper crema `#f6f2e9`, tinta `#2f2823`, vermell de caplletra `#8c1f1a`.
- Al capítol 3 la veu de la IA es compon en un gris fred, perquè es distingeixi de la del
  traductor sense dir-ho.
- Funciona sense JavaScript (es perden l'índex desplegable i les aparicions progressives),
  respecta `prefers-reduced-motion` i té una fulla d'estil d'impressió.

## Publicació

Qualsevol allotjament de fitxers estàtics serveix: GitHub Pages (Settings → Pages → branca
i carpeta arrel), Netlify o Vercel arrossegant-hi la carpeta.

## Pendents

- Substituir la coberta provisional per la definitiva (`assets/img/portada/portada-libro.jpg`).
- Tres cobertes de llibre que falten i les dades de *Jaque mate* (autor i editorial).
- Confirmar el correu de contacte: al document hi consta `durkapulo@gmail.com`.
