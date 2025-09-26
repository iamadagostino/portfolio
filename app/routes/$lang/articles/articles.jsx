import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useLoaderData } from 'react-router';
import { classes, cssProps } from '~/utils/style';

import { useReducedMotion } from 'framer-motion';
import { Button } from '~/components/main/button';
import { DecoderText } from '~/components/main/decoder-text';
import { Divider } from '~/components/main/divider';
import { Footer } from '~/components/main/footer';
import { Heading } from '~/components/main/heading';
import { Image } from '~/components/main/image';
import { Section } from '~/components/main/section';
import { Text } from '~/components/main/text';
import { useWindowSize } from '~/hooks';
import { formatDate } from '~/utils/date';
import styles from './articles.module.css';

function ArticlesPost({ slug, translation, featured, banner, readTime, publishedAt, index, lang = 'en' }) {
  const [hovered, setHovered] = useState(false);
  const [dateTime, setDateTime] = useState(null);
  const reduceMotion = useReducedMotion();
  const { t } = useTranslation('articles');

  // Extract data from translation or use defaults
  const title = translation?.title || slug;
  const abstract = translation?.abstract || '';
  const readingTime = readTime;

  // Use locale-specific slug if available, otherwise fall back to main slug
  const postSlug = translation?.slug || slug;

  useEffect(() => {
    const date = publishedAt || new Date();
    setDateTime(formatDate(date, lang));
  }, [publishedAt, lang]);

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  return (
    <article
      className={styles.post}
      data-featured={!!featured}
      style={index !== undefined ? cssProps({ delay: index * 100 + 200 }) : undefined}
    >
      {featured && (
        <Text className={styles.postLabel} size="s">
          {t('featured', 'Featured')}
        </Text>
      )}
      {featured && !!banner && (
        <div className={styles.postImage}>
          <Image
            noPauseButton
            play={!reduceMotion ? hovered : undefined}
            src={banner}
            placeholder={`${banner.split('.')[0]}-placeholder.jpg`}
            alt=""
            role="presentation"
          />
        </div>
      )}
      <RouterLink
        viewTransition
        prefetch="intent"
        to={`/${lang}/article/${postSlug}`}
        className={styles.postLink}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className={styles.postDetails}>
          <div aria-hidden className={styles.postDate}>
            <Divider notchWidth="64px" notchHeight="8px" />
            {dateTime}
          </div>
          <Heading as="h2" level={featured ? 2 : 4}>
            {title}
          </Heading>
          <Text size={featured ? 'l' : 's'} as="p">
            {abstract}
          </Text>
          <div className={styles.postFooter}>
            <Button secondary iconHoverShift icon="chevron-right" as="div">
              {t('readMore', 'Read article')}
            </Button>
            <Text className={styles.timecode} size="s">
              {readingTime
                ? t('readTime', '{{minutes}} min read', { minutes: readingTime })
                : t('readTime', '{{minutes}} min read', { minutes: 5 })}
            </Text>
          </div>
        </div>
      </RouterLink>
      {featured && (
        <Text aria-hidden className={styles.postTag} size="s">
          477
        </Text>
      )}
    </article>
  );
}

function SkeletonPost({ index }) {
  const { t } = useTranslation('articles');

  return (
    <article
      aria-hidden="true"
      className={classes(styles.post, styles.skeleton)}
      data-featured="false"
      style={index !== undefined ? cssProps({ delay: index * 100 + 200 }) : undefined}
    >
      <div className={styles.postLink}>
        <div className={styles.postDetails}>
          <div aria-hidden className={styles.postDate}>
            <Divider notchWidth="64px" notchHeight="8px" />
            {t('comingSoon', 'Coming soon...')}
          </div>
          <Heading className={styles.skeletonBone} as="h2" level={4} style={{ height: 24, width: '70%' }} />
          <Text className={styles.skeletonBone} size="s" as="p" style={{ height: 90, width: '100%' }} />
          <div className={styles.postFooter}>
            <Button secondary iconHoverShift icon="chevron-right" as="div">
              {t('readMore', 'Read article')}
            </Button>
            <Text className={styles.timecode} size="s">
              00:00:00:00
            </Text>
          </div>
        </div>
      </div>
    </article>
  );
}

export function Articles() {
  const { posts, featured, lang } = useLoaderData();
  const { width } = useWindowSize();
  const { t } = useTranslation('articles');
  const singleColumnWidth = 1190;
  const isSingleColumn = width <= singleColumnWidth;

  const postsHeader = (
    <header className={styles.header}>
      <Heading className={styles.heading} level={5} as="h1">
        <DecoderText text={t('title', 'Latest articles')} />
      </Heading>
      <Barcode className={styles.barcode} />
    </header>
  );

  const postList = (
    <div className={styles.list}>
      {!isSingleColumn && postsHeader}
      {posts.map((post, index) => (
        <ArticlesPost key={post.slug} index={index} lang={lang} {...post} />
      ))}
      {Array(2)
        .fill()
        .map((skeleton, index) => (
          <SkeletonPost key={index} index={index} />
        ))}
    </div>
  );

  const featuredPost = featured ? <ArticlesPost {...featured} lang={lang} /> : null;

  return (
    <article className={styles.articles}>
      <Section className={styles.content}>
        {!isSingleColumn && (
          <div className={styles.grid}>
            {postList}
            {featuredPost}
          </div>
        )}
        {isSingleColumn && (
          <div className={styles.grid}>
            {postsHeader}
            {featuredPost}
            {postList}
          </div>
        )}
      </Section>
      <Footer />
    </article>
  );
}

function Barcode({ className }) {
  return (
    <svg className={className} width="153" height="20" fill="currentColor" viewBox="0 0 153 20">
      <path
        fillOpacity=".6"
        d="M153 0v20h-2V0h2Zm-4 0v20h-4V0h4Zm-6 0v20h-2V0h2Zm-4 4v3h-2V4h2Zm-5 0V0h3v4h-3Zm-2 0h2v6h-2V4Zm0 0h-2V0h2v4Zm-4-4v4h-4v5h-2v4h-5V9h3V6h-5V0h13Zm-11 13v3h-2v-3h2Zm-4-13v6h-2v4h2v4h-2v2h2v4h-4V0h4Zm-6 4V0h-2v4h2Zm-1 6V7h-4V4h-2V0h-2v4h-2V0H86v4h-2v3h-2v2h-2v4h6v3h-2v4h6v-4h-2v-3h-2V9h-2V7h4V4h3v9h2v7h7v-4h-5v-3h-2V9h2V7h3v3h2v4h6v-4ZM74 7v3h-2v2h2v8h-4V0h8v5h-3V4h-3v3h2Zm28 13h4v-4h-4v4Zm28-6v-4h-2v6h2v4h2v-6h-2Zm9 2v-6h-2v6h-2v4h4v-4Zm-12 4v-4h-4v4h4ZM0 20h2V0H0v20Zm4 0h4V0H4v20Zm6 0h2V0h-2v20Zm5 0h7V0h-7v20Zm12 0h-3V0h3v20Zm5 0h3v-4h5v-6h-5V6h7V3h3V0h-7v3h-3V0h-3v20ZM52 3v3h-3v3h-4V6h1V3h6Zm23 13h6v4h-6v-4Zm-29-6v3h3v-3h3v3h-2v6h-3v-3h-2v-3h-2v-3h3Zm8 6v3h-2v-3h2Zm3 0v3h2v-3h2v-3h-2v3h-2Zm0 0v-6h-3v6h3Zm4-7V6h2V0h-2v6h-2v3h2Zm5-3v3h-2V6h2Zm2 0h-2V3h2v3Zm-9-3V0h-2v3h2Z"
      />
    </svg>
  );
}
