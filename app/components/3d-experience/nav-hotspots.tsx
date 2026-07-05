import styles from './nav-hotspots.module.css';

import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { atom, useAtom } from 'jotai';
import { useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router';
import { AdditiveBlending, Color, type Mesh } from 'three';

/** Which affordance treatment to render for every hotspot. */
export type HotspotStyle = 'a' | 'b' | 'c';
export const hotspotStyleAtom = atom<HotspotStyle>('c');

/** Mailbox → cinematic contact modal (rendered outside the Canvas). */
export const contactModalOpenAtom = atom(false);

/** Set by an in-canvas hotspot click; consumed by the out-of-canvas relay to navigate. */
export const pendingNavAtom = atom<string | null>(null);

type Tone = 'accent' | 'hot';

type Poi = {
  id: string;
  k: string;
  v: string;
  tone: Tone;
  /** world position [x, y, z] — marker sits on the ground, label floats at `labelY`. */
  pos: [number, number, number];
  labelY: number;
  /** 'nav' → navigate to the room; 'contact' → open the contact modal. */
  action: 'nav' | 'contact';
};

const POIS: Poi[] = [
  { id: 'house', k: 'THE HOUSE', v: 'Enter · scrollable room', tone: 'accent', pos: [0, 0, -6], labelY: 2.1, action: 'nav' },
  { id: 'projects', k: 'PROJECTS', v: 'Sign · project sections', tone: 'accent', pos: [-4.6, 0, -1], labelY: 1.6, action: 'nav' },
  { id: 'skills', k: 'SKILLS', v: 'Sign · skill matrix', tone: 'accent', pos: [4.6, 0, -1.4], labelY: 1.6, action: 'nav' },
  { id: 'mail', k: 'MAILBOX', v: 'Contact · cinematic modal', tone: 'hot', pos: [2.6, 0, 1.6], labelY: 0.95, action: 'contact' },
];

const ACCENT = new Color(0x0a84ff);
const HOT = new Color(0xff2463);
const toneVar = (tone: Tone) => (tone === 'hot' ? 'var(--error)' : 'var(--accent)');

/** Subtle Tron light-pillar placeholder standing in for the not-yet-modelled prop. */
function PoiMarker({ tone }: { tone: Tone }) {
  const color = tone === 'hot' ? HOT : ACCENT;
  const beam = useRef<Mesh>(null);
  useFrame((state) => {
    if (beam.current) {
      const s = 0.85 + Math.sin(state.clock.elapsedTime * 2) * 0.15;
      (beam.current.material as { opacity: number }).opacity = 0.28 * s;
    }
  });
  return (
    <group>
      {/* ground ring */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.02, 0]}>
        <torusGeometry args={[0.42, 0.02, 12, 64]} />
        <meshStandardMaterial emissive={color} emissiveIntensity={2.2} color={0x000000} toneMapped={false} />
      </mesh>
      {/* light beam */}
      <mesh ref={beam} position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 2.4, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.28} blending={AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  );
}

function HotspotLabel({ poi, style, onFire }: { poi: Poi; style: HotspotStyle; onFire: (p: Poi) => void }) {
  const cssVar = { ['--c' as string]: toneVar(poi.tone) };
  const fire = () => onFire(poi);
  const text = (
    <>
      <span className={styles.k}>{poi.k}</span>
      <span className={styles.v}>{poi.v}</span>
    </>
  );

  if (style === 'a') {
    return (
      <div className={styles.hot} style={cssVar}>
        <span className={styles.callout}>
          <span className={styles.stem} />
          <span className={styles.dot} />
          <span className={`${styles.tag} ${styles.click}`} onClick={fire}>{text}</span>
        </span>
      </div>
    );
  }
  if (style === 'b') {
    return (
      <div className={`${styles.hot} ${styles.prox} ${styles.click}`} style={cssVar} onClick={fire}>
        <span className={styles.zone} />
        <span className={styles.ring} />
        <span className={styles.pip} />
        <span className={styles.card}>{text}</span>
      </div>
    );
  }
  return (
    <div className={`${styles.hot} ${styles.retic} ${styles.click}`} style={cssVar} onClick={fire}>
      <span className={styles.mark} />
      <span className={styles.core} />
      <span className={styles.card}>{text}</span>
    </div>
  );
}

/** In-canvas: 3D markers + projected HTML hotspot labels. Mount inside <Canvas>. */
export function NavHotspots() {
  const [style] = useAtom(hotspotStyleAtom);
  const [, setContactOpen] = useAtom(contactModalOpenAtom);
  const [, setPendingNav] = useAtom(pendingNavAtom);

  const fire = (poi: Poi) => {
    if (poi.action === 'contact') setContactOpen(true);
    else setPendingNav(poi.id);
  };

  return (
    <group>
      {POIS.map((poi) => (
        <group key={poi.id} position={poi.pos}>
          <PoiMarker tone={poi.tone} />
          <Html position={[0, poi.labelY, 0]} center zIndexRange={[30, 0]} style={{ pointerEvents: 'none' }}>
            <HotspotLabel poi={poi} style={style} onFire={fire} />
          </Html>
        </group>
      ))}
    </group>
  );
}

/** Out-of-canvas: style switcher HUD, cinematic contact modal, and the navigation relay. */
export function NavHotspotsOverlay() {
  const [style, setStyle] = useAtom(hotspotStyleAtom);
  const [contactOpen, setContactOpen] = useAtom(contactModalOpenAtom);
  const [pendingNav, setPendingNav] = useAtom(pendingNavAtom);
  const navigate = useNavigate();
  const { lang } = useParams();

  useEffect(() => {
    if (!pendingNav) return;
    const roomPath = lang?.startsWith('it') ? '/it/esperienza-3d/stanza' : `/${lang ?? 'en'}/3d-experience/room`;
    navigate(roomPath);
    setPendingNav(null);
  }, [pendingNav, navigate, lang, setPendingNav]);

  const styleButtons: { id: HotspotStyle; label: string }[] = [
    { id: 'a', label: 'Tags' },
    { id: 'b', label: 'Glow' },
    { id: 'c', label: 'Reticle' },
  ];

  return (
    <>
      <div className={styles.hud}>
        <span>hotspots</span>
        {styleButtons.map((b) => (
          <button key={b.id} type="button" className={styles.hudBtn} data-active={style === b.id} onClick={() => setStyle(b.id)}>
            {b.label}
          </button>
        ))}
      </div>

      <div className={styles.modalScrim} data-open={contactOpen} onClick={() => setContactOpen(false)}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          <div className={styles.modalEyebrow}>▸ incoming transmission</div>
          <div className={styles.modalTitle}>Contact</div>
          <div className={styles.modalField}>
            <label htmlFor="nh-name">Name</label>
            <input id="nh-name" type="text" placeholder="Your name" />
          </div>
          <div className={styles.modalField}>
            <label htmlFor="nh-email">Email</label>
            <input id="nh-email" type="email" placeholder="name@example.com" />
          </div>
          <div className={styles.modalField}>
            <label htmlFor="nh-msg">Message</label>
            <textarea id="nh-msg" rows={4} placeholder="Leave a message…" />
          </div>
          <div className={styles.modalActions}>
            <button type="button" className={styles.modalSend} onClick={() => setContactOpen(false)}>Send</button>
            <button type="button" className={styles.modalClose} onClick={() => setContactOpen(false)}>Close</button>
          </div>
        </div>
      </div>
    </>
  );
}
