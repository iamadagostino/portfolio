import { forwardRef, type ElementType, type MouseEventHandler, type ReactNode, type Ref, type RefObject } from 'react';

import { Link } from 'react-router';
import { Icon } from '~/components/main/icon';
import { Loader } from '~/components/main/loader';
import { Transition } from '~/components/main/transition';
import { classes } from '~/utils/style';
import styles from './button.module.css';

function isExternalLink(href?: string): boolean {
  return href?.includes('://') ?? false;
}

interface ButtonProps {
  id?: string;
  href?: string;
  className?: string;
  as?: ElementType;
  secondary?: boolean;
  loading?: boolean;
  loadingText?: string;
  icon?: string;
  iconEnd?: string;
  iconHoverShift?: boolean;
  iconOnly?: boolean;
  children?: ReactNode;
  rel?: string;
  target?: string;
  disabled?: boolean;
  prefetch?: string;
  viewTransition?: boolean;
  to?: string;
  onClick?: MouseEventHandler<HTMLElement>;
}

export const Button = forwardRef<HTMLAnchorElement | HTMLButtonElement, ButtonProps>(({ href, ...rest }, ref) => {
  if (isExternalLink(href) || !href) {
    return <ButtonContent href={href} ref={ref} {...rest} />;
  }

  return <ButtonContent viewTransition as={Link} prefetch="intent" to={href} ref={ref} {...rest} />;
});

const ButtonContent = forwardRef<HTMLAnchorElement | HTMLButtonElement, ButtonProps>(
  (props: ButtonProps, ref: Ref<HTMLAnchorElement | HTMLButtonElement>) => {
    const {
      className,
      as,
      secondary,
      loading,
      loadingText = 'Loading...',
      icon,
      iconEnd,
      iconHoverShift,
      iconOnly,
      children,
      rel,
      target,
      href,
      disabled,
      ...rest
    } = props;
    const isExternal = isExternalLink(href);
    const defaultComponent = href ? 'a' : 'button';
    const Component: ElementType = as || defaultComponent;

    const componentProps = {
      className: classes(styles.button, className),
      'data-loading': loading,
      'data-icon-only': iconOnly,
      'data-secondary': secondary,
      'data-icon': icon,
      href,
      rel: rel || (isExternal ? 'noopener noreferrer' : undefined),
      target: target || (isExternal ? '_blank' : undefined),
      disabled,
      ...(rest as Record<string, unknown>),
    } as Record<string, unknown>;

    const ComponentAny = Component as unknown as React.ComponentType<Record<string, unknown>>;

    return (
      <ComponentAny ref={ref as unknown as Ref<HTMLElement>} {...componentProps}>
        {!!icon && <Icon className={styles.icon} data-start={!iconOnly} data-shift={iconHoverShift} icon={icon} />}
        {!!children && <span className={styles.text}>{children}</span>}
        {!!iconEnd && <Icon className={styles.icon} data-end={!iconOnly} data-shift={iconHoverShift} icon={iconEnd} />}
        <Transition unmount in={loading}>
          {({ visible, nodeRef }: { visible: boolean; nodeRef: RefObject<HTMLDivElement> }) => (
            <Loader ref={nodeRef} className={styles.loader} size={32} text={loadingText} data-visible={visible} />
          )}
        </Transition>
      </ComponentAny>
    );
  }
);
