---
sketch: 001
name: diegetic-hotspots
question: "How do world-objects announce they're navigation without breaking immersion?"
winner: null
tags: [interaction, hotspots, hud, three]
---

# Sketch 001: Diegetic Hotspots (real scene)

## Design Question

The Tron world *is* the menu — the house, mailbox, project signs, and skills pylon are all
clickable destinations. How does each object signal "I'm interactive, and here's where I lead"
without cluttering the scene or breaking the immersion of a moving 3D world?

## Real scene, not a fake

This sketch runs the **actual `3d-experience` scene**: the real Velora GLB (spinning wheels),
scrolling neon grid, ring tunnel, drifting boxes, blue + pink spotlights, and UnrealBloom — ported
to vanilla three.js r182 so it needs no build step. The house / mailbox / signs / skills-pylon are
**placeholder wireframe meshes** (not yet modeled), standing in at their proposed world positions.
The HTML hotspots are **projected from real 3D anchors**, so labels track the objects as you orbit.

Colours are the project's real tokens: `#0A84FF` accent (navigate/enter/skills), `#ff2463` hot
(contact). No cyan.

## How to View

⚠️ Must be served over HTTP — `file://` blocks the 6.7 MB GLB fetch. A static server is already
running from the repo root:

    http://127.0.0.1:7788/.planning/sketches/001-diegetic-hotspots/index.html

If it's not running:

    python3 -m http.server 7788 --bind 127.0.0.1   # run from repo root (www/)

Drag to orbit, scroll to zoom. Click any hotspot to see where it routes (toast, bottom).

## Variants

- **A: Callout Tags** — every destination wears a tethered label chip, always visible. Zero
  discovery cost; reads instantly. Cost: tags crowd the scene and follow you as you orbit.
- **B: Proximity Glow** — the world sits clean; hovering an object lights it up and fades in a
  label. Most immersive. Cost: nothing discoverable at rest; no hover on touch.
- **C: Pulsing Reticle** — a quiet animated marker rests on each object (signals "interactive"),
  hover expands it to a labelled card. Middle path: presence always visible, meaning on demand.

## What to Look For

- **Legibility over the live scene:** do labels stay readable against the moving grid, boxes, and
  bloom — especially when a bright ring or box passes behind a tag?
- **Clutter vs. discoverability:** A tells all but is noisy; B is clean but hidden; C balances.
- **Anchor tracking:** as you orbit, do the projected labels feel "attached" to their objects?
- **Touch reality:** B relies on hover — accept a tap-to-reveal fallback, or lean A/C?
- **The house specifically:** it's the primary action (enter the Room). Does it stand out enough
  from the secondary props in each variant, or should it get a stronger persistent treatment?

## Notes / follow-ups

- Placeholder props are rough wireframes — real models (house, mailbox, signs) come later.
- Drifting boxes read a touch large/flat; tune count + emissive when this goes into R3F.
