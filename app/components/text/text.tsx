import { classes } from '~/utils/style';
import styles from './text.module.css';

interface TextProps {
  children: React.ReactNode;
  size?: number | 's' | 'm' | 'l' | 'xl';
  as?: React.ElementType;
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
  return (
    <Component
      className={classes(
        styles.text,
        styles[`size-${size}`], // Dynamic class for size
        styles[`align-${align}`], // Dynamic class for alignment
        styles[`weight-${weight}`], // Dynamic class for weight
        secondary && styles.secondary, // Add secondary class if true
        className // Allow additional classes to be passed
      )}
      {...rest}
    >
      {children}
    </Component>
  );
};
