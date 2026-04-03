import { Logo } from '@/components/main/logo';
import { StoryContainer } from '../../../../.storybook/story-container';

export default {
  title: 'Logo',
};

export const Default = () => (
  <StoryContainer>
    <Logo highlight />
  </StoryContainer>
);
