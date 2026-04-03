import dvaExpressUSAImage from '@/assets/images/projects/sites/dva-express-usa.jpg';
import dvaExpressImage from '@/assets/images/projects/sites/dva-express.jpg';
import oldPortfolioImage from '@/assets/images/projects/sites/old-portfolio.jpg';
import portfolioImage from '@/assets/images/projects/sites/portfolio.jpg';
import tdaGoImage from '@/assets/images/projects/sites/tda-go.jpg';
import { Image, Text } from '@react-three/drei';
import type { ThreeElements } from '@react-three/fiber';
import { useFrame, useThree } from '@react-three/fiber';
import { animate, useMotionValue } from 'framer-motion';
import { atom, useAtom } from 'jotai';
import { forwardRef, useEffect, useRef, useState } from 'react';
import type { Group, Mesh } from 'three';

export const projects = [
  {
    title: 'DVA Express',
    url: 'https://www.dvaexpress.com/',
    image: dvaExpressImage,
    description: 'API and CMS integration for dynamic content, revamped front-end UX.',
    development: ['API', 'PHP', 'HTML', 'CSS', 'JavaScript'],
  },
  {
    title: 'DVA Express USA',
    url: 'https://www.dvaexpressusa.com/',
    image: dvaExpressUSAImage,
    description: 'Back-end API optimized and integrated, revamped front-end UX.',
    development: ['API', 'PHP', 'HTML', 'CSS', 'JavaScript'],
  },
  {
    title: 'TDA',
    url: 'https://www.tdago.it/',
    image: tdaGoImage,
    description: 'Front-end revamped and back-end API integration.',
    development: ['API', 'PHP', 'HTML', 'CSS', 'JavaScript'],
  },
  {
    title: 'Portfolio (Old)',
    url: 'https://old-portfolio.angelo-dagostino.com/',
    image: oldPortfolioImage,
    description: "My previous version of the portfolio website. It's still live.",
    development: ['Python', 'PHP', 'HTML', 'CSS', 'JavaScript'],
  },
  {
    title: 'Portfolio',
    url: 'https://www.angelo-dagostino.com/',
    image: portfolioImage,
    description: "My portfolio. You're probably looking at right now.",
    development: ['WebGL', 'HTML', 'CSS', 'JavaScript'],
  },
];

type GroupElementProps = ThreeElements['group'];

type ProjectInfo = (typeof projects)[number];

type SetAvatarAnimation = (animation: string) => void;

interface ProjectProps extends Omit<GroupElementProps, 'ref'> {
  project: ProjectInfo;
  highlighted: boolean;
}

const Project = forwardRef<Group, ProjectProps>((props, ref) => {
  const { project, highlighted, ...rest } = props;

  const background = useRef<Mesh | null>(null);
  const backgroundOpacity = useMotionValue(0.4);

  useEffect(() => {
    // Animate the background opacity.
    const controls = animate(backgroundOpacity, highlighted ? 0.75 : 0.25);

    return () => {
      controls.stop();
    };
  }, [highlighted, backgroundOpacity]);

  useFrame(() => {
    if (!background.current) return;
    const material = background.current.material;
    const opacity = backgroundOpacity.get();

    if (Array.isArray(material)) {
      material.forEach((mat) => {
        mat.opacity = opacity;
        mat.transparent = true;
      });
    } else {
      material.opacity = opacity;
      material.transparent = true;
    }
  });

  return (
    <group ref={ref} {...rest}>
      <mesh position={[0, 0, -0.001]} ref={background} onClick={() => window.open(project.url, '_blank')}>
        <planeGeometry args={[2.2, 2.4]} />
        <meshBasicMaterial color="black" transparent opacity={0.4} />
      </mesh>
      <Image
        zoom={0.89}
        scale={[2, 1]}
        url={project.image}
        toneMapped={false}
        rotation={[0, -Math.PI * 6, 0]}
        position={[0, 0.5, 0]}
      />
      <Text maxWidth={2.5} anchorX={'left'} anchorY={'top'} fontSize={0.2} position={[-1, -0.5, 0]}>
        {project.title.toUpperCase()}
      </Text>
      <Text maxWidth={2} anchorX={'left'} anchorY={'top'} fontSize={0.1} position={[-1, -0.75, 0]}>
        {project.description}
      </Text>
    </group>
  );
});

Project.displayName = 'Project';

const projectTransform = (projectIndex: number, currentProject: number) => ({
  x: (projectIndex - currentProject) * 2.5,
  y: currentProject === projectIndex ? 0 : -0.25,
  z: currentProject === projectIndex ? -2 : -3,
  rotateX: currentProject === projectIndex ? 0 : -Math.PI / 3,
  rotateZ: currentProject === projectIndex ? 0 : -Math.PI * 0.1,
});

interface AnimatedProjectGroupProps extends Omit<GroupElementProps, 'ref'> {
  index: number;
  currentProject: number;
  project: ProjectInfo;
}

const AnimatedProjectGroup = (props: AnimatedProjectGroupProps) => {
  const { index, currentProject, project, ...rest } = props;
  const groupRef = useRef<Group | null>(null);

  const initialTransform = projectTransform(index, currentProject);

  const x = useMotionValue(initialTransform.x);
  const y = useMotionValue(initialTransform.y);
  const z = useMotionValue(initialTransform.z);
  const rotateX = useMotionValue(initialTransform.rotateX);
  const rotateZ = useMotionValue(initialTransform.rotateZ);

  useEffect(() => {
    const target = projectTransform(index, currentProject);
    const controls = [
      animate(x, target.x),
      animate(y, target.y),
      animate(z, target.z),
      animate(rotateX, target.rotateX),
      animate(rotateZ, target.rotateZ),
    ];

    return () => {
      controls.forEach((control) => {
        if (control && typeof control.stop === 'function') {
          control.stop();
        }
      });
    };
  }, [currentProject, index, x, y, z, rotateX, rotateZ]);

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.position.set(x.get(), y.get(), z.get());
    groupRef.current.rotation.set(rotateX.get(), 0, rotateZ.get());
  });

  return <Project ref={groupRef} project={project} highlighted={currentProject === index} {...rest} />;
};

export const currentProjectAtom = atom(Math.floor(projects.length / 2));

// Delay before cards start moving (avatar walks first)
const CARD_MOVE_DELAY = 1200;

interface ProjectsProps extends Omit<GroupElementProps, 'ref'> {
  setAvatarAnimation: SetAvatarAnimation;
}

export const Projects = (props: ProjectsProps) => {
  const { setAvatarAnimation, ...rest } = props;
  const { viewport } = useThree();
  const [targetProject] = useAtom(currentProjectAtom);

  // Visual project controls the card positions - delayed from target
  const [visualProject, setVisualProject] = useState(targetProject);
  const previousTargetRef = useRef(targetProject);
  const cardMoveTimeoutRef = useRef<number | null>(null);

  // Handle avatar animation and delayed card movement
  useEffect(() => {
    const prevProject = previousTargetRef.current;

    // Skip on initial mount
    if (prevProject === targetProject) return;

    // Clear any pending card move timeout
    if (cardMoveTimeoutRef.current) {
      clearTimeout(cardMoveTimeoutRef.current);
    }

    // Determine direction considering loop wrapping
    const total = projects.length;
    const diff = targetProject - prevProject;

    // Handle looping: if we went from last to first, that's forward
    // If we went from first to last, that's backward
    let isForward: boolean;
    if (diff === 1 || diff === -(total - 1)) {
      isForward = true;
    } else if (diff === -1 || diff === total - 1) {
      isForward = false;
    } else {
      isForward = diff > 0;
    }

    // Start walking animation immediately
    setAvatarAnimation(isForward ? 'WalkingForward' : 'WalkingBackwards');

    // Delay card movement so avatar walks first
    cardMoveTimeoutRef.current = window.setTimeout(() => {
      setVisualProject(targetProject);
    }, CARD_MOVE_DELAY);

    previousTargetRef.current = targetProject;

    return () => {
      if (cardMoveTimeoutRef.current) {
        clearTimeout(cardMoveTimeoutRef.current);
      }
    };
  }, [targetProject, setAvatarAnimation]);

  return (
    <group
      scale={[1.125, 1.125, 1.125]}
      position={[-(viewport.width % 5), -viewport.height * 2 + 2, 2]}
      rotation={[0, Math.PI / 3, 0]}
      {...rest}
    >
      {projects.map((project, index) => (
        <AnimatedProjectGroup key={'project_' + index} index={index} currentProject={visualProject} project={project} />
      ))}
    </group>
  );
};
