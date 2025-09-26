import { HTMLAttributes, forwardRef, useCallback } from 'react';
import { classes } from '~/utils/style';

import { useReducedMotion } from 'framer-motion';
import { Text } from '~/components/text';
import styles from './loader.module.css';

interface LoaderProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  width?: number;
  height?: number;
  size?: number | 's' | 'm' | 'l' | 'xl';
  text?: string;
  center?: boolean;
}

export const Loader = forwardRef<HTMLDivElement, LoaderProps>(
  ({ className, width, height, size = 'm', text = 'Loading...', center, ...rest }, ref) => {
    const reduceMotion = useReducedMotion();

    // Determine size class based on size prop
    const sizeClass =
      typeof size === 'string' ? styles[`size${size.charAt(0).toUpperCase() + size.slice(1)}`] : styles.customSize;

    // Callback ref to set CSS custom properties without inline styles
    const setCustomProperties = useCallback(
      (element: HTMLDivElement | null) => {
        if (element && !reduceMotion && (width !== undefined || height !== undefined || typeof size === 'number')) {
          if (width !== undefined) {
            element.style.setProperty('--width', `${width}px`);
          }

          if (height !== undefined) {
            element.style.setProperty('--height', `${height}px`);
          }

          if (typeof size === 'number') {
            element.style.setProperty('--width', `${size}px`);
            element.style.setProperty('--height', `${Math.round(size / 8)}px`);
          }
        }

        // Forward the ref
        if (typeof ref === 'function') {
          ref(element);
        } else if (ref) {
          ref.current = element;
        }
      },
      [width, height, size, reduceMotion, ref]
    );

    if (reduceMotion) {
      return (
        <Text className={classes(styles.text, className)} weight="medium" {...rest}>
          {text}
        </Text>
      );
    }

    return (
      <div
        ref={setCustomProperties}
        className={classes(styles.loader, sizeClass, className)}
        data-center={center}
        {...rest}
      >
        <div className={styles.span} />
      </div>
    );
  }
);
