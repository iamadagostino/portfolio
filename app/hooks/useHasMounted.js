import { useState } from 'react';

export function useHasMounted() {
  const [mounted] = useState(true);

  return mounted;
}
