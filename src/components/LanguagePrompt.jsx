// src/components/LanguagePrompt.jsx
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const LanguagePrompt = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    // If the current language is not Arabic
    if (i18n.language !== 'ar') {
      // Show a confirmation dialog (you could use a custom modal instead)
      const switchToArabic = window.confirm(
        "This site is in Arabic. Would you like to switch to Arabic?"
      );
      if (switchToArabic) {
        i18n.changeLanguage('ar');
      }
    }
  }, [i18n]);

  return null; // This component doesn't render anything visible
};

export default LanguagePrompt;
