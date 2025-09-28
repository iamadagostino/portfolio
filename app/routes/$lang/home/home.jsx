import { useEffect, useRef, useState } from 'react';
import { useNavbar } from '~/components/main/navbar-provider';

import gamestackTexture2Large from '~/assets/images/projects/gamestack/gamestack-list-large.jpg';
import gamestackTexture2Placeholder from '~/assets/images/projects/gamestack/gamestack-list-placeholder.jpg';
import gamestackTexture2 from '~/assets/images/projects/gamestack/gamestack-list.jpg';
import gamestackTextureLarge from '~/assets/images/projects/gamestack/gamestack-login-large.jpg';
import gamestackTexturePlaceholder from '~/assets/images/projects/gamestack/gamestack-login-placeholder.jpg';
import gamestackTexture from '~/assets/images/projects/gamestack/gamestack-login.jpg';
import sliceTextureLarge from '~/assets/images/projects/slice/slice-app-large.jpg';
import sliceTexturePlaceholder from '~/assets/images/projects/slice/slice-app-placeholder.jpg';
import sliceTexture from '~/assets/images/projects/slice/slice-app.jpg';
import sprTextureLarge from '~/assets/images/projects/smart-sparrow/spr-lesson-builder-dark-large.jpg';
import sprTexturePlaceholder from '~/assets/images/projects/smart-sparrow/spr-lesson-builder-dark-placeholder.jpg';
import sprTexture from '~/assets/images/projects/smart-sparrow/spr-lesson-builder-dark.jpg';
import { Footer } from '~/components/main/footer';
import config from '~/config/app.json';
import { useCurrentLanguage, useHomeTranslation } from '~/i18n/i18n.hooks';
import { baseMeta } from '~/utils/meta';
import styles from './home.module.css';
import { Intro } from './intro';
import { Profile } from './profile';
import { ProjectSummary } from './project-summary';

export const handle = {
  i18n: ['common', 'navbar', 'home'],
};

// Prefetch draco decoder wasm
export const links = () => {
  return [
    {
      rel: 'prefetch',
      href: '/static/vendor/draco/draco_wasm_wrapper.js',
      as: 'script',
      type: 'text/javascript',
      importance: 'low',
    },
    {
      rel: 'prefetch',
      href: '/static/vendor/draco/draco_decoder.wasm',
      as: 'fetch',
      type: 'application/wasm',
      importance: 'low',
    },
  ];
};

export const meta = () => {
  return baseMeta({
    title: 'Software Engineer + Coder',
    description: `Portfolio of ${config.name} — A software engineer dedicated to crafting web and mobile solutions, with expertise in building robust architectures, planning efficient projects, and creating user-driven designs.`,
  });
};

export const Home = () => {
  const [visibleSections, setVisibleSections] = useState([]);
  const [scrollIndicatorHidden, setScrollIndicatorHidden] = useState(false);
  const currentLanguage = useCurrentLanguage();
  const intro = useRef();
  const projectOne = useRef();
  const projectTwo = useRef();
  const projectThree = useRef();
  const details = useRef();
  const { setCurrent } = useNavbar();
  const { t } = useHomeTranslation();

  // Create localized project links
  const getProjectLink = (projectSlug) => {
    // Check if we have the language prefix, default to 'en' if not found
    const lang = currentLanguage || 'en';
    const projectPath = lang === 'it' ? 'progetti' : 'projects';
    return `/${lang}/${projectPath}/${projectSlug}`;
  };

  useEffect(() => {
    const sections = [intro, projectOne, projectTwo, projectThree, details];

    // Keep a map of intersection ratios for each section so we can
    // deterministically pick the most visible section regardless of
    // scroll direction. This fixes missed highlights when scrolling up.
    const ratioMap = {};

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        // Update ratios for entries we receive
        entries.forEach((entry) => {
          const id = entry.target.id;
          ratioMap[id] = entry.intersectionRatio;
        });

        // Determine which sections are currently visible (ratio >= 0.1)
        const visible = sections
          .map((ref) => ref.current)
          .filter(Boolean)
          .filter((el) => (ratioMap[el.id] || 0) >= 0.1);

        setVisibleSections(visible);

        // Pick the section with the highest intersectionRatio
        let bestId = null;
        let bestRatio = 0;
        for (const ref of sections) {
          const el = ref.current;
          if (!el) continue;
          const r = ratioMap[el.id] || 0;
          if (r > bestRatio) {
            bestRatio = r;
            bestId = el.id;
          }
        }

        if (bestId) {
          const path = `/${currentLanguage}`;
          setCurrent(`${path}#${bestId}`);
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] }
    );

    const indicatorObserver = new IntersectionObserver(
      ([entry]) => {
        setScrollIndicatorHidden(!entry.isIntersecting);
      },
      { rootMargin: '-100% 0px 0px 0px' }
    );

    sections.forEach((section) => {
      if (section.current) sectionObserver.observe(section.current);
    });

    if (intro.current) indicatorObserver.observe(intro.current);

    return () => {
      sectionObserver.disconnect();
      indicatorObserver.disconnect();
    };
  }, [visibleSections, currentLanguage, setCurrent]);

  return (
    <div className={styles.home}>
      <Intro id="intro" sectionRef={intro} scrollIndicatorHidden={scrollIndicatorHidden} />
      <ProjectSummary
        id="project-1"
        sectionRef={projectOne}
        visible={visibleSections.includes(projectOne.current)}
        index={1}
        title={t('projects.project1.title')}
        description={t('projects.project1.description')}
        buttonText={t('projects.project1.buttonText')}
        buttonLink={getProjectLink('smart-sparrow')}
        model={{
          type: 'laptop',
          alt: 'Smart Sparrow lesson builder',
          textures: [
            {
              srcSet: `${sprTexture} 1280w, ${sprTextureLarge} 2560w`,
              placeholder: sprTexturePlaceholder,
            },
          ],
        }}
      />
      <ProjectSummary
        id="project-2"
        alternate
        sectionRef={projectTwo}
        visible={visibleSections.includes(projectTwo.current)}
        index={2}
        title={t('projects.project2.title')}
        description={t('projects.project2.description')}
        buttonText={t('projects.project2.buttonText')}
        buttonLink="https://gamestack.hamishw.com"
        model={{
          type: 'phone',
          alt: 'App login screen',
          textures: [
            {
              srcSet: `${gamestackTexture} 375w, ${gamestackTextureLarge} 750w`,
              placeholder: gamestackTexturePlaceholder,
            },
            {
              srcSet: `${gamestackTexture2} 375w, ${gamestackTexture2Large} 750w`,
              placeholder: gamestackTexture2Placeholder,
            },
          ],
        }}
      />
      <ProjectSummary
        id="project-3"
        sectionRef={projectThree}
        visible={visibleSections.includes(projectThree.current)}
        index={3}
        title={t('projects.project3.title')}
        description={t('projects.project3.description')}
        buttonText={t('projects.project3.buttonText')}
        buttonLink={getProjectLink('slice')}
        model={{
          type: 'laptop',
          alt: 'Annotating a biomedical image in the Slice app',
          textures: [
            {
              srcSet: `${sliceTexture} 800w, ${sliceTextureLarge} 1920w`,
              placeholder: sliceTexturePlaceholder,
            },
          ],
        }}
      />
      <Profile sectionRef={details} visible={visibleSections.includes(details.current)} id="details" />
      <Footer />
    </div>
  );
};
