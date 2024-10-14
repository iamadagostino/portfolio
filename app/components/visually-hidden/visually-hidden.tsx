import React, { ElementType, ReactNode, forwardRef } from 'react';

import { classes } from '~/utils/style';
import styles from './visually-hidden.module.css';

type AsProp<T extends ElementType> = {
  as?: T;
  className?: string;
  showOnFocus?: boolean;
  children: ReactNode;
  visible?: boolean;
} & React.ComponentPropsWithoutRef<T>;

export const VisuallyHidden = forwardRef<HTMLElement, AsProp<ElementType>>(
  (
    { className, showOnFocus, as: Component = 'span', children, visible, ...rest },
    ref
  ) => {
    return (
      <Component
        className={classes(styles.hidden, className)}
        data-hidden={!visible && !showOnFocus}
        data-show-on-focus={showOnFocus}
        ref={ref}
        {...rest}
      >
        {children}
      </Component>
    );
  }
);

VisuallyHidden.displayName = 'VisuallyHidden';
