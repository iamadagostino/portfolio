import { CityOverlay, CityScene } from '@/components/3d-experience/city/city-scene';
import appConfig from '@/config/app.json';
import { baseMeta } from '@/utils/meta';
import { Loader } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useEffect, useState, Suspense } from 'react';
import styles from './city.module.css';

export const handle = {
  layout: '3d-experience',
};

export const meta = () => {
  return baseMeta({
    title: '3D City',
    description: `${appConfig.name} · fly the DeLorean through the city`,
  });
};

/** Little BTTF flux-capacitor HUD with racing lights. */
function FluxCapacitor() {
  return (
    <div className={styles.flux} title="Flux Capacitor">
      <div className={styles.fluxCore} />
      {[0, 1, 2].map((arm) => (
        <div key={arm} className={styles.fluxArm} style={{ transform: `rotate(${arm * 120}deg)` }}>
          {[0, 1, 2].map((dot) => (
            <i key={dot} style={{ animationDelay: `${(2 - dot) * 0.14 + arm * 0.05}s` }} />
          ))}
        </div>
      ))}
    </div>
  );
}

export default function CityExperience() {
  // Day/night toggle — flips body[data-theme], which both the site tokens and the 3D scene observe.
  const [dark, setDark] = useState(true);
  useEffect(() => {
    setDark((document.body.getAttribute('data-theme') ?? 'dark') !== 'light');
  }, []);
  const toggleTheme = () => {
    const next = dark ? 'light' : 'dark';
    document.body.setAttribute('data-theme', next);
    document.documentElement.setAttribute('data-theme', next);
    setDark(!dark);
  };

  return (
    <div className={styles.root}>
      <Canvas dpr={[1, 2]} gl={{ toneMappingExposure: 0.95 }} camera={{ fov: 55, near: 0.5, far: 6000, position: [170, 40, 232] }}>
        <Suspense fallback={null}>
          <CityScene />
        </Suspense>
      </Canvas>

      <div className={styles.title}>
        <div className={styles.k}>NEO CITY</div>
        <div className={styles.v}>Flight system online</div>
      </div>

      <div className={styles.cornerHud}>
        <FluxCapacitor />
        <button type="button" className={styles.themeBtn} onClick={toggleTheme} title="Toggle day / night" aria-label="Toggle day / night">
          {dark ? '☾' : '☀'}
        </button>
      </div>

      <div className={styles.hud}>
        <div className={styles.eyebrow}>▸ flight controls</div>
        <div className={styles.keys}>
          <span><b>W</b><b>S</b>thrust</span>
          <span><b>A</b><b>D</b>steer</span>
          <span><b>Space</b>ascend</span>
          <span><b>Shift</b>descend</span>
          <span><b>E</b>enter office</span>
          <span><b>drag</b>look</span>
          <span><b>P</b>log position</span>
        </div>
      </div>

      <CityOverlay />

      <Loader
        containerStyles={{ background: '#05060c' }}
        barStyles={{ background: '#3d78ff', height: '3px' }}
        dataStyles={{ fontFamily: 'Chakra Petch, system-ui, sans-serif', letterSpacing: '0.2em', color: '#8aa0b8' }}
      />
    </div>
  );
}
