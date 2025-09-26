import { useRef } from 'react';
import { Link as RouterLink } from 'react-router';
import { Divider } from '~/components/main/divider';
import { Footer } from '~/components/main/footer';
import { Heading } from '~/components/main/heading';
import { Image } from '~/components/main/image';
import { Section } from '~/components/main/section';
import { Text } from '~/components/main/text';
import { tokens } from '~/components/main/theme-provider/theme';
import { Transition } from '~/components/main/transition';
import { useParallax, useScrollToHash } from '~/hooks';
import { clamp } from '~/utils/clamp';
import { formatDate } from '~/utils/date';
import { cssProps, msToNum, numToMs } from '~/utils/style';
import styles from './post.module.css';

export const Post = ({ children, title, date, banner, timecode, language = 'en' }) => {
  const scrollToHash = useScrollToHash();
  const imageRef = useRef();

  // Calculate the formatted date directly during render
  const dateTime = date ? formatDate(date, language) : null;

  useParallax(0.004, (value) => {
    if (!imageRef.current) return;
    imageRef.current.style.setProperty('--blurOpacity', clamp(value, 0, 1));
  });

  const handleScrollIndicatorClick = (event) => {
    event.preventDefault();
    scrollToHash(event.currentTarget.href);
  };

  const placeholder = `${banner?.split('.')[0]}-placeholder.jpg`;

  return (
    <article className={styles.post}>
      <Section>
        {banner && (
          <div className={styles.banner} ref={imageRef}>
            <div className={styles.bannerImage}>
              <Image role="presentation" src={banner} placeholder={placeholder} alt="" />
            </div>
            <div className={styles.bannerImageBlur}>
              <Image role="presentation" src={placeholder} placeholder={placeholder} alt="" />
            </div>
          </div>
        )}
        <header className={styles.header}>
          <div className={styles.headerText}>
            <Transition in timeout={msToNum(tokens.base.durationM)}>
              {({ visible, nodeRef }) => (
                <div className={styles.date} ref={nodeRef}>
                  <Divider notchWidth="64px" notchHeight="8px" collapsed={!visible} />
                  <Text className={styles.dateText} data-visible={visible}>
                    {dateTime}
                  </Text>
                </div>
              )}
            </Transition>
            <Heading level={2} as="h1" className={styles.title} aria-label={title}>
              {title.split(' ').map((word, index) => (
                <span className={styles.titleWordWrapper} key={`${word}-${index}`}>
                  <span className={styles.titleWord} style={cssProps({ delay: numToMs(index * 100 + 100) })}>
                    {word}
                    {index !== title.split(' ').length - 1 ? ' ' : ''}
                  </span>
                </span>
              ))}
            </Heading>
            <div className={styles.details}>
              <RouterLink
                to="#postContent"
                className={styles.arrow}
                aria-label="Scroll to post content"
                onClick={handleScrollIndicatorClick}
              >
                <svg aria-hidden stroke="currentColor" width="43" height="15" viewBox="0 0 43 15">
                  <path d="M1 1l20.5 12L42 1" strokeWidth="2" fill="none" />
                </svg>
              </RouterLink>
              <div className={styles.timecode}>{timecode}</div>
            </div>
          </div>
        </header>
      </Section>
      <Section className={styles.wrapper} id="postContent" tabIndex={-1}>
        <Text as="div" size="l" className={styles.content}>
          {children}
        </Text>
      </Section>
      <Footer />
    </article>
  );
};
