import { classes } from '~/utils/style';
import { forwardRef } from 'react';
import sprites from './icons.svg';
import styles from './icon.module.css';

interface IconProps {
  icon: string;
  className?: string;
  size?: number | undefined;
  [key: string]: unknown;
}

export const Icon = forwardRef<SVGSVGElement, IconProps>(
  ({ icon, className, size, ...rest }, ref) => {
    return (
      <svg
        aria-hidden
        ref={ref}
        className={classes(styles.icon, className)}
        width={typeof size === 'number' ? size : 24}
        height={typeof size === 'number' ? size : 24}
        {...rest}
      >
        <use href={`${sprites}#${icon}`} />
      </svg>
    );
  }
);
