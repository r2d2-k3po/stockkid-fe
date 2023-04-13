import React, {useContext} from 'react';
import {
  LanguageContext,
  LanguageContextType
} from '../contexts/LanguageContext';

export default function LanguageContextTest() {
  const {language} = useContext(LanguageContext) as LanguageContextType;

  return (
    <div>
      <p>current language = {language}</p>
    </div>
  );
}
