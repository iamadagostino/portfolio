import { PortfolioSidebar } from '@/components/main/hero/portfolio-sidebar';
import { useNavbar } from '@/components/main/navbar-provider';
import { ThemeContext } from '@/components/main/theme-provider';
import config from '@/config/app.json';
import { useCurrentLanguage } from '@/i18n/i18n.hooks';
import { Header } from '@/layouts/main/hero/header';
import { baseMeta } from '@/utils/meta';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import styles from './hero.module.css';
import { Home } from './home';
import { Intro } from './intro';

export const handle = {
  i18n: ['common', 'home'],
};

export const meta = () => {
  return baseMeta({
    title: 'Software Engineer + Coder',
    description: `Portfolio of ${config.name} — A software engineer dedicated to crafting web and mobile solutions, with expertise in building robust architectures, planning efficient projects, and creating user-driven designs.`,
  });
};

const frameModules = import.meta.glob('@/assets/images/hero/bttf/frame_*.webp', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

const heroFrames = Object.entries(frameModules)
  .sort(([a], [b]) => {
    const extract = (value: string) => Number(value.match(/frame_(\d+)\.webp$/)?.[1] ?? 0);
    return extract(a) - extract(b);
  })
  .map(([, src]) => src);

const FRAME_COUNT = heroFrames.length;
// Controls how many viewport heights the hero sequence stays pinned
const SCROLL_DURATION_MULTIPLIER = 4;
// Timeline position (0-1) where navbar, intro, and content should reveal
const CONTENT_REVEAL_POSITION = 0.62;

if (FRAME_COUNT === 0) {
  throw new Error('Hero sequence frames not found at @/assets/images/hero/bttf');
}

const frameUrl = (index: number) => heroFrames[Math.min(Math.max(index - 1, 0), FRAME_COUNT - 1)];

export const Hero = () => {
  const sequenceRef = useRef<HTMLDivElement>(null);
  const heroImageRef = useRef<HTMLImageElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const introSectionRef = useRef<HTMLElement | null>(null);
  const headerRef = useRef<HTMLHeadingElement>(null);
  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [shouldSkipAnimation, setShouldSkipAnimation] = useState(false);
  const [shouldHideHero, setShouldHideHero] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const clampedProgress = Math.min(100, Math.max(0, progress));
  const { setCurrent, setIsHeroHidden, setTarget } = useNavbar();
  const currentLanguage = useCurrentLanguage();
  const isInitialMount = useRef(true);

  // Check if user navigated with a hash (skip animation for direct hash navigation)
  useEffect(() => {
    // Only run ONCE on initial mount
    if (!isInitialMount.current || typeof window === 'undefined') return;

    isInitialMount.current = false;
    const hash = window.location.hash;

    if (!hash || hash === '#home') {
      // No hash or #home: show animation normally (or keep it active)
      console.log('[Hero] Initial load with no hash or #home - keeping animation active');
      setIsHeroHidden(false);
      if (hash === '#home') {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setShowLoader(true);
      }
      return;
    }

    // Initial load with non-home hash: hide hero, show loader
    console.log('[Hero] Initial load with non-home hash:', hash, '- hiding hero');
    setShouldSkipAnimation(true);
    setShouldHideHero(true);
    setShowLoader(true);
    setIsHeroHidden(true); // Tell navbar that hero is hidden

    if (heroImageRef.current) {
      heroImageRef.current.src = frameUrl(FRAME_COUNT);
    }
  }, [setIsHeroHidden]); // Only run on mount, setIsHeroHidden is stable

  // Observe the #home section for navbar highlighting (only update navbar, don't change URL)
  useEffect(() => {
    const homeSection = sequenceRef.current;
    if (!homeSection || shouldHideHero) return; // Don't observe if hero is hidden

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Only update if hero section is significantly visible (more than 50%)
          // This prevents interference when user has scrolled past to projects
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            const path = `/${currentLanguage}`;
            const targetUrl = `${path}#home`;
            setCurrent(targetUrl);
          }
        });
      },
      { threshold: [0, 0.5, 1], rootMargin: '0px 0px -30% 0px' }
    );

    observer.observe(homeSection);

    return () => {
      observer.disconnect();
    };
  }, [currentLanguage, setCurrent, shouldHideHero]);

  useLayoutEffect(() => {
    // Skip animation setup completely if navigating to non-home hash
    if (shouldHideHero) {
      console.log('[Hero] Skipping animation setup - navigating to non-home hash');
      return;
    }

    let cancelled = false;
    const container = sequenceRef.current;
    const activeImage = heroImageRef.current;
    const introSection = introSectionRef.current;
    const navContainer = document.querySelector<HTMLElement>('[data-hero-nav="container"]');
    const navHeader = document.querySelector<HTMLElement>('[data-hero-nav="header"]');

    if (!container || !activeImage || !introSection) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // Preload all frames
    const images: HTMLImageElement[] = new Array(FRAME_COUNT);
    const state = { frame: shouldSkipAnimation ? FRAME_COUNT - 1 : 0 }; // Start at frame 0 (first image)

    activeImage.dataset.currentFrame = '-1';
    activeImage.src = shouldSkipAnimation ? frameUrl(FRAME_COUNT) : heroFrames[0];
    activeImage.loading = 'eager';

    const updateImage = () => {
      const frameIndex = Math.min(FRAME_COUNT - 1, Math.max(0, Math.round(state.frame)));
      const image = images[frameIndex];
      if (!image) return;
      if (activeImage.dataset.currentFrame === String(frameIndex)) return;

      activeImage.src = image.src;
      activeImage.dataset.currentFrame = String(frameIndex);
    };

    let loadedCount = 0;
    const handleImageLoad = () => {
      loadedCount += 1;
      if (cancelled) return;

      const percent = Math.round((loadedCount / FRAME_COUNT) * 100);
      setProgress(percent);

      if (loadedCount === FRAME_COUNT) {
        setIsReady(true);
        ScrollTrigger.refresh();
      }
    };

    // If navigating to #home, only preload final frame first for instant display
    if (shouldSkipAnimation) {
      const finalImg = new Image();
      finalImg.src = heroFrames[FRAME_COUNT - 1];
      finalImg.onload = () => {
        setIsReady(true);
        // Then lazy load other frames in background for scrubbing
        for (let i = 0; i < FRAME_COUNT; i += 1) {
          const img = new Image();
          img.src = heroFrames[i];
          img.decoding = 'async';
          img.loading = 'lazy';
          img.onload = handleImageLoad;
          img.onerror = handleImageLoad;
          images[i] = img;
        }
      };
    } else {
      // Normal flow: preload all frames eagerly
      for (let i = 0; i < FRAME_COUNT; i += 1) {
        const img = new Image();
        img.src = heroFrames[i];
        img.decoding = 'async';
        img.loading = 'eager';
        img.onload = handleImageLoad;
        img.onerror = handleImageLoad;
        images[i] = img;
      }
    }

    // Store initial navbar styles to restore later
    const initialNavContainerStyles = navContainer
      ? {
          opacity: navContainer.style.opacity,
          transform: navContainer.style.transform,
          pointerEvents: navContainer.style.pointerEvents,
        }
      : null;

    const initialNavHeaderStyles = navHeader
      ? {
          opacity: navHeader.style.opacity,
        }
      : null;

    // Initialize navbar visibility based on whether we're starting at final frame
    if (shouldSkipAnimation) {
      // Starting at #home - navbar should be visible
      if (navContainer) {
        gsap.set(navContainer, { autoAlpha: 1, y: 0 });
        navContainer.style.pointerEvents = 'auto';
      }
      if (navHeader) {
        gsap.set(navHeader, { autoAlpha: 1 });
      }
      // Intro should also be visible
      if (introSection) {
        gsap.set(introSection, { opacity: 1, yPercent: 0 });
      }
    } else {
      // Normal flow - navbar hidden initially
      if (navContainer) {
        gsap.set(navContainer, { autoAlpha: 0, y: -24 });
        navContainer.style.pointerEvents = 'none';
      }
      if (navHeader) {
        gsap.set(navHeader, { autoAlpha: 0 });
      }
    }

    // Calculate scroll distance: pin for 4 viewports during animation
    const totalScrollDistance = window.innerHeight * SCROLL_DURATION_MULTIPLIER;

    // Create main timeline
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: `+=${totalScrollDistance}`,
        scrub: true,
        pin: true,
        anticipatePin: 1,
      },
      defaults: { ease: 'none' },
    });

    // Main frame scrubbing - takes full timeline duration
    timeline.to(state, {
      frame: FRAME_COUNT - 1,
      duration: 1,
      onUpdate: updateImage,
      snap: { frame: 1 },
    });
    timeline.addLabel('framesComplete');

    // Fade out header overlay early
    if (overlayRef.current) {
      timeline.to(overlayRef.current, { opacity: 0, yPercent: -18, duration: 0.15, ease: 'power2.out' }, 0.12);
    }

    if (headerRef.current) {
      timeline.to(
        headerRef.current,
        { opacity: 0, yPercent: -10, pointerEvents: 'none', duration: 0.15, ease: 'power2.out' },
        0.12
      );
    }

    // Sidebar animation
    if (sidebarRef.current) {
      timeline.from(sidebarRef.current, { opacity: 0, x: -40, duration: 0.15, ease: 'power2.out' }, 0);

      timeline.to(
        sidebarRef.current,
        { opacity: 0, x: -40, duration: 0.1, ease: 'power2.in' },
        CONTENT_REVEAL_POSITION - 0.05
      );
    }

    // Intro overlay reveals at content reveal position
    const introHeader = introSection.querySelector('header');
    const introLinks = introSection.querySelectorAll('a');

    timeline.fromTo(
      introSection,
      { opacity: 0, yPercent: 6 },
      { opacity: 1, yPercent: 0, duration: 0.2, ease: 'power2.out' },
      CONTENT_REVEAL_POSITION
    );

    if (introHeader) {
      timeline.fromTo(
        introHeader,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.15, ease: 'power2.out' },
        CONTENT_REVEAL_POSITION + 0.04
      );
    }

    if (introLinks.length > 0) {
      timeline.fromTo(
        introLinks,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.12, stagger: 0.02, ease: 'power2.out' },
        CONTENT_REVEAL_POSITION + 0.08
      );
    }

    // Navbar reveal - container first, then header items
    if (navContainer) {
      timeline.to(
        navContainer,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.2,
          ease: 'power2.out',
          onStart: () => {
            if (navContainer) navContainer.style.pointerEvents = 'auto';
          },
          onComplete: () => {
            // Once visible, clear GSAP inline styles so navbar works normally
            if (navContainer) {
              gsap.set(navContainer, { clearProps: 'opacity,visibility,transform' });
              navContainer.style.pointerEvents = 'auto';
            }
          },
        },
        CONTENT_REVEAL_POSITION
      );
    }

    if (navHeader) {
      timeline.to(
        navHeader,
        {
          autoAlpha: 1,
          duration: 0.15,
          ease: 'power2.out',
          onComplete: () => {
            // Once visible, clear GSAP inline styles
            if (navHeader) {
              gsap.set(navHeader, { clearProps: 'opacity,visibility' });
            }
          },
        },
        CONTENT_REVEAL_POSITION + 0.05
      );
    }

    // Cleanup - restore navbar to visible state
    return () => {
      cancelled = true;

      // Only clean up GSAP if timeline was created
      if (timeline) {
        timeline.scrollTrigger?.kill();
        timeline.kill();
      }

      // Restore navbar visibility immediately on cleanup
      if (navContainer) {
        try {
          gsap.set(navContainer, { clearProps: 'all' });
          // Ensure navbar is visible after cleanup
          navContainer.style.opacity = initialNavContainerStyles?.opacity || '1';
          navContainer.style.transform = initialNavContainerStyles?.transform || 'none';
          navContainer.style.pointerEvents = initialNavContainerStyles?.pointerEvents || 'auto';
        } catch (e) {
          console.warn('Error cleaning up nav container:', e);
        }
      }
      if (navHeader) {
        try {
          gsap.set(navHeader, { clearProps: 'all' });
          navHeader.style.opacity = initialNavHeaderStyles?.opacity || '1';
        } catch (e) {
          console.warn('Error cleaning up nav header:', e);
        }
      }
    };
  }, [shouldSkipAnimation, shouldHideHero]);

  const heroSection = (
    <section
      ref={sequenceRef}
      id="home"
      className={`${styles.heroSequence} ${shouldHideHero ? styles.heroSequenceHidden : ''}`}
    >
      <img
        ref={heroImageRef}
        alt="Cinematic zoom sequence frame"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="from-background/35 via-background/10 to-background/90 absolute inset-0 bg-linear-to-b" />
      <div ref={overlayRef} className="relative z-10 flex h-full flex-col justify-between px-6 py-8 md:px-16 md:py-12">
        <Header ref={headerRef} />
      </div>
      <PortfolioSidebar ref={sidebarRef} />
      <div id="intro-canvas" className="absolute inset-0 z-5 flex items-center justify-center px-6 md:px-16">
        {/* Intro overlay - visible during last frames and at #home */}
        <Intro id="intro" sectionRef={introSectionRef} />
      </div>
      {!isReady && (!shouldSkipAnimation || showLoader) && (
        <div className="bg-background/92 absolute inset-0 z-20 flex flex-col items-center justify-center backdrop-blur-xl">
          <span className="text-foreground/60 text-xs tracking-[0.6em] uppercase">Preparing sequence</span>
          <div className="bg-foreground/10 mt-4 h-1 w-48 overflow-hidden rounded-full">
            <progress
              value={clampedProgress}
              max={100}
              aria-label="Sequence preload progress"
              className={styles.heroProgress}
            />
          </div>
          <span className="text-foreground/70 mt-3 text-sm font-medium tabular-nums">{clampedProgress}%</span>
        </div>
      )}
      {!shouldSkipAnimation && (
        <a
          href={`/${currentLanguage}#home`}
          className="text-foreground/50 hover:text-foreground/70 absolute inset-x-0 bottom-12 z-10 flex cursor-pointer flex-col items-center gap-3 text-[0.55rem] tracking-[0.5em] uppercase no-underline transition-colors"
          onClick={(e) => {
            e.preventDefault();
            setTarget('#home');
          }}
        >
          <span>Scroll to explore</span>
          <div className="via-foreground/40 h-12 w-px bg-linear-to-b from-transparent to-transparent" />
        </a>
      )}
    </section>
  );

  return (
    <div className="bg-background text-foreground">
      <main className="relative isolate overflow-hidden">
        {/* Hero Animation Sequence - wrap with dark theme provider and data-theme attribute when hero is visible */}
        {!shouldHideHero ? (
          <ThemeContext.Provider value={{ theme: 'dark', toggleTheme: () => {} }}>
            <div data-theme="dark" className={styles.heroDarkTheme}>
              {heroSection}
            </div>
          </ThemeContext.Provider>
        ) : (
          heroSection
        )}

        {/* Projects and other content below */}
        <Home showIntro={false} />
      </main>
    </div>
  );
};
