import React from 'react';
import {useLanguage} from '../contexts/LanguageContext';

export default function LanguageContextTest() {
  const language = useLanguage();

  return (
    <div>
      <p>current language = {language}</p>
    </div>
  );
}
