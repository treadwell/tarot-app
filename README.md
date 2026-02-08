# tarot-app

A simple static web app that performs a 3-card tarot draw.

## What It Does

- Loads tarot card data from `res/tarot.json` and images from `res/img/`.
- Draws 3 random cards (0-77) and assigns each an upright or reversed orientation.
- Renders the cards and captions for a past/present/future reading.

## Run It

Because the app loads JSON, run it with a local web server (not `file://`). For example:

```bash
python3 -m http.server 8080
```

Then open:

```
http://localhost:8080/
```

## Files

- `index.html` - page entry point.
- `src/3card.js` - app logic (draw cards, render images, generate story).
- `src/3card.css` - layout and reversed-card rotation.
- `res/tarot.json` - card metadata and upright/reversed captions.
- `res/img/` - card images referenced by the JSON.
