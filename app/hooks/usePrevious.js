import { useEffect, useRef, useState } from 'react';

export function usePrevious(value) {
  const ref = useRef();
  const [previous, setPrevious] = useState(undefined);

  useEffect(() => {
    setPrevious(ref.current);
    ref.current = value;
  }, [value]);

  return previous;
}
