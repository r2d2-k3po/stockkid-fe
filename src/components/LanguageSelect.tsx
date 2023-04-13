import React, {ChangeEvent, useContext} from 'react';
import {
  LanguageContext,
  LanguageContextType
} from '../contexts/LanguageContext';

export default function LanguageSelect() {
  const {language, setLanguage} = useContext(
    LanguageContext
  ) as LanguageContextType;

  const handleChangeLanguage = (e: ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation();
    setLanguage(e.target.value);
    localStorage.setItem('language', e.target.value);
  };

  return (
    <select
      className="select select-info w-full max-w-xs"
      onChange={handleChangeLanguage}
      value={language}
    >
      <option value="ko">한국어</option>
      <option value="en">English</option>
    </select>
  );
}
