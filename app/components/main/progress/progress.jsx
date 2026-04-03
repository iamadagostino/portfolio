import { useEffect, useRef, useState } from 'react';
import { useNavigation } from 'react-router';
import styles from './progress.module.css';

export function Progress() {
  const [animationComplete, setAnimationComplete] = useState(false);
  const [visible, setVisible] = useState(false);
  const { state } = useNavigation();
  const progressRef = useRef();
  const timeout = useRef(0);

  useEffect(() => {
    clearTimeout(timeout.current);

    if (state !== 'idle') {
      timeout.current = setTimeout(() => {
        setVisible(true);
      }, 500);
    } else if (animationComplete) {
      timeout.current = setTimeout(() => {
        setVisible(false);
      }, 300);
    }
  }, [state, animationComplete]);

  useEffect(() => {
    if (!progressRef.current) return;

    if (state !== 'idle') {
      // Reset animation state when loading starts
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAnimationComplete(false);
      return;
    }

    const controller = new AbortController();

    Promise.all(progressRef.current.getAnimations({ subtree: true }).map((animation) => animation.finished)).then(
      () => {
        if (controller.signal.aborted) return;

        setAnimationComplete(true);
      }
    );

    return () => {
      controller.abort();
    };
  }, [state]);

  return (
    <div
      className={styles.progress}
      data-status={state}
      data-visible={visible}
      data-complete={animationComplete}
      ref={progressRef}
    />
  );
}
