import { createLocalizedLoader } from '../../locale-loader';

// Use the DRY localized loader
export const loader = createLocalizedLoader();

// Re-export everything from contact
export { Contact as default, meta, action, handle } from './contact';
