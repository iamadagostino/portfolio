import { Link } from '~/components/link';
import { Text } from '~/components/text';
import { classes } from '~/utils/style';
import config from '~/config/app.json';
import styles from './footer.module.css';
import { useCommonTranslation } from '~/i18n/i18n.hooks';

export const Footer = ({ className }) => {
  const { t } = useCommonTranslation();

  return (
    <footer className={classes(styles.footer, className)}>
      <Text size="s" align="center">
        © {new Date().getFullYear()}{' '}
        <Link secondary className={styles.link} href="https://remix.run/" target="_blank">
          {t('footer.remixed')}
        </Link>{' '}
        <span className={styles.date}>{t('footer.withLoveBy')}</span>{' '}
        <Link secondary className={styles.link} href="/humans.txt" target="_self">
          {config.name}
        </Link>
      </Text>
    </footer>
  );
};
