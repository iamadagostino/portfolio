import { createLocalizedLoader } from '../../../locale-loader';

// Use the DRY localized loader
export const loader = createLocalizedLoader();

export { SmartSparrow as default, meta } from './smart-sparrow';
