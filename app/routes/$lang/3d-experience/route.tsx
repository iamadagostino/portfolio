import { Canvas } from '@react-three/fiber';
import { config } from 'dotenv';
import { MotionConfig } from 'framer-motion';
import { Suspense, useEffect, useState } from 'react';
import { Cursor } from '~/components/3d-experience/partials/cursor';
import { Menu } from '~/components/3d-experience/partials/menu';
import { framerMotionConfig } from '~/config/framer-motion';
import { baseMeta } from '~/utils/meta';
import styles from './3d-experience.module.css';
import Scene from './scene';

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
  const [section, setSection] = useState(0);
  const [menuOpened, setMenuOpened] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [enabledAmbientMusic, setEnabledAmbientMusic] = useState(false);

  // Set menuOpened to false when section changes
  useEffect(() => {
    setMenuOpened(false);
  }, [section]);

  return (
    <div className={styles.experience}>
      <Suspense fallback={null}>
        {/* 3D Canvas */}
        <Canvas shadows>
          <Scene />
          {/* <ScrollControls pages={4} damping={0.1}>
              <ScrollManager section={section} onSectionChange={setSection} />
              <Scroll>
                <Experience darkMode={darkMode} menuOpened={menuOpened} />
              </Scroll>
              <Scroll html>
                <div className="no-scrollbar">
                  <Interface setSection={setSection} />
                </div>
              </Scroll>
            </ScrollControls> */}
        </Canvas>
      </Suspense>

      <MotionConfig transition={framerMotionConfig}>
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
      </MotionConfig>
    </div>
  );
}

export default App3dExperience;
