import { Fragment, useState } from 'react';
import profileImgLarge from '~/assets/images/misc/profile-large.jpg';
import profileImgPlaceholder from '~/assets/images/misc/profile-placeholder.jpg';
import profileImg from '~/assets/images/misc/profile.jpg';
import { Button } from '~/components/main/button';
import { DecoderText } from '~/components/main/decoder-text';
import { Divider } from '~/components/main/divider';
import { Heading } from '~/components/main/heading';
import { Image } from '~/components/main/image';
import { Section } from '~/components/main/section';
import { Text } from '~/components/main/text';
import { useTheme } from '~/components/main/theme-provider';
import { Transition } from '~/components/main/transition';
import { useCurrentLanguage, useHomeTranslation, useNavbarTranslation } from '~/i18n/i18n.hooks';
import { cssProps, media } from '~/utils/style';
import katakana from './katakana.svg';
import styles from './profile.module.css';

const ProfileText = ({ visible, titleId }) => {
  const { t } = useHomeTranslation();

  return (
    <Fragment>
      <Heading className={styles.title} data-visible={visible} level={3} id={titleId}>
        <DecoderText text={t('profile.greeting')} start={visible} delay={500} />
      </Heading>
      <Text className={styles.description} data-visible={visible} size="l" as="p">
        {t('profile.intro')}
      </Text>
      <Text className={styles.description} data-visible={visible} size="l" as="p">
        {t('profile.interests')}
      </Text>
    </Fragment>
  );
};

export const Profile = ({ id, visible, sectionRef }) => {
  const [focused, setFocused] = useState(false);
  const { t } = useHomeTranslation();
  const currentLanguage = useCurrentLanguage();
  const { t: tNav } = useNavbarTranslation();
  const titleId = `${id}-title`;
  const { theme } = useTheme();
  const svgOpacity = theme === 'light' ? 0.7 : 1;

  return (
    <Section
      className={styles.profile}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      as="section"
      id={id}
      ref={sectionRef}
      aria-labelledby={titleId}
      tabIndex={-1}
    >
      <Transition in={visible || focused} timeout={0}>
        {({ visible, nodeRef }) => (
          <div className={styles.content} ref={nodeRef}>
            <div className={styles.column}>
              <ProfileText visible={visible} titleId={titleId} />
              <Button
                secondary
                className={styles.button}
                data-visible={visible}
                href={`/${currentLanguage}/${tNav('slugs.contact', { defaultValue: 'contact' })}`}
                icon="send"
              >
                {t('profile.cta')}
              </Button>
            </div>
            <div className={styles.column}>
              <div className={styles.tag} aria-hidden>
                <Divider notchWidth="64px" notchHeight="8px" collapsed={!visible} collapseDelay={1000} />
                <div className={styles.tagText} data-visible={visible}>
                  {t('profile.tagLabel')}
                </div>
              </div>
              <div className={styles.image}>
                <svg
                  data-visible={visible}
                  data-light={theme === 'light'}
                  style={cssProps({ opacity: svgOpacity })}
                  className={styles.svg}
                  viewBox="0 0 136 766"
                >
                  <use href={`${katakana}#katakana-profile`} />
                </svg>
                <Image
                  reveal
                  delay={100}
                  placeholder={profileImgPlaceholder}
                  srcSet={`${profileImg} 480w, ${profileImgLarge} 960w`}
                  width={960}
                  height={1280}
                  sizes={`(max-width: ${media.mobile}px) 100vw, 480px`}
                  alt={t('profile.imageAlt')}
                />
              </div>
            </div>
          </div>
        )}
      </Transition>
    </Section>
  );
};
