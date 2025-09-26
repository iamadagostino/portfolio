import { Scroll, ScrollControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { config } from 'dotenv';
import { MotionConfig } from 'framer-motion';
import { Leva } from 'leva';
import { useEffect, useState } from 'react';
import { Interface } from '~/components/3d-experience/interface';
import { Cursor } from '~/components/3d-experience/partials/cursor';
import { Menu } from '~/components/3d-experience/partials/menu';
import { ScrollManager } from '~/components/3d-experience/partials/scrollManager';
import { Experience } from '~/components/3d-experience/scene/experience';
import { framerMotionConfig } from '~/config/framer-motion';
import { baseMeta } from '~/utils/meta';
import styles from './3d-experience.module.css';

export const handle = {
  layout: '3d-experience',
};

export const meta = () => {
  return baseMeta({
    title: '3D Experience',
    description: `${config.name} · 3D experience overview page`,
  });
};

function App3dExperience() {
  const [isClient, setIsClient] = useState(false);
  const [section, setSection] = useState(0);
  const [menuOpened, setMenuOpened] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [enabledAmbientMusic, setEnabledAmbientMusic] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Set menuOpened to false when section changes
  useEffect(() => {
    setMenuOpened(false);
  }, [section]);

  if (!isClient) {
    return <div className={styles.experience} />;
  }

  return (
    <div className={styles.experience}>
      {/* Motion Config */}
      <MotionConfig transition={framerMotionConfig}>
        {/* Canvas */}
        <Canvas>
          {/* Default Color: slate-50 (#f8fafc) */}
          <color attach="background" args={['#f8fafc']} />
          {/* Scroll Controls */}
          <ScrollControls pages={4} damping={0.1}>
            {/* Scroll Manager */}
            <ScrollManager section={section} onSectionChange={setSection} />
            {/* Scroll Areas */}
            <Scroll>
              {/* Experience */}
              <Experience darkMode={darkMode} menuOpened={menuOpened} />
            </Scroll>
            <Scroll html>
              <div className="no-scrollbar">
                {/* Interface */}
                <Interface setSection={setSection} />
              </div>
            </Scroll>
          </ScrollControls>
        </Canvas>

        {/* Menu */}
        <Menu
          setSection={setSection}
          menuOpened={menuOpened}
          setMenuOpened={setMenuOpened}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          enabledAmbientMusic={enabledAmbientMusic}
          setEnabledAmbientMusic={setEnabledAmbientMusic}
        />

        {/* Cursor */}
        <Cursor />

        {/* Leva */}
        <Leva hidden />
      </MotionConfig>
    </div>
  );
}

export default App3dExperience;
