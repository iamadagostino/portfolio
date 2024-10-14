import { Icon } from '~/components/icon';
import { StoryContainer } from '../../../.storybook/story-container';
import manifest from '~/components/icon/manifest.json';

export default {
  title: 'Icon',
};

export const Icons = () => {
  return (
    <StoryContainer stretch={undefined} vertical={undefined} style={undefined}>
      {Object.keys(manifest).map(key => (
        <Icon key={key} icon={key} />
      ))}
    </StoryContainer>
  );
};
