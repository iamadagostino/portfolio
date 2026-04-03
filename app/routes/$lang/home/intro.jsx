import { useInterval, useWindowSize } from '@/hooks';
import { Suspense, lazy, useState } from 'react';

import { DecoderText } from '@/components/main/decoder-text';
import { Heading } from '@/components/main/heading';
import { useNavbar } from '@/components/main/navbar-provider';
import { Section } from '@/components/main/section';
import { useTheme } from '@/components/main/theme-provider';
import { Transition } from '@/components/main/transition';
import { VisuallyHidden } from '@/components/main/visually-hidden';
import config from '@/config/app.json';
import { getCanonicalSectionAnchor, getLocalizedSectionAnchor } from '@/config/menus/nav-menu';
import { tokens } from '@/config/theme.mjs';
import { useHydrated } from '@/hooks/useHydrated';
import { useCurrentLanguage, useHomeTranslation } from '@/i18n/i18n.hooks';
import { cssProps, media } from '@/utils/style';
import { useLocation } from 'react-router';
import styles from './intro.module.css';

const DisplacementSphere = lazy(() =>
  import('./displacement-sphere').then((module) => ({ default: module.DisplacementSphere }))
);

export function Intro({ id, sectionRef, ...rest }) {
  const { theme } = useTheme();
  const { width } = useWindowSize();
  const { t } = useHomeTranslation();
  const currentLanguage = useCurrentLanguage();
  const { setCurrent } = useNavbar();
  const location = useLocation();
  const aliasId = id === 'home' ? 'intro' : null;

  // Use translated disciplines with fallback to config
  const translatedDisciplines = t('hero.disciplines', { returnObjects: true });
  const disciplines = Array.isArray(translatedDisciplines) ? translatedDisciplines : config.disciplines;
  const translatedRole = t('hero.role', { defaultValue: config.role });

  const [disciplineIndex, setDisciplineIndex] = useState(0);
  const conjunction = t('hero.disciplineConjunction', { defaultValue: ', and ' });

  // Reset discipline index when theme changes (using key on Transition instead)
  // Theme changes are handled via the Transition component's key prop below

  const introLabel = [disciplines.slice(0, -1).join(', '), disciplines.slice(-1)[0]].join(conjunction);
  const currentDiscipline = disciplines.find((item, index) => index === disciplineIndex);
  const titleId = `${id}-title`;
  const isHydrated = useHydrated();
  const isMobile = width <= media.mobile;

  // Get localized anchor for projects section
  const projectsAnchor = getLocalizedSectionAnchor('projects', currentLanguage);
  const projectsLink = `/${currentLanguage}#${projectsAnchor}`;

  useInterval(
    () => {
      const index = (disciplineIndex + 1) % disciplines.length;
      setDisciplineIndex(index);
    },
    5000,
    theme
  );
  const handleScrollClick = (e) => {
    e.preventDefault();

    // Get the canonical anchor for finding the DOM element (e.g., 'projects')
    const canonicalHash = getCanonicalSectionAnchor('projects') || 'projects';
    const targetElement = document.getElementById(canonicalHash);

    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });

      // Update URL and state with localized hash (e.g., 'progetti' for Italian)
      window.history.replaceState(null, '', `${location.pathname}#${projectsAnchor}`);
      setCurrent(`${location.pathname}#${projectsAnchor}`);
    }
  };

  return (
    <Section
      className={styles.intro}
      as="section"
      ref={sectionRef}
      id={id}
      aria-labelledby={titleId}
      tabIndex={-1}
      {...rest}
    >
      {aliasId ? (
        <span
          id={aliasId}
          aria-hidden="true"
          style={{ display: 'block', height: 0, width: 0, margin: 0, padding: 0, overflow: 'hidden' }}
        />
      ) : null}
      <Transition in key={theme} timeout={3000}>
        {({ visible, status }) => (
          <>
            {isHydrated && (
              <Suspense>
                {/* Replace with better visual */}
                <DisplacementSphere />
              </Suspense>
            )}
            <header className={styles.text}>
              <h1 className={styles.name} data-visible={visible} id={titleId}>
                <DecoderText text={t('hero.title', { defaultValue: config.name })} delay={500} />
              </h1>
              <Heading level={0} as="h2" className={styles.title}>
                <VisuallyHidden className={styles.label}>{`${translatedRole} + ${introLabel}`}</VisuallyHidden>
                <span aria-hidden className={styles.row}>
                  <span
                    className={styles.word}
                    data-mobile={isMobile}
                    data-status={status}
                    style={cssProps({ delay: tokens.base.durationXS })}
                  >
                    {translatedRole}
                  </span>
                  <span className={styles.line} data-status={status} />
                </span>
                <div className={styles.row}>
                  {disciplines.map((item) => (
                    <Transition
                      unmount
                      in={item === currentDiscipline}
                      timeout={{ enter: 3000, exit: 2000 }}
                      key={item}
                    >
                      {({ status, nodeRef }) => (
                        <span
                          aria-hidden
                          ref={nodeRef}
                          className={styles.word}
                          data-plus={true}
                          data-status={status}
                          style={cssProps({ delay: tokens.base.durationL })}
                        >
                          {item}
                        </span>
                      )}
                    </Transition>
                  ))}
                </div>
              </Heading>
            </header>
            <a
              href={projectsLink}
              className={styles.scrollIndicator}
              data-status="entered"
              data-hidden="false"
              onClick={handleScrollClick}
            >
              <VisuallyHidden>{t('hero.scrollToProjects')}</VisuallyHidden>
            </a>
            <a
              href={projectsLink}
              className={styles.mobileScrollIndicator}
              data-status="entered"
              data-hidden="false"
              onClick={handleScrollClick}
            >
              <VisuallyHidden>{t('hero.scrollToProjects')}</VisuallyHidden>
              <svg aria-hidden stroke="currentColor" width="43" height="15" viewBox="0 0 43 15">
                <path d="M1 1l20.5 12L42 1" strokeWidth="2" fill="none" />
              </svg>
            </a>
          </>
        )}
      </Transition>
    </Section>
  );
}
