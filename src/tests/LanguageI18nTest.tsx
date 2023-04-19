import React from 'react';
import {useTranslation} from 'react-i18next';

export default function LanguageI18nTest() {
  const {t, i18n} = useTranslation();

  return (
    <div>
      <p>current language = {i18n.language}</p>
      <h1>{t('title')}</h1>
      <h1>{t('description.part1')}</h1>
    </div>
  );
}
