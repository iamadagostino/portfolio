import { useEffect, useId, useRef, useState } from 'react';
import experienceHoverSvg from '~/assets/images/misc/3d-experience-hover.svg';
import experienceRevealSvg from '~/assets/images/misc/3d-experience-reveal.svg';
import experienceRollSvg from '~/assets/images/misc/3d-experience-roll.svg';
import { Button } from '~/components/button';
import styles from './3d-experience-toggle.module.css';

const CROSSFADE_DURATION_MS = 300;
const REVEAL_DURATION_MS = 1600;

export const ExperienceToggle = ({ isMobile, ...rest }) => {
  const id = useId();
  const svgId = `${id}-3d-experience`;

  const hoverTransitionRef = useRef(null);
  const fadeTimeoutRef = useRef(null);
  const visibilityDelayRef = useRef(null);

  const [currentIcon, setCurrentIcon] = useState(experienceRollSvg);
  const [previousIcon, setPreviousIcon] = useState(null);
  const [isCrossfading, setIsCrossfading] = useState(false);
  const [isCurrentVisible, setIsCurrentVisible] = useState(true);

  const clearHoverTransition = () => {
    if (hoverTransitionRef.current) {
      clearTimeout(hoverTransitionRef.current);
      hoverTransitionRef.current = null;
    }
  };

  const clearFadeTimeout = () => {
    if (fadeTimeoutRef.current) {
      clearTimeout(fadeTimeoutRef.current);
      fadeTimeoutRef.current = null;
    }
  };

  const cancelVisibilityDelay = () => {
    if (visibilityDelayRef.current) {
      clearTimeout(visibilityDelayRef.current);
      visibilityDelayRef.current = null;
    }
  };

  const crossFadeTo = (nextIcon) => {
    if (currentIcon === nextIcon) {
      return;
    }

    setPreviousIcon(currentIcon);
    setIsCrossfading(true);
    setCurrentIcon(nextIcon);
    setIsCurrentVisible(false);

    cancelVisibilityDelay();
    visibilityDelayRef.current = setTimeout(() => {
      setIsCurrentVisible(true);
      visibilityDelayRef.current = null;
    }, 16);

    clearFadeTimeout();
    fadeTimeoutRef.current = setTimeout(() => {
      setPreviousIcon(null);
      setIsCrossfading(false);
      clearFadeTimeout();
    }, CROSSFADE_DURATION_MS);
  };

  const handlePointerEnter = () => {
    clearHoverTransition();
    crossFadeTo(experienceRevealSvg);

    hoverTransitionRef.current = setTimeout(
      () => {
        crossFadeTo(experienceHoverSvg);
        hoverTransitionRef.current = null;
      },
      Math.round(REVEAL_DURATION_MS / 2)
    );
  };

  const handlePointerLeave = () => {
    clearHoverTransition();
    crossFadeTo(experienceRollSvg);
  };

  useEffect(
    () => () => {
      clearHoverTransition();
      clearFadeTimeout();
      cancelVisibilityDelay();
    },
    []
  );

  return (
    <Button
      iconOnly
      className={styles.toggle}
      data-mobile={isMobile}
      aria-label="Open 3D experience"
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onFocus={handlePointerEnter}
      onBlur={handlePointerLeave}
      {...rest}
    >
      <span className={`h-16 w-16 ${styles.iconWrapper}`}>
        {previousIcon ? (
          <img
            src={previousIcon}
            alt="3D Experience"
            aria-hidden="true"
            className={`${styles.icon} ${isCrossfading ? styles.iconHidden : styles.iconVisible}`}
          />
        ) : null}
        <img
          src={currentIcon}
          alt="3D Experience"
          className={`${styles.icon} ${isCurrentVisible ? styles.iconVisible : styles.iconHidden}`}
          id={svgId}
        />
      </span>
    </Button>
  );
};
