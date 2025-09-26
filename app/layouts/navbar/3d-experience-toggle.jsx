import { Player } from '@lordicon/react/dist/player.js';
import { createRef, useEffect, useMemo, useRef, useState } from 'react';
import experienceHoverPinchAnimation from '~/assets/images/anim/json/3d-hover-pinch.json';
import experienceHoverRollAnimation from '~/assets/images/anim/json/3d-hover-roll.json';
import experienceRevealAnimation from '~/assets/images/anim/json/3d-reveal.json';
import { Button } from '~/components/main/button';
import { useTheme } from '~/components/main/theme-provider/theme-provider';
import { themes, tokens } from '~/config/theme.mjs';
import styles from './3d-experience-toggle.module.css';

const CROSSFADE_DURATION_MS = 300;

const getAnimationDuration = (animation) => {
  if (!animation || typeof animation !== 'object') {
    return 1500;
  }

  const { fr = 60, ip = 0, op = 0 } = animation;
  if (!fr) {
    return 1500;
  }

  return Math.round(((op - ip) / fr) * 1000);
};

const animationDurations = {
  reveal: getAnimationDuration(experienceRevealAnimation),
  roll: getAnimationDuration(experienceHoverRollAnimation),
  pinch: getAnimationDuration(experienceHoverPinchAnimation),
};

const iconDataMap = {
  reveal: experienceRevealAnimation,
  roll: experienceHoverRollAnimation,
  pinch: experienceHoverPinchAnimation,
};

const buildColorString = (primary, accent) => `primary:${primary},secondary:${accent},stroke:${accent}`;

const FALLBACK_PRIMARY = '#ffffff';
const FALLBACK_ACCENT = '#0A84FF';

const PRIMARY_WHITE = tokens?.base?.whiteHex ?? FALLBACK_PRIMARY;
const DARK_ACCENT = themes?.dark?.accentHex ?? FALLBACK_ACCENT;
const LIGHT_PRIMARY = themes?.light?.primaryHex ?? FALLBACK_PRIMARY;
const LIGHT_ACCENT = themes?.light?.accentHex ?? FALLBACK_ACCENT;

const iconColorsByTheme = {
  dark: buildColorString(PRIMARY_WHITE, DARK_ACCENT),
  light: buildColorString(LIGHT_PRIMARY, LIGHT_ACCENT),
};

export const ExperienceToggle = ({ isMobile, ...rest }) => {
  const { theme } = useTheme();
  const iconColors = iconColorsByTheme[theme] ?? iconColorsByTheme.dark;
  const playerRefs = useMemo(
    () => ({
      reveal: createRef(),
      roll: createRef(),
      pinch: createRef(),
    }),
    []
  );

  const clickResetRef = useRef(null);
  const fadeTimeoutRef = useRef(null);
  const visibilityDelayRef = useRef(null);
  const isHoveredRef = useRef(false);

  const [currentIcon, setCurrentIcon] = useState('reveal');
  const [previousIcon, setPreviousIcon] = useState(null);
  const [isCrossfading, setIsCrossfading] = useState(false);
  const [isCurrentVisible, setIsCurrentVisible] = useState(true);

  const clearClickReset = () => {
    if (clickResetRef.current) {
      clearTimeout(clickResetRef.current);
      clickResetRef.current = null;
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
    isHoveredRef.current = true;
    clearClickReset();
    crossFadeTo('roll');
  };

  const handlePointerLeave = () => {
    isHoveredRef.current = false;
    clearClickReset();
    crossFadeTo('reveal');
  };

  const handleClick = () => {
    clearClickReset();
    if (currentIcon === 'pinch') {
      playerRefs.pinch?.current?.playFromBeginning?.();
    } else {
      crossFadeTo('pinch');
    }

    const resetDelay = Math.max(0, animationDurations.pinch);

    clickResetRef.current = setTimeout(() => {
      crossFadeTo(isHoveredRef.current ? 'roll' : 'reveal');
      clickResetRef.current = null;
    }, resetDelay);
  };

  useEffect(
    () => () => {
      clearClickReset();
      clearFadeTimeout();
      cancelVisibilityDelay();
    },
    []
  );

  useEffect(() => {
    const player = playerRefs[currentIcon]?.current;
    player?.playFromBeginning?.();
  }, [currentIcon, playerRefs, theme]);

  return (
    <Button
      iconOnly
      className={styles.toggle}
      data-mobile={isMobile}
      aria-label="Open 3D experience"
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onClick={handleClick}
      onFocus={handlePointerEnter}
      onBlur={handlePointerLeave}
      {...rest}
    >
      <span className={`h-16 w-16 ${styles.iconWrapper}`}>
        {previousIcon ? (
          <span
            role="img"
            aria-hidden="true"
            className={`${styles.icon} ${isCrossfading ? styles.iconHidden : styles.iconVisible}`}
          >
            <Player ref={playerRefs[previousIcon]} icon={iconDataMap[previousIcon]} colors={iconColors} />
          </span>
        ) : null}
        <span
          role="img"
          aria-label="3D Experience"
          className={`${styles.icon} ${isCurrentVisible ? styles.iconVisible : styles.iconHidden}`}
        >
          <Player ref={playerRefs[currentIcon]} icon={iconDataMap[currentIcon]} colors={iconColors} />
        </span>
      </span>
    </Button>
  );
};
