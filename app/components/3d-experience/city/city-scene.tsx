import cityUrl from '@/assets/models/cities/future-city.glb';
import deloreanUrl from '@/assets/models/cars/flying-delorean.glb';
import styles from './city-scene.module.css';

import { Environment, Html, OrbitControls, useGLTF } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Box3, Group, MathUtils, Mesh, MeshStandardMaterial, Object3D, Vector3 } from 'three';

const DRACO_PATH = '/static/vendor/draco/';

const CITY_TARGET = 900;
const DELOREAN_LEN = 7;
const CAR_RADIUS = 3.2; // collision padding around the car
const BORDER_MARGIN = 45; // keep this far inside the city edge (locked borders)

// Flight tuning
const TURN_RATE = 1.35;
const ACCEL = 70;
const LIFT = 55;
const DRAG = 0.9;
const MAX_SPEED = 62;
const MIN_ALT = 4;
const CEILING_FALLBACK = 340;
const MODEL_YAW_OFFSET = 0; // rear faces the chase cam

// Chase camera
const CAM_DIST = 20;
const CAM_HEIGHT = 8;

// Offices
const ENTER_RADIUS = 80;

// Entry choreography: forward → rotate → charge the viewer
const TRANSITION_DUR = 2.6;
const ENTRY_FWD_DIST = 46;
const ENTRY_RISE = 14;
const ENTRY_P1 = 0.28; // end of "drive forward"
const ENTRY_P2 = 0.52; // end of "rotate 180 to face the lens"

const UP = new Vector3(0, 1, 0);
const DEBUG_ORBIT = false;

const smooth = (x: number) => x * x * (3 - 2 * x);

// ── Offices ──
type OfficeDest = { kind: 'room'; section: number } | { kind: 'blog' };
type Office = { id: string; label: string; x: number; z: number; top: number; dest: OfficeDest };
const OFFICES: Office[] = [
  { id: 'projects', label: 'PROJECTS', x: 385, z: 161, top: 150, dest: { kind: 'room', section: 2 } },
  { id: 'about', label: 'ABOUT', x: 270, z: 22, top: 150, dest: { kind: 'room', section: 1 } },
  { id: 'blog', label: 'BLOG', x: 274, z: -50, top: 150, dest: { kind: 'blog' } },
  { id: 'contact', label: 'CONTACT', x: 277, z: -136, top: 150, dest: { kind: 'room', section: 3 } },
];

// ── Shared game-loop state ──
const deloreanWorld = new Vector3();
const _dummy = new Object3D();
const _probe = new Vector3();
const _camTarget = new Vector3();
let requestedOffice: Office | null = null;
let cityBounds = { minX: -450, maxX: 450, minZ: -450, maxZ: 450 };
let worldCeiling = CEILING_FALLBACK; // max altitude (top of the skyline) — locked world limit
let buildingBoxes: Box3[] = []; // pre-expanded AABBs for collision

function collides(p: Vector3): boolean {
  for (let i = 0; i < buildingBoxes.length; i++) {
    if (buildingBoxes[i].containsPoint(p)) return true;
  }
  return false;
}

// ── Atoms bridging the R3F loop and the DOM overlay ──
export const nearOfficeAtom = atom<Office | null>(null);
export const cityFlashAtom = atom(false);
export const navRequestAtom = atom<Office | null>(null);
export const posReadoutAtom = atom<string | null>(null); // press P → shows current pos/yaw

function useKeys() {
  const keys = useRef<Record<string, boolean>>({});
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      keys.current[e.code] = true;
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) e.preventDefault();
    };
    const up = (e: KeyboardEvent) => {
      keys.current[e.code] = false;
    };
    window.addEventListener('keydown', down, { passive: false });
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);
  return keys;
}

/** Detect the site's dark/light theme (cyberpunk night vs day city). */
function useIsDark() {
  const [dark, setDark] = useState(true);
  useEffect(() => {
    const read = () => {
      // theme-provider applies body[data-theme='dark'|'light']
      const t = document.body.getAttribute('data-theme') || document.documentElement.getAttribute('data-theme');
      if (t === 'dark') return true;
      if (t === 'light') return false;
      return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? true;
    };
    const update = () => setDark(read());
    update();
    const obs = new MutationObserver(update);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    obs.observe(document.body, { attributes: true, attributeFilter: ['data-theme'] });
    const mq = window.matchMedia?.('(prefers-color-scheme: dark)');
    mq?.addEventListener?.('change', update);
    return () => {
      obs.disconnect();
      mq?.removeEventListener?.('change', update);
    };
  }, []);
  return dark;
}

function useNormalizedModel(url: string, targetSize: number, mode: 'horizontal' | 'max', groundToZero: boolean) {
  const { scene } = useGLTF(url, DRACO_PATH);
  return useMemo(() => {
    const root = scene.clone(true);
    const box = new Box3().setFromObject(root);
    const size = box.getSize(new Vector3());
    const center = box.getCenter(new Vector3());
    const basis = mode === 'horizontal' ? Math.max(size.x, size.z) : Math.max(size.x, size.y, size.z);
    const scale = targetSize / (basis || 1);
    const inner = new Group();
    inner.add(root);
    root.position.set(-center.x, -center.y, -center.z);
    inner.scale.setScalar(scale);
    if (groundToZero) inner.position.y = (size.y / 2) * scale;
    return inner;
  }, [scene, targetSize, mode, groundToZero]);
}

function City() {
  const model = useNormalizedModel(cityUrl, CITY_TARGET, 'horizontal', true);
  useEffect(() => {
    const box = new Box3().setFromObject(model);
    // building AABBs → collision (skip small props / thin poles)
    const boxes: Box3[] = [];
    const size = new Vector3();
    let downtown: Box3 | null = null;
    model.traverse((o) => {
      const mesh = o as Mesh;
      if (!mesh.isMesh) return;

      // Make the city's neon (incl. the dim teal road arrows) glow + bloom everywhere.
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      for (const mat of mats as MeshStandardMaterial[]) {
        if (mat?.emissive) {
          const maxE = Math.max(mat.emissive.r, mat.emissive.g, mat.emissive.b);
          if (maxE > 0.001) {
            mat.toneMapped = false;
            if (maxE < 0.35) mat.emissiveIntensity = 9; // lift dim neon over the bloom threshold
          }
        }
      }

      const b = new Box3().setFromObject(o);
      b.getSize(size);
      // Buildings are tall (their facades split into thin panels), so key on HEIGHT.
      // Skip flat ground/water (low y) and any giant single slab (huge footprint).
      if (size.y > 25 && Math.max(size.x, size.z) < 180) {
        boxes.push(b.clone().expandByScalar(CAR_RADIUS));
        downtown = downtown ? downtown.union(b) : b.clone();
      }
    });
    buildingBoxes = boxes;
    // Locked borders: hug the downtown cluster (+ street margin), clamped to the platform.
    if (downtown) {
      const dt = downtown as Box3;
      const d = dt.clone().expandByScalar(120);
      cityBounds = {
        minX: Math.max(d.min.x, box.min.x),
        maxX: Math.min(d.max.x, box.max.x),
        minZ: Math.max(d.min.z, box.min.z),
        maxZ: Math.min(d.max.z, box.max.z),
      };
      worldCeiling = dt.max.y + 30; // just above the tallest tower — can't fly out of the world
    } else {
      cityBounds = { minX: box.min.x, maxX: box.max.x, minZ: box.min.z, maxZ: box.max.z };
      worldCeiling = box.max.y;
    }
  }, [model]);
  return <primitive object={model} />;
}

function OfficeMarker({ office }: { office: Office }) {
  const near = useAtomValue(nearOfficeAtom);
  const active = near?.id === office.id;
  return (
    <group position={[office.x, 0, office.z]}>
      <mesh rotation-x={-Math.PI / 2} position={[0, 1, 0]}>
        <torusGeometry args={[6, 0.4, 12, 48]} />
        <meshStandardMaterial emissive={'#5cc8ff'} emissiveIntensity={active ? 5 : 2.4} color={0x000000} toneMapped={false} />
      </mesh>
      <mesh position={[0, office.top / 2, 0]}>
        <cylinderGeometry args={[0.6, 0.6, office.top, 10]} />
        <meshBasicMaterial color={active ? '#ffd15c' : '#5cc8ff'} transparent opacity={active ? 0.55 : 0.3} toneMapped={false} depthWrite={false} />
      </mesh>
      <Html position={[0, office.top, 0]} center zIndexRange={[20, 0]} style={{ pointerEvents: 'none' }}>
        <div
          className={`${styles.office} ${active ? styles.officeActive : ''}`}
          onClick={() => {
            if (active) requestedOffice = office;
          }}
        >
          <span className={styles.officeLabel}>{office.label}</span>
          <span className={styles.officeSub}>{active ? '▸ click / press E' : 'office'}</span>
        </div>
      </Html>
    </group>
  );
}

/** Collect the DeLorean's built-in emissive parts: the reactor (accelerate) and tail lights (brake). */
function collectCarFx(model: Group) {
  const reactor = new Set<MeshStandardMaterial>();
  const brake = new Set<MeshStandardMaterial>();
  model.traverse((o) => {
    const mesh = o as Mesh;
    if (!mesh.isMesh) return;
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (const mat of mats as MeshStandardMaterial[]) {
      const n = mat?.name || '';
      if (/yellow plastic|orange plastic|#2146/i.test(n)) reactor.add(mat);
      if (/08 - default|orange brakes|red plastic/i.test(n)) brake.add(mat);
    }
  });
  // give the non-emissive plastics a warm/red emissive colour so intensity can ramp them
  reactor.forEach((m) => {
    if (m.emissive && m.emissive.getHex() === 0) m.emissive.setHex(0xffb020);
    m.toneMapped = false;
  });
  brake.forEach((m) => {
    if (m.emissive && m.emissive.getHex() === 0 && !m.emissiveMap) m.emissive.setHex(0xff1418);
    m.toneMapped = false;
  });
  return { reactor: [...reactor], brake: [...brake] };
}

type Trans = {
  active: boolean;
  t: number;
  office: Office | null;
  flashed: boolean;
  navigated: boolean;
  startPos: Vector3;
  startFwd: Vector3;
  startQuat: import('three').Quaternion | null;
  forwardPoint: Vector3;
  faceQuat: import('three').Quaternion | null;
  through: Vector3;
};

function DeloreanRig() {
  const keys = useKeys();
  const model = useNormalizedModel(deloreanUrl, DELOREAN_LEN, 'max', false);
  const vehicle = useRef<Group>(null);
  const camera = useThree((s) => s.camera);
  const controls = useThree((s) => s.controls) as { target: Vector3; enabled: boolean } | null;

  // The car's own reactor + tail-light materials (brighten on accelerate / brake).
  const carFx = useMemo(() => collectCarFx(model), [model]);

  const setNearOffice = useSetAtom(nearOfficeAtom);
  const setFlash = useSetAtom(cityFlashAtom);
  const setNav = useSetAtom(navRequestAtom);
  const setPosReadout = useSetAtom(posReadoutAtom);
  const didInit = useRef(false);
  const pLogged = useRef(false);

  const state = useRef({ pos: new Vector3(170, 25, 200), yaw: -3.18, speed: 0, vSpeed: 0, bank: 0, reactor: 0, brake: 0 });
  const trans = useRef<Trans>({
    active: false,
    t: 0,
    office: null,
    flashed: false,
    navigated: false,
    startPos: new Vector3(),
    startFwd: new Vector3(),
    startQuat: null,
    forwardPoint: new Vector3(),
    faceQuat: null,
    through: new Vector3(),
  });
  const nearId = useRef<string | null>(null);


  useFrame((_, rawDelta) => {
    const dt = Math.min(rawDelta, 0.05);
    const k = keys.current;
    const s = state.current;
    const v = vehicle.current;
    if (DEBUG_ORBIT || !v) return;

    // ── Entry: drive forward → rotate → charge the lens ──
    if (trans.current.active) {
      const tr = trans.current;
      tr.t += dt;
      const t = Math.min(tr.t / TRANSITION_DUR, 1);
      if (t < ENTRY_P1) {
        const e = smooth(t / ENTRY_P1);
        s.pos.copy(tr.startPos).addScaledVector(tr.startFwd, ENTRY_FWD_DIST * e).addScaledVector(UP, ENTRY_RISE * e);
        if (tr.startQuat) v.quaternion.copy(tr.startQuat);
      } else if (t < ENTRY_P2) {
        const e = smooth((t - ENTRY_P1) / (ENTRY_P2 - ENTRY_P1));
        s.pos.copy(tr.forwardPoint);
        if (tr.startQuat && tr.faceQuat) v.quaternion.copy(tr.startQuat).slerp(tr.faceQuat, e);
      } else {
        const e = smooth((t - ENTRY_P2) / (1 - ENTRY_P2));
        s.pos.copy(tr.forwardPoint).lerp(tr.through, e);
        if (tr.faceQuat) v.quaternion.copy(tr.faceQuat);
        v.scale.setScalar(1 + e * e * 8);
      }
      v.position.copy(s.pos);
      if (t > 0.86 && !tr.flashed) {
        tr.flashed = true;
        setFlash(true);
      }
      if (t >= 1 && !tr.navigated) {
        tr.navigated = true;
        setNav(tr.office);
      }
      return;
    }

    // ── Flight ──
    const turn = (k.KeyA || k.ArrowLeft ? 1 : 0) - (k.KeyD || k.ArrowRight ? 1 : 0);
    const thrust = (k.KeyW || k.ArrowUp ? 1 : 0) - (k.KeyS || k.ArrowDown ? 1 : 0);
    const lift = (k.Space ? 1 : 0) - (k.ShiftLeft || k.ShiftRight ? 1 : 0);

    s.yaw += turn * TURN_RATE * dt;
    const fwd = new Vector3(Math.sin(s.yaw), 0, Math.cos(s.yaw));

    s.speed += thrust * ACCEL * dt;
    s.speed *= Math.pow(DRAG, dt * 6);
    s.speed = MathUtils.clamp(s.speed, -MAX_SPEED * 0.5, MAX_SPEED);
    s.vSpeed += lift * LIFT * dt;
    s.vSpeed *= Math.pow(0.35, dt * 6);

    // Car's own lights: reactor glows on accelerate (W), tail lights glow on brake (S).
    s.reactor = MathUtils.lerp(s.reactor, thrust > 0 ? 1 : 0, 0.14);
    s.brake = MathUtils.lerp(s.brake, thrust < 0 ? 1 : 0, 0.2);
    for (const m of carFx.reactor) m.emissiveIntensity = 0.35 + s.reactor * 3.6;
    for (const m of carFx.brake) m.emissiveIntensity = 0.4 + s.brake * 3.8;

    // resolve movement with locked borders + building collision (axis-separated for sliding)
    const prevX = s.pos.x;
    const prevY = s.pos.y;
    const prevZ = s.pos.z;
    const newY = MathUtils.clamp(prevY + s.vSpeed * dt, MIN_ALT, worldCeiling);
    s.pos.y = newY;

    s.pos.x = MathUtils.clamp(prevX + fwd.x * s.speed * dt, cityBounds.minX + BORDER_MARGIN, cityBounds.maxX - BORDER_MARGIN);
    _probe.set(s.pos.x, newY, prevZ);
    if (collides(_probe)) s.pos.x = prevX;

    s.pos.z = MathUtils.clamp(prevZ + fwd.z * s.speed * dt, cityBounds.minZ + BORDER_MARGIN, cityBounds.maxZ - BORDER_MARGIN);
    _probe.set(s.pos.x, newY, s.pos.z);
    if (collides(_probe)) s.pos.z = prevZ;

    // block descending into a building
    _probe.set(s.pos.x, s.pos.y, s.pos.z);
    if (collides(_probe)) {
      s.pos.y = prevY;
      s.vSpeed = Math.max(s.vSpeed, 0);
    }

    s.bank = MathUtils.lerp(s.bank, -turn * 0.45, 0.12);
    v.position.copy(s.pos);
    v.rotation.set(0, s.yaw + MODEL_YAW_OFFSET, s.bank);
    deloreanWorld.copy(s.pos);

    // camera: OrbitControls (mouse/finger) orbit around the car, target follows it
    if (controls) {
      if (!didInit.current) {
        didInit.current = true;
        camera.position.set(s.pos.x, s.pos.y + 15, s.pos.z + 30); // close chase behind (+z) + above
        controls.target.set(s.pos.x, s.pos.y + 3, s.pos.z);
      } else {
        _camTarget.set(s.pos.x, s.pos.y + 3, s.pos.z);
        controls.target.lerp(_camTarget, 0.3);
      }
    }

    // press P → report position/yaw (for choosing a spawn)
    if (k.KeyP && !pLogged.current) {
      pLogged.current = true;
      const msg = `pos [${s.pos.x.toFixed(0)}, ${s.pos.y.toFixed(0)}, ${s.pos.z.toFixed(0)}]  yaw ${s.yaw.toFixed(2)}`;
      setPosReadout(msg);
      // eslint-disable-next-line no-console
      console.log('[CITY] ' + msg);
    } else if (!k.KeyP) {
      pLogged.current = false;
    }

    // nearest enterable office
    let best: Office | null = null;
    let bestD = ENTER_RADIUS;
    for (const o of OFFICES) {
      const d = Math.hypot(s.pos.x - o.x, s.pos.z - o.z);
      if (d < bestD) {
        bestD = d;
        best = o;
      }
    }
    if ((best?.id ?? null) !== nearId.current) {
      nearId.current = best?.id ?? null;
      setNearOffice(best);
    }

    // enter trigger
    if (!requestedOffice && best && (k.KeyE || k.Enter || k.NumpadEnter)) requestedOffice = best;
    if (requestedOffice) {
      const fwd0 = new Vector3(Math.sin(s.yaw), 0, Math.cos(s.yaw));
      const startPos = s.pos.clone();
      const forwardPoint = startPos.clone().addScaledVector(fwd0, ENTRY_FWD_DIST).addScaledVector(UP, ENTRY_RISE);
      const cam = camera.position.clone();
      _dummy.position.copy(forwardPoint);
      _dummy.lookAt(cam);
      _dummy.rotateY(Math.PI);
      const through = cam.clone().addScaledVector(cam.clone().sub(forwardPoint).normalize(), 14);
      trans.current = {
        active: true,
        t: 0,
        office: requestedOffice,
        flashed: false,
        navigated: false,
        startPos,
        startFwd: fwd0,
        startQuat: v.quaternion.clone(),
        forwardPoint,
        faceQuat: _dummy.quaternion.clone(),
        through,
      };
      requestedOffice = null;
      setNearOffice(null);
      if (controls) controls.enabled = false; // cinematic owns the camera during entry
    }
  });

  return (
    <group ref={vehicle}>
      <primitive object={model} />
    </group>
  );
}

export function CityScene() {
  const isDark = useIsDark();

  const bg = isDark ? '#05060c' : '#aebfd6';
  const neonLights: { pos: [number, number, number]; color: string }[] = [
    { pos: [300, 90, 60], color: '#ff2e88' },
    { pos: [350, 70, -40], color: '#2ff3ff' },
    { pos: [270, 120, 130], color: '#8a5cff' },
    { pos: [380, 60, 150], color: '#ff2e88' },
    { pos: [277, 80, -120], color: '#2ff3ff' },
  ];

  return (
    <>
      <color attach="background" args={[bg]} />
      <fog attach="fog" args={[bg, isDark ? 70 : 160, isDark ? 900 : 1500]} />

      {isDark ? (
        <>
          <hemisphereLight args={['#3a4a7a', '#05060c', 0.35]} />
          <directionalLight position={[120, 260, 80]} intensity={0.5} color={'#8fb0ff'} />
          {neonLights.map((n, i) => (
            <pointLight key={i} position={n.pos} color={n.color} distance={520} intensity={520} decay={1.6} />
          ))}
          <Environment preset="night" environmentIntensity={0.25} />
        </>
      ) : (
        <>
          <hemisphereLight args={['#cfe0ff', '#6a7690', 1.1]} />
          <directionalLight position={[160, 300, 140]} intensity={2.6} color={'#fff3da'} />
          <directionalLight position={[-160, 120, -140]} intensity={0.7} color={'#9fb6ff'} />
          <Environment preset="city" environmentIntensity={0.7} />
        </>
      )}

      {/* explore with mouse/fingers, bounded so you can't leave the scene */}
      <OrbitControls
        makeDefault
        enablePan={false}
        enableDamping
        dampingFactor={0.1}
        minDistance={9}
        maxDistance={52}
        minPolarAngle={0.25}
        maxPolarAngle={1.5}
        rotateSpeed={0.6}
        zoomSpeed={0.8}
      />

      <City />
      <DeloreanRig />
      {OFFICES.map((o) => (
        <OfficeMarker key={o.id} office={o} />
      ))}

      <EffectComposer>
        <Bloom
          mipmapBlur
          intensity={isDark ? 1.5 : 0.35}
          luminanceThreshold={isDark ? 0.15 : 0.9}
          luminanceSmoothing={0.2}
          radius={0.75}
        />
      </EffectComposer>
    </>
  );
}

export function CityOverlay() {
  const near = useAtomValue(nearOfficeAtom);
  const flash = useAtomValue(cityFlashAtom);
  const nav = useAtomValue(navRequestAtom);
  const posReadout = useAtomValue(posReadoutAtom);
  const navigate = useNavigate();
  const { lang } = useParams();

  useEffect(() => {
    if (!nav) return;
    const lng = lang ?? 'en-US';
    const isIt = lng.startsWith('it');
    let dest: string;
    if (nav.dest.kind === 'blog') {
      dest = `/${lng}/${isIt ? 'articoli' : 'articles'}`;
    } else {
      const room = isIt ? 'esperienza-3d/stanza' : '3d-experience/room';
      dest = `/${lng}/${room}?section=${nav.dest.section}`;
    }
    const timer = setTimeout(() => navigate(dest), 120);
    return () => clearTimeout(timer);
  }, [nav, navigate, lang]);

  return (
    <>
      {near && (
        <div className={styles.enterPrompt}>
          ▸ {near.label} OFFICE — click the marker or press <b>E</b> to enter
        </div>
      )}
      {posReadout && <div className={styles.posReadout}>{posReadout}</div>}
      <div className={styles.flash} data-on={flash} />
    </>
  );
}

useGLTF.preload(cityUrl, DRACO_PATH);
useGLTF.preload(deloreanUrl, DRACO_PATH);
