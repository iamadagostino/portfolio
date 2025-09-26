import { Button } from '~/components/main/button';
import { Icon } from '~/components/main/icon';
import { useNavbar } from '~/components/main/navbar-provider';
import styles from './nav-toggle.module.css';

export const NavToggle = ({ ...rest }) => {
  const { isMobile, menuOpen } = useNavbar();

  return (
    <Button
      iconOnly
      className={styles.toggle}
      data-mobile={isMobile}
      aria-label="Menu"
      aria-expanded={menuOpen}
      {...rest}
    >
      <div className={styles.inner}>
        <Icon className={styles.icon} data-menu={true} data-open={menuOpen} icon="menu" />
        <Icon className={styles.icon} data-close={true} data-open={menuOpen} icon="close" />
      </div>
    </Button>
  );
};
