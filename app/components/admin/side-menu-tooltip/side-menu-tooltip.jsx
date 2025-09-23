import { useRef, createElement, useEffect } from 'react';
import { Tippy } from '~/components/admin/base';
import PropTypes from 'prop-types';
import dom from '@left4code/tw-starter/dist/js/dom';

const toggleTooltip = el => {
  // Only run on client side
  if (typeof window === 'undefined' || !el || !el._tippy) return;

  if (dom(window).width() <= 1260) {
    el._tippy.enable();
  } else {
    el._tippy.disable();
  }
};

const initTooltipEvent = tippyRef => {
  // Only run on client side
  if (typeof window === 'undefined') return;

  window.addEventListener('resize', () => {
    toggleTooltip(tippyRef);
  });
};

export function SideMenuTooltip(props) {
  const tippyRef = useRef();

  useEffect(() => {
    // Only run client-side logic in useEffect
    if (typeof window !== 'undefined' && tippyRef.current) {
      toggleTooltip(tippyRef.current);
      initTooltipEvent(tippyRef.current);
    }
  }, []);

  const { tag, ...computedProps } = props;
  return createElement(
    Tippy,
    {
      ...computedProps,
      tag: tag,
      options: { placement: 'left' },
      getRef: el => {
        tippyRef.current = el;
        // Only call toggleTooltip on client side and after component mount
        if (typeof window !== 'undefined' && el) {
          toggleTooltip(el);
        }
      },
    },
    props.children
  );
}

SideMenuTooltip.propTypes = {
  tag: PropTypes.string,
};

SideMenuTooltip.defaultProps = {
  tag: 'span',
};
