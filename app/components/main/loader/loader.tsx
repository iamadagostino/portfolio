import { HTMLAttributes, forwardRef, useEffect } from 'react';
import { classes } from '~/utils/style';

import { useReducedMotion } from 'framer-motion';
import { Text } from '~/components/main/text';
import styles from './loader.module.css';

interface LoaderProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  style?: React.CSSProperties;
  width?: number;
  height?: number;
  size?: number | 's' | 'm' | 'l' | 'xl';
  text?: string;
  center?: boolean;
}

export const Loader = forwardRef<HTMLDivElement, LoaderProps>(
  ({ className, width = 32, height = 4, text = 'Loading...', center, ...rest }, ref) => {
    const reduceMotion = useReducedMotion();

    // Create a dynamic class that sets CSS variables for width/height so we avoid inline styles
    const sizeClass = `loader-size-${Math.round(width)}-${Math.round(height)}`;

    useEffect(() => {
      // Only run in the browser
      if (typeof document === 'undefined') return;

      const styleId = `style-${sizeClass}`;
      if (document.getElementById(styleId)) return;

      const css = `.${sizeClass} { --width: ${Math.round(width)}px; --height: ${Math.round(height)}px; }`;
      const styleEl = document.createElement('style');
      styleEl.id = styleId;
      styleEl.textContent = css;
      document.head.appendChild(styleEl);
    }, [sizeClass, width, height]);

    if (reduceMotion) {
      return (
        <Text className={classes(styles.text, className)} weight="medium" {...rest}>
          {text}
        </Text>
      );
    }

    return (
      <div ref={ref} className={classes(styles.loader, className, sizeClass)} data-center={center} {...rest}>
        <div className={styles.span} />
      </div>
    );
  }
);
