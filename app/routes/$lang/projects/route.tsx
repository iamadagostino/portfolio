import { createLocalizedLoader } from '../../locale-loader';

// Use the DRY localized loader
export const loader = createLocalizedLoader();

// We need to create a proper projects component - for now using a placeholder
export default function Projects() {
  return (
    <div>
      <h1>Projects</h1>
      <p>Projects content goes here</p>
    </div>
  );
}

export const meta = () => {
  return [
    { title: 'Projects' },
    { name: 'description', content: 'Portfolio projects and work.' },
  ];
};

export const handle = {
  i18n: ['common'],
};
