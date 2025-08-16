import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const LanguagePrompt = () => {
  const { i18n } = useTranslation();

  // ❌ Disabled prompt
  /*
  useEffect(() => {
    const hasPrompted = localStorage.getItem('languagePrompted');

    if (!hasPrompted && i18n.language !== 'ar') {
      const switchToArabic = window.confirm(
        "This site is in Arabic. Would you like to switch to Arabic?"
      );
      if (switchToArabic) {
        i18n.changeLanguage('ar');
      }
      localStorage.setItem('languagePrompted', 'true');
    }
  }, [i18n]);
  */

  return null;
};

export default LanguagePrompt;
