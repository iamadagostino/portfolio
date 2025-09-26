import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { Form, useActionData, useNavigation } from 'react-router';
import { cssProps, msToNum, numToMs } from '~/utils/style';

import { useEffect, useRef } from 'react';
import { Button } from '~/components/main/button';
import { DecoderText } from '~/components/main/decoder-text';
import { Divider } from '~/components/main/divider';
import { Footer } from '~/components/main/footer';
import { Heading } from '~/components/main/heading';
import { Icon } from '~/components/main/icon';
import { Input } from '~/components/main/input';
import { Section } from '~/components/main/section';
import { Text } from '~/components/main/text';
import { Transition } from '~/components/main/transition';
import { tokens } from '~/config/theme.mjs';
import { useFormInput } from '~/hooks';
import { useContactTranslation, useCurrentLanguage } from '~/i18n/i18n.hooks';
import { resources } from '~/i18n/i18n.resources';
import { baseMeta } from '~/utils/meta';
import styles from './contact.module.css';

export const handle = {
  i18n: ['common', 'navbar', 'contact'],
};

export const meta = ({ params }) => {
  // Determine the language from URL params (for localized routes) or default to English
  const lang = params?.lang === 'it' ? 'it' : 'en';

  // Access translations directly from resources
  const contactTranslations = resources[lang].contact;

  return baseMeta({
    title: contactTranslations.title,
    description: contactTranslations.metaDescription,
  });
};

const MAX_EMAIL_LENGTH = 512;
const MAX_MESSAGE_LENGTH = 4096;
const EMAIL_PATTERN = /(.+)@(.+){2,}\.(.+){2,}/;

export async function action({ context, request }) {
  // Get the language from the URL path
  const url = new URL(request.url);
  const pathSegments = url.pathname.split('/').filter(Boolean);
  const lang = pathSegments[0] === 'it' ? 'it' : 'en';

  // Get translations for server-side validation and email
  const contactTranslations = resources[lang].contact;

  const ses = new SESClient({
    region: 'us-east-1',
    credentials: {
      accessKeyId: context.cloudflare.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: context.cloudflare.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  const formData = await request.formData();
  const isBot = String(formData.get('name'));
  const email = String(formData.get('email'));
  const message = String(formData.get('message'));
  const errors = {};

  // Return without sending if a bot trips the honeypot
  if (isBot) return { success: true };

  // Handle input validation on the server with localized messages
  if (!email || !EMAIL_PATTERN.test(email)) {
    errors.email = contactTranslations.invalidEmail;
  }

  if (!message) {
    errors.message = contactTranslations.messageRequired;
  }

  if (email.length > MAX_EMAIL_LENGTH) {
    errors.email = contactTranslations.emailTooLong.replace('{{length}}', MAX_EMAIL_LENGTH);
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    errors.message = contactTranslations.messageTooLong.replace('{{length}}', MAX_MESSAGE_LENGTH);
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  // Send email via Amazon SES with localized subject and content
  await ses.send(
    new SendEmailCommand({
      Destination: {
        ToAddresses: [context.cloudflare.env.EMAIL],
      },
      Message: {
        Body: {
          Text: {
            Data: `${contactTranslations.emailFrom.replace('{{email}}', email)}\n\n${message}`,
          },
        },
        Subject: {
          Data: contactTranslations.emailSubject.replace('{{email}}', email),
        },
      },
      Source: `Portfolio <${context.cloudflare.env.FROM_EMAIL}>`,
      ReplyToAddresses: [email],
    })
  );

  return { success: true };
}

export const Contact = () => {
  const { t } = useContactTranslation();
  const currentLanguage = useCurrentLanguage();
  const errorRef = useRef();
  const email = useFormInput('');
  const message = useFormInput('');
  const initDelay = tokens.base.durationS;
  const actionData = useActionData();
  const { state } = useNavigation();
  const sending = state === 'submitting';

  // Focus email input after DecoderText animation completes
  useEffect(() => {
    if (!actionData?.success) {
      const timer = setTimeout(() => {
        const emailInput = document.querySelector('input[name="email"]');
        if (emailInput) {
          emailInput.focus();
        }
      }, 1800); // Wait for DecoderText animation to complete (300ms delay + ~1500ms animation)
      return () => clearTimeout(timer);
    }
  }, [actionData?.success]);

  // Generate locale-aware home link
  const homeLink = `/${currentLanguage}`;

  return (
    <Section className={styles.contact}>
      <Transition unmount in={!actionData?.success} timeout={1600}>
        {({ status, nodeRef }) => (
          <Form viewTransition className={styles.form} method="post" ref={nodeRef}>
            <Heading
              className={styles.title}
              data-status={status}
              level={3}
              as="h1"
              style={getDelay(tokens.base.durationXS, initDelay, 0.3)}
            >
              <DecoderText text={t('sayHello')} start={status !== 'exited'} delay={300} />
            </Heading>
            <Divider
              className={styles.divider}
              data-status={status}
              style={getDelay(tokens.base.durationXS, initDelay, 0.4)}
            />
            {/* Hidden honeypot field to identify bots */}
            <Input className={styles.botkiller} label="Name" name="name" maxLength={MAX_EMAIL_LENGTH} />
            <Input
              required
              className={styles.input}
              data-status={status}
              style={getDelay(tokens.base.durationXS, initDelay)}
              autoComplete="email"
              label={t('yourEmail')}
              type="email"
              name="email"
              maxLength={MAX_EMAIL_LENGTH}
              {...email}
            />
            <Input
              required
              multiline
              className={styles.input}
              data-status={status}
              style={getDelay(tokens.base.durationS, initDelay)}
              autoComplete="off"
              label={t('message')}
              name="message"
              maxLength={MAX_MESSAGE_LENGTH}
              {...message}
            />
            <Transition unmount in={!sending && actionData?.errors} timeout={msToNum(tokens.base.durationM)}>
              {({ status: errorStatus, nodeRef }) => (
                <div
                  className={styles.formError}
                  ref={nodeRef}
                  data-status={errorStatus}
                  style={cssProps({
                    height: errorStatus ? errorRef.current?.offsetHeight : 0,
                  })}
                >
                  <div className={styles.formErrorContent} ref={errorRef}>
                    <div className={styles.formErrorMessage}>
                      <Icon className={styles.formErrorIcon} icon="error" />
                      {actionData?.errors?.email}
                      {actionData?.errors?.message}
                    </div>
                  </div>
                </div>
              )}
            </Transition>
            <Button
              className={styles.button}
              data-status={status}
              data-sending={sending}
              style={getDelay(tokens.base.durationM, initDelay)}
              disabled={sending}
              loading={sending}
              loadingText={t('sending')}
              icon="send"
              type="submit"
            >
              {t('send')}
            </Button>
          </Form>
        )}
      </Transition>
      <Transition unmount in={actionData?.success}>
        {({ status, nodeRef }) => (
          <div className={styles.complete} aria-live="polite" ref={nodeRef}>
            <Heading level={3} as="h3" className={styles.completeTitle} data-status={status}>
              {t('success')}
            </Heading>
            <Text
              size="l"
              as="p"
              className={styles.completeText}
              data-status={status}
              style={getDelay(tokens.base.durationXS)}
            >
              {t('successMessage')}
            </Text>
            <Button
              secondary
              iconHoverShift
              className={styles.completeButton}
              data-status={status}
              style={getDelay(tokens.base.durationM)}
              href={homeLink}
              icon="chevron-right"
            >
              {t('backToHome')}
            </Button>
          </div>
        )}
      </Transition>
      <Footer className={styles.footer} />
    </Section>
  );
};

function getDelay(delayMs, offset = numToMs(0), multiplier = 1) {
  const numDelay = msToNum(delayMs) * multiplier;
  return cssProps({ delay: numToMs((msToNum(offset) + numDelay).toFixed(0)) });
}
