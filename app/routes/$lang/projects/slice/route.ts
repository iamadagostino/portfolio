import { createLocalizedLoader } from '../../../locale-loader';

// Use the DRY localized loader
export const loader = createLocalizedLoader();

export { Slice as default, meta } from './slice';
