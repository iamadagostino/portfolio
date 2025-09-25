import { useId } from 'react';
import experienceSvg from '~/assets/images/misc/3d-cube.svg';
import { Button } from '~/components/button';
import styles from './experience-toggle.module.css';

export const ExperienceToggle = ({ isMobile, ...rest }) => {
  const id = useId();
  const svgId = `${id}-3d-experience`;

  return (
    <Button iconOnly className={styles.toggle} data-mobile={isMobile} aria-label="Open 3D experience" {...rest}>
      <img
        src={experienceSvg}
        alt="3D Experience"
        className={`h-8 w-8 transition-all duration-500 ease-out md:h-10 md:w-10 ${styles.img3d}`}
        id={svgId}
      />
    </Button>
  );
};
