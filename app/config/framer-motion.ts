import type { Transition } from 'framer-motion';

export const framerMotionConfig: Transition = {
  type: 'spring',
  mass: 0.5,
  stiffness: 50,
  damping: 100,
  restDelta: 0.0001,
};
