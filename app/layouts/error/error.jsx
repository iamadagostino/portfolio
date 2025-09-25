import flatlinePoster from '~/assets/images/errors/flatline.png';
import notFoundPoster from '~/assets/images/errors/notfound.jpg';
import flatlineVideo from '~/assets/videos/errors//flatline.mp4';
import notFoundVideo from '~/assets/videos/errors/notfound.mp4';
import { Button } from '~/components/button';
import { DecoderText } from '~/components/decoder-text';
import { Heading } from '~/components/heading';
import { Image } from '~/components/image';
import { Text } from '~/components/text';
import { Transition } from '~/components/transition';
import { useCurrentLanguage, useErrorTranslation } from '~/i18n/i18n.hooks';
import flatlineSkull from './error-flatline.svg';
import styles from './error.module.css';

export function Error({ error }) {
  const { t } = useErrorTranslation();
  const currentLanguage = useCurrentLanguage();
  const flatlined = !error.status;

  // Generate locale-aware home link
  const homeLink = `/${currentLanguage}`;

  const getMessage = () => {
    switch (error.status) {
      case 404:
        return {
          summary: t('errors.404.summary'),
          message: t('errors.404.message'),
        };
      case 405:
        return {
          summary: t('errors.405.summary'),
          message: error.data,
        };
      default:
        return {
          summary: t('errors.default.summary'),
          message: error.statusText || error.data || error.toString(),
        };
    }
  };

  const { summary, message } = getMessage();

  return (
    <section className={styles.page}>
      {flatlined && (
        <style
          dangerouslySetInnerHTML={{
            __html: `
            body[data-theme='dark'] {
              --primary: oklch(69.27% 0.242 25.41);
              --accent: oklch(69.27% 0.242 25.41);
            }
            body[data-theme='light'] {
              --primary: oklch(56.29% 0.182 26.5);
              --accent: oklch(56.29% 0.182 26.5);
            }
          `,
          }}
        />
      )}
      <Transition in>
        {({ visible }) => (
          <>
            <div className={styles.details}>
              <div className={styles.text}>
                {!flatlined && (
                  <Heading className={styles.title} data-visible={visible} level={0} weight="bold">
                    {error.status}
                  </Heading>
                )}
                {flatlined && (
                  <Heading className={styles.titleFlatline} data-visible={visible} level={2} as="h1">
                    <svg width="60" height="80" viewBox="0 0 60 80">
                      <use href={`${flatlineSkull}#skull`} />
                    </svg>
                    <DecoderText text={t('errors.flatlined.title')} start={visible} delay={300} />
                  </Heading>
                )}
                {!flatlined && (
                  <Heading aria-hidden className={styles.subheading} data-visible={visible} as="h2" level={4}>
                    <DecoderText text={summary} start={visible} delay={300} />
                  </Heading>
                )}
                <Text className={styles.description} data-visible={visible} as="p">
                  {message}
                </Text>
                {flatlined ? (
                  <Button
                    secondary
                    iconHoverShift
                    className={styles.button}
                    data-visible={visible}
                    href="https://www.youtube.com/watch?v=EuQzHGcsjlA"
                    icon="chevron-right"
                  >
                    {t('errors.flatlined.button')}
                  </Button>
                ) : (
                  <Button
                    secondary
                    iconHoverShift
                    className={styles.button}
                    data-visible={visible}
                    href={homeLink}
                    icon="chevron-right"
                  >
                    {t('errors.notFound.button')}
                  </Button>
                )}
              </div>
            </div>

            <div className={styles.videoContainer} data-visible={visible}>
              <Image
                reveal
                cover
                noPauseButton
                delay={600}
                className={styles.video}
                src={flatlined ? flatlineVideo : notFoundVideo}
                placeholder={flatlined ? flatlinePoster : notFoundPoster}
              />
              {flatlined ? (
                <a
                  className={styles.credit}
                  data-visible={visible}
                  href="https://www.imdb.com/title/tt0318871/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('errors.flatlined.credit')}
                </a>
              ) : (
                <a
                  className={styles.credit}
                  data-visible={visible}
                  href="https://www.imdb.com/title/tt0113568/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('errors.notFound.credit')}
                </a>
              )}
            </div>
          </>
        )}
      </Transition>
    </section>
  );
}
