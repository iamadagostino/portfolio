import { type ElementType, type JSXElementConstructor, type ReactNode } from 'react';

import { classes } from '~/utils/style';
import styles from './text.module.css';

interface TextProps {
  children: ReactNode;
  size?: number | 's' | 'm' | 'l' | 'xl';
  as?: ElementType;
  align?: 'auto' | 'start' | 'center' | 'end';
  weight?: 'regular' | 'medium' | 'bold';
  secondary?: boolean;
  className?: string;
}

export const Text = ({
  children,
  size = 'm', // Default size
  as: Component = 'span', // Default HTML tag
  align = 'auto', // Default alignment
  weight = 'regular', // Default weight
  secondary = false, // Default to false for secondary text
  className,
  ...rest
}: TextProps) => {
  const ComponentTag = Component as JSXElementConstructor<Record<string, unknown>>;

  return (
    <ComponentTag
      className={classes(styles.text, className)}
      data-size={size}
      data-align={align}
      data-weight={weight}
      data-secondary={secondary}
      {...(rest as Record<string, unknown>)}
    >
      {children}
    </ComponentTag>
  );
};
