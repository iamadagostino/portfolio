import { useCallback, useEffect, useRef, useState } from 'react';

const CURSOR_SPEED = 0.08;

let mouseX = 0;
let mouseY = 0;
let outlineX = 0;
let outlineY = 0;

export const Cursor = () => {
  const cursorOutline = useRef();
  const [hoverButton, setHoverButton] = useState(false);
  const [hoverMenuButton, setHoverMenuButton] = useState(false);
  const [hoverMenuSectionButton, setHoverMenuSectionButton] = useState(false);

  const animate = useCallback(() => {
    let distX = mouseX - outlineX;
    let distY = mouseY - outlineY;

    outlineX = outlineX + distX * CURSOR_SPEED;
    outlineY = outlineY + distY * CURSOR_SPEED;

    if (cursorOutline.current) {
      cursorOutline.current.style.left = `${outlineX}px`;
      cursorOutline.current.style.top = `${outlineY}px`;
    }

    requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const handleMouseMove = (event) => {
      mouseX = event.pageX;
      mouseY = event.pageY;
    };

    document.addEventListener('mousemove', handleMouseMove);
    const animationFrame = requestAnimationFrame(animate);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrame);
    };
  }, [animate]);

  useEffect(() => {
    const handleMouseOver = (e) => {
      const target = e.target;
      if (!(target instanceof HTMLElement)) {
        setHoverButton(false);
        setHoverMenuButton(false);
        setHoverMenuSectionButton(false);
        return;
      }
      // Check if the cursor is hovering over a button, input or textarea
      const closestButton = target.closest('button');
      const isMenuSectionButton =
        closestButton && closestButton.hasAttribute('data-menu-section-button');

      if (
        (closestButton && !isMenuSectionButton) ||
        target.tagName.toLowerCase() === 'input' ||
        target.tagName.toLowerCase() === 'textarea'
      ) {
        setHoverButton(true);
      } else {
        setHoverButton(false);
      }

      // Check if the cursor is hovering over the menu
      if (target.closest('[data-menu-container="true"]')) {
        setHoverMenuButton(true);
      } else {
        setHoverMenuButton(false);
      }

      // Check if the cursor is hovering over a section of the menu
      if (target.closest('[data-menu-nav="true"]')) {
        setHoverMenuSectionButton(true);
      } else {
        setHoverMenuSectionButton(false);
      }
    };

    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <>
      <div
        className={`pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform ${
          hoverButton ? 'h-6 w-6 border-2 border-slate-100 bg-transparent' : 'h-6 w-6 bg-slate-100'
        } ${hoverMenuButton && !hoverButton && 'h-6 w-6 bg-slate-700'} ${hoverMenuSectionButton && 'h-6 w-6 border-2 border-slate-700 bg-transparent'}`}
        ref={cursorOutline}
      ></div>
    </>
  );
};
