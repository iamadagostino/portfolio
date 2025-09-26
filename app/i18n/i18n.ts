import { availableNamespaces, defaultLanguage, supportedLanguages } from './i18n.resources';

const defaultNamespace = availableNamespaces.includes('common')
  ? 'common'
  : availableNamespaces[0] ?? 'translation';

const supportedLanguageList = [...supportedLanguages];
const namespaceList = [...availableNamespaces];

export default {
  // This is the list of languages your application supports
  supportedLngs: supportedLanguageList,
  // The language to use when a requested language is not available
  fallbackLng: defaultLanguage,
  // The default namespace i18next uses when none is specified
  defaultNS: defaultNamespace,
  // Load all statically discovered namespaces by default
  ns: namespaceList,
};
