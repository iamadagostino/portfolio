import { Loader } from '~/components/main/loader';
import { StoryContainer } from '../../../../.storybook/story-container';

export default {
  title: 'Loader',
};

export const Default = () => (
  <StoryContainer>
    <Loader width={48} />
  </StoryContainer>
);
