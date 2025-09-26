import { currentProjectAtom, projects } from './projects';

import { motion } from 'framer-motion';
import { useAtom } from 'jotai';
import type { ReactNode } from 'react';

type SectionProps = {
  children: ReactNode;
};

const Section = ({ children }: SectionProps) => {
  return (
    <motion.section
      className={`mx-auto flex h-screen w-screen max-w-screen-2xl flex-col items-start justify-center p-8`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{
        opacity: 1,
        y: 0,
        transition: {
          duration: 1,
          delay: 0.5,
        },
      }}
    >
      {children}
    </motion.section>
  );
};

type HomeSectionProps = {
  setSection: (section: number) => void;
};

const HomeSection = ({ setSection }: HomeSectionProps) => {
  return (
    <Section>
      <h1 className="text-6xl leading-snug font-extrabold text-slate-100">
        Hi, I&apos;m
        <br />
        <span className="bg-slate-100 px-1 text-gray-900 italic">Angelo D&apos;Agostino</span>
      </h1>
      <motion.p
        className="mt-4 text-lg text-slate-300"
        initial={{
          opacity: 0,
          y: 25,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
          transition: {
            duration: 1,
            delay: 1.5,
          },
        }}
      >
        I&apos;m a software engineer with a passion
        <br />
        for creating interactive experiences.
      </motion.p>
      <motion.button
        className="mt-8 rounded-lg bg-slate-700 px-5 py-3 text-center text-lg font-medium text-white transition-colors hover:bg-slate-800 focus:ring-4 focus:ring-slate-300 focus:outline-none sm:w-fit dark:bg-slate-600 dark:hover:bg-slate-700 dark:focus:ring-slate-800"
        initial={{
          opacity: 0,
          y: 25,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
          transition: {
            duration: 1,
            delay: 2,
          },
        }}
        onClick={() => {
          setSection(3);
        }}
      >
        Contact Me
      </motion.button>
    </Section>
  );
};

const skills = [
  {
    title: 'Three.js / React Three Fiber',
    level: 55,
  },
  {
    title: 'React / React Native',
    level: 60,
  },
  {
    title: 'HTML + CSS + JS',
    level: 90,
  },
  {
    title: 'Python',
    level: 65,
  },
  {
    title: 'PHP',
    level: 85,
  },
  {
    title: '3D Modeling',
    level: 40,
  },
];

const languages = [
  {
    title: '🇮🇹 Italian',
    level: 100,
  },
  {
    title: '🇺🇸 English',
    level: 80,
  },
];

const AboutSection = () => {
  return (
    <Section>
      <motion.div whileInView={'visible'}>
        {/* Skills */}
        <div>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Skills</h2>
          <div className="mt-8 space-y-4">
            {skills.map((skill, index) => (
              <div className="w-64" key={index}>
                <motion.h3
                  className="text-l font-bold text-gray-800"
                  initial={{
                    opacity: 0,
                  }}
                  variants={{
                    visible: {
                      opacity: 1,
                      transition: {
                        duration: 1,
                        delay: 1 + index * 0.25,
                      },
                    },
                  }}
                >
                  {skill.title}
                </motion.h3>
                <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
                  <motion.div
                    className="h-full rounded-full bg-slate-700"
                    style={{ width: `${skill.level}%` }}
                    initial={{
                      scaleX: 0,
                      originX: 0,
                    }}
                    variants={{
                      visible: {
                        scaleX: 1,
                        transition: {
                          duration: 1,
                          delay: 1 + index * 0.25,
                        },
                      },
                    }}
                  ></motion.div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Languages */}
        <div className="mt-10">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Languages</h2>
          <div className="mt-8 space-y-4">
            {languages.map((language, index) => (
              <div className="w-64" key={index}>
                <motion.h3
                  className="text-l font-bold text-gray-800"
                  initial={{
                    opacity: 0,
                  }}
                  whileInView={{
                    opacity: 1,
                  }}
                  transition={{
                    duration: 1,
                    delay: 2 + index * 0.25,
                  }}
                >
                  {language.title}
                </motion.h3>
                <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
                  <motion.div
                    className="h-full rounded-full bg-slate-700"
                    style={{ width: `${language.level}%` }}
                    initial={{
                      scaleX: 0,
                      originX: 0,
                    }}
                    variants={{
                      visible: {
                        scaleX: 1,
                        transition: {
                          duration: 1,
                          delay: 2 + index * 0.25,
                        },
                      },
                    }}
                  ></motion.div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </Section>
  );
};

const ProjectsSection = () => {
  const [currentProject, setCurrentProject] = useAtom(currentProjectAtom);

  const nextProject = () => {
    setCurrentProject((currentProject + 1) % projects.length);
  };

  const previousProject = () => {
    setCurrentProject((currentProject - 1 + projects.length) % projects.length);
  };

  return (
    <Section>
      <div className="flex h-3/4 w-full items-end justify-around">
        <button
          type="button"
          className="rounded-lg bg-slate-700 px-5 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-slate-800 focus:ring-4 focus:ring-slate-300 focus:outline-none sm:w-fit dark:bg-slate-600 dark:hover:bg-slate-700 dark:focus:ring-slate-800"
          onClick={previousProject}
        >
          &lt; Prev
        </button>
        <h2 className="text-center text-5xl font-bold tracking-tight text-gray-900 dark:text-white">Projects</h2>
        <button
          type="button"
          className="rounded-lg bg-slate-700 px-5 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-slate-800 focus:ring-4 focus:ring-slate-300 focus:outline-none sm:w-fit dark:bg-slate-600 dark:hover:bg-slate-700 dark:focus:ring-slate-800"
          onClick={nextProject}
        >
          Next &gt;
        </button>
      </div>
    </Section>
  );
};

const ContactSection = () => {
  return (
    <Section>
      <h2 className="mb-4 text-center text-5xl font-bold tracking-tight text-gray-900 dark:text-white">Contact Me</h2>
      {/* <p className="mb-8 lg:mb-16 font-light text-center text-gray-500 dark:text-gray-400 sm:text-xl">
        Got a technical issue? Want to send feedback about a beta feature? Need
        details about our Business plan? Let us know.
      </p> */}
      <div className="mt-8 w-96 max-w-full rounded-md bg-white p-8 dark:bg-gray-900">
        <form action="#" className="space-y-8">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300">
              Name
            </label>
            <input
              type="text"
              id="name"
              className="dark:shadow-sm-light block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 shadow-sm focus:border-slate-500 focus:ring-slate-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-slate-500 dark:focus:ring-slate-500"
              placeholder="Name"
              required
            />
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300">
              Your email
            </label>
            <input
              type="email"
              id="email"
              className="dark:shadow-sm-light block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 shadow-sm focus:border-slate-500 focus:ring-slate-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-slate-500 dark:focus:ring-slate-500"
              placeholder="name@angelo-dagostino.com"
              required
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="message" className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-400">
              Your message
            </label>
            <textarea
              id="message"
              rows={6}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 shadow-sm focus:border-slate-500 focus:ring-slate-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-slate-500 dark:focus:ring-slate-500"
              placeholder="Leave a comment..."
            ></textarea>
          </div>
          <button
            type="submit"
            className="rounded-lg bg-slate-700 px-5 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-slate-800 focus:ring-4 focus:ring-slate-300 focus:outline-none sm:w-fit dark:bg-slate-600 dark:hover:bg-slate-700 dark:focus:ring-slate-800"
          >
            Submit
          </button>
        </form>
      </div>
    </Section>
  );
};

type InterfaceProps = {
  setSection: (section: number) => void;
};

export const Interface = ({ setSection }: InterfaceProps) => {
  return (
    <div className="items-flex flex w-screen flex-col">
      <HomeSection setSection={setSection} />
      <AboutSection />
      <ProjectsSection />
      <ContactSection />
    </div>
  );
};
