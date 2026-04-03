import { createLocalizedLoader } from '../../locale-loader';

// Use the DRY localized loader
export const loader = createLocalizedLoader();

// Re-export everything from home
// export { Home as default, handle, links, meta } from './home.jsx';

export { Hero as default, handle, meta } from './hero';
