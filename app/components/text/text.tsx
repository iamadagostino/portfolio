import { classes } from '~/utils/style';
import styles from '../main/text/text.module.css';

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
  const componentProps = {
    className: classes(styles.text, className),
    'data-size': size,
    'data-align': align,
    'data-weight': weight,
    'data-secondary': secondary,
    ...rest,
  };

  return (
    // @ts-expect-error - Dynamic component typing is complex, we know this is correct
    <Component {...componentProps}>{children}</Component>
  );
};
