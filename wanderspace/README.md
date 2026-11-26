# Wanderspace

A calm, single-page web app that recommends one philosophical YouTube video per day, with a hard 25-minute duration ceiling.

## Run locally

Open `index.html` directly in a browser, or serve this folder with any static server:

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

## What it does

- Picks one daily recommendation deterministically from a curated list, based on the viewer's local calendar date.
- Enforces the 25-minute limit in the recommendation data filter.
- Provides an embedded YouTube player, a browsable library, theme filters, saved/watched states, and a private daily reflection.
- Stores saved videos, watched states and reflections in browser `localStorage`; there is no account or backend.
- Uses the uploaded AXON reference's black canvas, additive lavender particle ring, monospace labels and restrained editorial layout.
- Respects `prefers-reduced-motion` and adapts the particle count for smaller screens.

## Curation note

The initial daily rotation contains seven entries with runtimes at or below 10:47. Three Alastair videos are included, including the supplied reference “What if you're not special at all?”. The other supplied reference links remain in “Your starting points”, outside the daily rotation until their titles and durations can be verified.

The daily pick cycles through this starter catalogue by local calendar date; it does not call an external recommendation API.
