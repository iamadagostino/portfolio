import { createLocalizedLoader } from '../../locale-loader';

// Use the DRY localized loader
export const loader = createLocalizedLoader();

// We need to create a proper details component
export default function Details() {
  return (
    <div>
      <h1>Details</h1>
      <p>Details content goes here</p>
    </div>
  );
}

export const meta = () => {
  return [
    { title: 'Details' },
    { name: 'description', content: 'Project and career details.' },
  ];
};

export const handle = {
  i18n: ['common'],
};
