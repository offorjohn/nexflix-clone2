// src/components/LanguagePrompt.jsx
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const LanguagePrompt = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    // Check if the user has already been prompted
    const hasPrompted = localStorage.getItem('languagePrompted');

    if (!hasPrompted && i18n.language !== 'ar') {
      const switchToArabic = window.confirm(
        "This site is in Arabic. Would you like to switch to Arabic?"
      );
      if (switchToArabic) {
        i18n.changeLanguage('ar');
      }
      // Mark that the user has been prompted
      localStorage.setItem('languagePrompted', 'true');
    }
  }, [i18n]);

  return null; // This component doesn't render anything visible
};

export default LanguagePrompt;
