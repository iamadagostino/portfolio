import { StoryContainer } from '../../../../.storybook/story-container';
import { Icon } from './icon';
import manifest from './manifest.json';

export default {
  title: 'Icon',
};

export const Icons = () => {
  return (
    <StoryContainer stretch={undefined} vertical={undefined} style={undefined}>
      {Object.keys(manifest).map((key) => (
        <Icon key={key} icon={key} />
      ))}
    </StoryContainer>
  );
};
