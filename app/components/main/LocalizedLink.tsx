import { Link, type LinkProps } from 'react-router';
import { useLocalizedNavigation } from '~/utils/navigation';

interface LocalizedLinkProps extends Omit<LinkProps, 'to'> {
  routeKey: string;
  slug?: string;
}

export function LocalizedLink({ routeKey, slug, children, ...linkProps }: LocalizedLinkProps) {
  const { getPath } = useLocalizedNavigation();
  
  return (
    <Link to={getPath(routeKey, slug)} {...linkProps}>
      {children}
    </Link>
  );
}