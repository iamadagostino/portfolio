import { createLocalizedLoader } from '../../locale-loader';

// Use the DRY localized loader
export const loader = createLocalizedLoader();

// Re-export everything from home
export { Home as default, meta, links, handle } from './home.jsx';
