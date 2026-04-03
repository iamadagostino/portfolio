import { createLocalizedLoader } from '../../locale-loader';

// Use the DRY localized loader
export const loader = createLocalizedLoader();

export { default, handle, meta } from './3d-experience';
