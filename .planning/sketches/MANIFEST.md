# Sketch Manifest

## Design Direction

A **diegetic Tron world where the environment is the navigation.** The Velora cruises a neon
grid street through a black void (scrolling grid, pink + cyan spotlights, bloom, chromatic
aberration — already built in R3F). A **Home Building** sits in the world; clicking it *enters
the Room* — a vertical-scroll page (about → skills → projects → contact). Props around the house
are the menu: the **mailbox** opens the contact form in a **cinematic appearing modal** (reused
from the homepage) without leaving the scene; **signs/billboards** map to real projects
(DVA Express, TDA, Portfolio…); other objects surface skills. No traditional nav — you explore to
navigate. Aesthetic is **techy & precise**: light HUD overlay, monospace + Chakra Petch, sharp
corner-cut panels, neon glow, high contrast. Sketches fake the Three.js backdrop with a CSS
perspective grid so we can judge the real question — overlay legibility and hotspot affordance
over a moving scene.

## Reference Points

- Tron: Legacy (neon grid, light-trails, high-contrast void)
- The project's own R3F scene (`app/routes/$lang/3d-experience/`) — car, floating grid, bloom
- HUD / game-world callouts (Death Stranding waypoints, Cyberpunk scan tags)

## Sketches

| # | Name | Design Question | Winner | Tags |
|---|------|----------------|--------|------|
| 001 | diegetic-hotspots | How do world-objects announce they're navigation without breaking immersion? | TBD | interaction, hotspots, hud |
| 002 | enter-house-transition | What does entering the house (exterior → vertical-scroll Room) feel like? | TBD | transition, motion |
| 003 | contact-modal | How does the cinematic contact modal appear over the world (mailbox → form)? | TBD | modal, contact, motion |

## Frontier / Later Candidates

- World wayfinding — corner radar mini-map or waypoint bar (deferred from round 1)
- Room interior scroll layout (about/skills/projects/contact) — the inside of the house
- Loading / boot sequence into the world
