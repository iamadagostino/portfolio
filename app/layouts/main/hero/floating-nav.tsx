import { getNavLinks } from '@/config/menus/nav-menu';
import { useCurrentLanguage, useNavbarTranslation } from '@/i18n/i18n.hooks';
import gsap from 'gsap';
import { useLayoutEffect, useMemo, useRef } from 'react';
import { useLocation } from 'react-router';

interface FloatingTechNavProps {
  onNavClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

export function FloatingTechNav({ onNavClick }: FloatingTechNavProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const itemsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  // Get translations and language
  const { t } = useNavbarTranslation();
  const currentLanguage = useCurrentLanguage();
  const location = useLocation();

  // Generate nav items using the same logic as navbar
  const navItems = useMemo(
    () =>
      getNavLinks(t, currentLanguage, location.pathname)
        // Filter out Home and Contact links for the floating nav
        .filter((item) => item.key !== 'Home' && item.key !== 'Contact'),
    [t, currentLanguage, location.pathname]
  );

  // Wrap onNavClick to ensure it's called
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (onNavClick) {
      onNavClick(event);
    }
  };

  useLayoutEffect(() => {
    if (!containerRef.current || !svgRef.current) return;

    const items = itemsRef.current.filter((item): item is HTMLAnchorElement => item !== null);
    if (items.length === 0) return;

    // Calculate positions for circuit lines
    const updateCircuitLines = () => {
      const svg = svgRef.current;
      if (!svg) return;

      // Clear previous lines
      const lines = svg.querySelectorAll('line, path');
      lines.forEach((line) => line.remove());

      // Get item positions
      const positions = items.map((item) => {
        const rect = item.getBoundingClientRect();
        const svgRect = svg.getBoundingClientRect();
        return {
          x: rect.left - svgRect.left + rect.width / 2,
          y: rect.top - svgRect.top + rect.height / 2,
        };
      });

      // Draw connecting lines between adjacent items
      for (let i = 0; i < positions.length - 1; i++) {
        const start = positions[i];
        const end = positions[i + 1];

        // Create path with circuit-like appearance
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const midX = (start.x + end.x) / 2;
        const midY = (start.y + end.y) / 2;
        const offset = 15;

        path.setAttribute('d', `M ${start.x} ${start.y} Q ${midX} ${midY - offset} ${end.x} ${end.y}`);
        path.setAttribute('stroke', '#0a84ff');
        path.setAttribute('stroke-width', '2');
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke-linecap', 'round');
        path.setAttribute('class', 'circuit-line');
        path.style.filter = 'drop-shadow(0 0 6px rgba(10, 132, 255, 0.6))';
        path.style.opacity = '0';

        svg.appendChild(path);

        // Animate line drawing
        const length = (path as SVGPathElement).getTotalLength?.() || 0;
        if (length) {
          path.style.strokeDasharray = String(length);
          path.style.strokeDashoffset = String(length);

          gsap.to(path, {
            strokeDashoffset: 0,
            opacity: 1,
            duration: 1.5,
            ease: 'power2.inOut',
            delay: i * 0.2,
          });
        }
      }

      // Pulse animation for lines
      gsap.to('.circuit-line', {
        opacity: 0.6,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    };

    updateCircuitLines();

    // Add particle effect to each nav item
    items.forEach((item, idx) => {
      // Create particle container
      const particleContainer = document.createElement('div');
      particleContainer.className = 'particle-container';
      particleContainer.style.position = 'absolute';
      particleContainer.style.inset = '0';
      particleContainer.style.pointerEvents = 'none';
      item.appendChild(particleContainer);

      // Create particles
      for (let i = 0; i < 4; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = '3px';
        particle.style.height = '3px';
        particle.style.borderRadius = '50%';
        particle.style.backgroundColor = '#0a84ff';
        particle.style.boxShadow = '0 0 6px #0a84ff';
        particle.style.left = '50%';
        particle.style.top = '50%';
        particle.style.opacity = '0';
        particleContainer.appendChild(particle);

        // Animate particles in different directions
        const angle = (i / 4) * Math.PI * 2;
        const distance = 30;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;

        gsap.to(particle, {
          x: tx,
          y: ty,
          opacity: 0,
          duration: 0.8,
          ease: 'power1.out',
          repeat: -1,
          repeatDelay: 2 + idx * 0.3,
          delay: idx * 0.2,
        });
      }
    });

    // Handle window resize
    const handleResize = () => {
      updateCircuitLines();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      gsap.killTweensOf('.circuit-line');
      gsap.killTweensOf("[class*='particle']");
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="text-primary relative inline-flex items-center gap-8 text-[0.55rem] font-bold tracking-[0.4em] uppercase"
    >
      <svg ref={svgRef} className="pointer-events-none absolute inset-0 -z-10 h-full w-full overflow-visible" />
      {navItems.map((item, idx) => (
        <a
          key={item.pathname}
          href={item.pathname}
          ref={(el) => {
            if (el) {
              itemsRef.current[idx] = el;
            }
          }}
          onClick={handleClick}
          className="group relative inline-block px-3 py-2 text-cyan-400 transition duration-300 hover:text-cyan-300 hover:drop-shadow-[0_0_12px_rgba(10,132,255,0.8)]"
        >
          <span className="relative z-10 inline-block">{item.label}</span>
          <span className="via-primary pointer-events-none absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-linear-to-r from-transparent via-cyan-400 to-transparent transition-transform duration-300 ease-out group-hover:scale-x-100" />
        </a>
      ))}
    </div>
  );
}
