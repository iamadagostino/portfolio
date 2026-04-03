import { Heading } from '@/components/main/heading';
import { forwardRef } from 'react';
import styles from './portfolio-sidebar.module.css';

const defaultSkills = [
  'React',
  'TypeScript',
  'Node.js',
  'Web Architecture',
  'Mobile Dev',
  'UI/UX Design',
  'Cloud Platforms',
  'Database Design',
];

export const PortfolioSidebar = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div
      ref={ref}
      className="pointer-events-none absolute top-1/2 left-0 z-20 flex max-w-xs -translate-y-1/2 flex-col gap-8 rounded-2xl bg-black/60 px-6 py-8 backdrop-blur md:px-8"
    >
      <div className="space-y-6">
        <p className="text-sm leading-relaxed text-white/80">
          Portfolio of <span className="font-semibold text-white">Angelo D&apos;Agostino</span> — A software engineer
          dedicated to crafting web and mobile solutions, with expertise in building robust architectures, planning
          efficient projects, and creating user-driven designs.
        </p>

        <div className="space-y-3">
          <Heading level={5} as="span" className={`tracking-[0.5em] uppercase ${styles.glitchText}`}>
            Skills
          </Heading>
          <div className="flex flex-wrap gap-2 pt-4">
            {defaultSkills.map((skill) => (
              <span key={skill} className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/80">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

PortfolioSidebar.displayName = 'PortfolioSidebar';
