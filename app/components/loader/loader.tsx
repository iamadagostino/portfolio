import { HTMLAttributes, forwardRef } from 'react';
import { classes, cssProps } from '~/utils/style';

import { Text } from '~/components/text';
import styles from './loader.module.css';
import { useReducedMotion } from 'framer-motion';

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
  (
    { className, style, width = 32, height = 4, text = 'Loading...', center, ...rest },
    ref
  ) => {
    const reduceMotion = useReducedMotion();

    if (reduceMotion) {
      return (
        <Text className={classes(styles.text, className)} weight="medium" {...rest}>
          {text}
        </Text>
      );
    }

    return (
      <div
        ref={ref}
        className={classes(styles.loader, className)}
        data-center={center}
        {...rest}
        style={
          {
            '--width': `${width}px`,
            '--height': `${height}px`,
            ...style,
          } as React.CSSProperties
        }
      >
        <div className={styles.span} />
      </div>
    );
  }
);
