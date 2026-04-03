import { useNavbar } from '@/components/main/navbar-provider';
import { useEffect, useRef, useState } from 'react';

import gamestackTexture2Large from '@/assets/images/projects/gamestack/gamestack-list-large.jpg';
import gamestackTexture2Placeholder from '@/assets/images/projects/gamestack/gamestack-list-placeholder.jpg';
import gamestackTexture2 from '@/assets/images/projects/gamestack/gamestack-list.jpg';
import gamestackTextureLarge from '@/assets/images/projects/gamestack/gamestack-login-large.jpg';
import gamestackTexturePlaceholder from '@/assets/images/projects/gamestack/gamestack-login-placeholder.jpg';
import gamestackTexture from '@/assets/images/projects/gamestack/gamestack-login.jpg';
import sliceTextureLarge from '@/assets/images/projects/slice/slice-app-large.jpg';
import sliceTexturePlaceholder from '@/assets/images/projects/slice/slice-app-placeholder.jpg';
import sliceTexture from '@/assets/images/projects/slice/slice-app.jpg';
import sprTextureLarge from '@/assets/images/projects/smart-sparrow/spr-lesson-builder-dark-large.jpg';
import sprTexturePlaceholder from '@/assets/images/projects/smart-sparrow/spr-lesson-builder-dark-placeholder.jpg';
import sprTexture from '@/assets/images/projects/smart-sparrow/spr-lesson-builder-dark.jpg';
import { Footer } from '@/components/main/footer';
import config from '@/config/app.json';
import { getLocalizedSectionAnchor } from '@/config/menus/nav-menu';
import { useCurrentLanguage, useHomeTranslation } from '@/i18n/i18n.hooks';
import { baseMeta } from '@/utils/meta';
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

export const Home = ({ showIntro = true } = {}) => {
  const [visibleSections, setVisibleSections] = useState([]);
  const currentLanguage = useCurrentLanguage();
  const intro = useRef();
  const projectOne = useRef();
  const projectTwo = useRef();
  const projectThree = useRef();
  const details = useRef();
  const lastUpdateUrl = useRef(''); // Track last URL to prevent excessive updates
  const { setCurrent } = useNavbar();
  const { t } = useHomeTranslation();

  // Create localized project links
  const getProjectLink = (projectSlug) => {
    // Check if we have the language prefix, default to 'en-US' if not found
    const lang = currentLanguage || 'en-US';
    const projectPath = lang.startsWith('it') ? 'progetti' : 'projects';
    return `/${lang}/${projectPath}/${projectSlug}`;
  };

  useEffect(() => {
    // Individual projects for visibility tracking (animations)
    const projectSections = [projectOne, projectTwo, projectThree];
    // Main sections for URL updates (only include intro if it's rendered)
    const mainSections = showIntro ? [intro, details] : [details];

    // Keep a map of intersection ratios for each section
    const ratioMap = {};

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        // Update ratios for entries we receive
        entries.forEach((entry) => {
          const id = entry.target.id;
          ratioMap[id] = entry.intersectionRatio;
        });

        // Determine which individual projects are visible (for animations) - track by ID
        const visible = projectSections
          .map((ref) => ref.current)
          .filter(Boolean)
          .filter((el) => (ratioMap[el.id] || 0) >= 0.1)
          .map((el) => el.id); // Store IDs instead of elements

        // Also include details section if visible (for animations)
        if (details.current && (ratioMap[details.current.id] || 0) >= 0.1) {
          visible.push(details.current.id);
        }

        setVisibleSections(visible);

        // Determine the best section for URL
        let bestId = null;
        let bestRatio = 0;

        // Check main sections first
        for (const ref of mainSections) {
          const el = ref.current;
          if (!el) continue;
          const r = ratioMap[el.id] || 0;
          if (r > bestRatio) {
            bestRatio = r;
            bestId = el.id;
          }
        }

        // Check if any project is visible - if so, use "projects" as the section
        let maxProjectRatio = 0;
        for (const ref of projectSections) {
          const el = ref.current;
          if (!el) continue;
          const r = ratioMap[el.id] || 0;
          if (r > maxProjectRatio) {
            maxProjectRatio = r;
          }
        }

        // If any project has higher visibility than other sections, use "projects"
        if (maxProjectRatio > bestRatio && maxProjectRatio > 0.1) {
          bestId = 'projects';
          bestRatio = maxProjectRatio;
        }

        if (bestId && bestRatio > 0.1) {
          const path = `/${currentLanguage}`;
          // Use localized anchor for the URL (e.g., 'progetti' instead of 'projects')
          const localizedAnchor = getLocalizedSectionAnchor(bestId, currentLanguage) || bestId;
          const newUrl = `${path}#${localizedAnchor}`;

          // Only update if the URL actually changed to prevent excessive history updates
          if (lastUpdateUrl.current !== newUrl) {
            lastUpdateUrl.current = newUrl;
            window.history.replaceState(null, '', newUrl);
            setCurrent(newUrl);
          }
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] }
    );

    // Observe all sections
    [...mainSections, ...projectSections].forEach((section) => {
      if (section.current) sectionObserver.observe(section.current);
    });

    return () => {
      sectionObserver.disconnect();
    };
  }, [currentLanguage, setCurrent, showIntro]);

  return (
    <div className={styles.home}>
      {showIntro && <Intro id="intro" sectionRef={intro} />}
      <div id="projects">
        <ProjectSummary
          id="project-1"
          sectionRef={projectOne}
          visible={visibleSections.includes('project-1')}
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
          visible={visibleSections.includes('project-2')}
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
          visible={visibleSections.includes('project-3')}
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
      </div>
      <Profile sectionRef={details} visible={visibleSections.includes('details')} id="details" />
      <Footer />
    </div>
  );
};
