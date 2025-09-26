import { useEffect, useRef } from 'react';

import { useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { gsap } from 'gsap';

type ScrollManagerProps = {
  section: number;
  onSectionChange: (section: number) => void;
};

type ScrollState = ReturnType<typeof useScroll> & {
  scroll: { current: number };
};

export const ScrollManager = ({ section, onSectionChange }: ScrollManagerProps) => {
  const data = useScroll() as ScrollState;
  const lastScroll = useRef(0);
  const isAnimating = useRef(false);

  useEffect(() => {
    data.fill.classList.add('top-0', 'absolute');
  }, [data.fill]);

  useEffect(() => {
    gsap.to(data.el, {
      duration: 1,
      scrollTop: section * data.el.clientHeight,
      onStart: () => {
        isAnimating.current = true;
      },
      onComplete: () => {
        isAnimating.current = false;
      },
    });
  }, [data.el, section]);

  useFrame(() => {
    if (isAnimating.current) {
      lastScroll.current = data.scroll.current;
      return;
    }

    const currentSection = Math.floor(data.scroll.current * data.pages);
    if (data.scroll.current > lastScroll.current && currentSection === 0) {
      onSectionChange(1);
    }

    if (data.scroll.current < lastScroll.current && data.scroll.current < 1 / (data.pages - 1)) {
      onSectionChange(0);
    }

    lastScroll.current = data.scroll.current;
  });

  return null;
};
