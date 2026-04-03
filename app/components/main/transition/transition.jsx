import { AnimatePresence, usePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

/**
 * A lightweight Framer Motion `AnimatePresence` implementation of
 * `react-transition-group` to be used for simple vanilla css transitions
 */
export const Transition = ({ children, in: show, unmount, initial = true, ...props }) => {
  const enterTimeoutRef = useRef();
  const exitTimeoutRef = useRef();

  useEffect(() => {
    if (show) {
      clearTimeout(exitTimeoutRef.current);
    } else {
      clearTimeout(enterTimeoutRef.current);
    }
  }, [show]);

  return (
    <AnimatePresence>
      {(show || !unmount) && (
        <TransitionContent
          enterTimeoutRef={enterTimeoutRef}
          exitTimeoutRef={exitTimeoutRef}
          in={show}
          initial={initial}
          {...props}
        >
          {children}
        </TransitionContent>
      )}
    </AnimatePresence>
  );
};

const TransitionContent = ({
  children,
  timeout = 0,
  enterTimeoutRef,
  exitTimeoutRef,
  onEnter,
  onEntered,
  onExit,
  onExited,
  initial,
  nodeRef: defaultNodeRef,
  in: show,
}) => {
  const [status, setStatus] = useState(initial ? 'exited' : 'entered');
  const [isPresent, safeToRemove] = usePresence();
  const [hasEntered, setHasEntered] = useState(initial ? false : true);
  const splitTimeout = typeof timeout === 'object';
  const internalNodeRef = useRef(null);
  const nodeRef = defaultNodeRef || internalNodeRef;
  const visible = hasEntered && show ? isPresent : false;

  useEffect(() => {
    if (hasEntered || !show) return;

    const actualTimeout = splitTimeout ? timeout.enter : timeout;

    clearTimeout(enterTimeoutRef.current);
    clearTimeout(exitTimeoutRef.current);

    setHasEntered(true);
    setStatus('entering');
    onEnter?.();

    // Force reflow
    nodeRef.current?.offsetHeight;

    enterTimeoutRef.current = setTimeout(() => {
      setStatus('entered');
      onEntered?.();
    }, actualTimeout);
  }, [onEnter, onEntered, timeout, status, show, enterTimeoutRef, exitTimeoutRef, hasEntered, nodeRef, splitTimeout]);

  useEffect(() => {
    if (isPresent && show) return;

    const actualTimeout = splitTimeout ? timeout.exit : timeout;

    clearTimeout(enterTimeoutRef.current);
    clearTimeout(exitTimeoutRef.current);

    setStatus('exiting');
    onExit?.();

    // Force reflow
    nodeRef.current?.offsetHeight;

    exitTimeoutRef.current = setTimeout(() => {
      setStatus('exited');
      safeToRemove?.();
    }, actualTimeout);
  }, [
    isPresent,
    onExit,
    safeToRemove,
    timeout,
    onExited,
    show,
    enterTimeoutRef,
    exitTimeoutRef,
    nodeRef,
    splitTimeout,
  ]);

  // eslint-disable-next-line react-hooks/refs
  return children({ visible, status, nodeRef });
};
